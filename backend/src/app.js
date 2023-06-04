const path = require("path");
const uuid = require("uuid");
const express = require("express");
const session = require("express-session");
const proxy = require("express-http-proxy");

const passport = require("passport");
const OnshapeStrategy = require("passport-onshape");

const config = require("./config");

const app = express();

const bodyParser = require("body-parser");

app.set("trust proxy", 1); // To allow to run correctly behind Heroku

app.use(session({
    secret: config.sessionSecret,
    saveUninitialized: false,
    resave: false,
    cookie: {
        name: "robot-manager",
        sameSite: "none",
        secure: true,
        httpOnly: true,
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new OnshapeStrategy({
    clientID: config.oauthClientId,
    clientSecret: config.oauthClientSecret,
    callbackURL: config.oauthCallbackUrl,
    authorizationURL: `${config.oauthUrl}/oauth/authorize`,
    tokenURL: `${config.oauthUrl}/oauth/token`,
    userProfileURL: `${config.oauthUrl}/api/users/sessioninfo`
},
    (accessToken, refreshToken, profile, done) => {
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        return done(null, profile);
    }
));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.get("/oauthSignin", (req, res) => {
    return passport.authenticate("onshape", { state: uuid.v4(req.session.state) })(req, res);
});

app.get("/oauthRedirect", passport.authenticate("onshape", { failureRedirect: "/grantDenied" }), (req, res) => {
    // send to onshape if necessary
    const redirectUri = req.session.state.redirectUri;
    if (redirectUri) { return res.redirect(redirectUri); }
    return res.redirect(req.session.state.url);
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/grantDenied", (_, res) => {
    res.sendFile(path.join(__dirname, "public", "grant-denied.html"));
});

// custom authentication middleware
function saveState(req) {
    req.session.state = {
        url: req.url,
        redirectUri: req.query.redirectOnshapeUri
    };
}

/**
 * An authentication handler which automatically routes requests through /oauthSignin.
 * Information about the query is automatically saved to state.
 */
function authenticationHandler(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    saveState(req);
    return res.status(401).redirect("/oauthSignin");
}

// register auth handler for all types of requests
app.use(authenticationHandler);

app.get("/application", (_, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api", proxy(config.backendUrl, {
    proxyReqPathResolver: (req) => {
        let parts = req.url.split('?');
        let queryString = parts[1];
        const updatedPath = parts[0];
        return updatedPath + (queryString ? '?' + queryString : '?') + "token=" + req.user.accessToken;
    }
}));

// must come after proxy?
// app.use(bodyParser.json());

module.exports = { app };