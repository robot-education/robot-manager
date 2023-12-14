const uuid = require("uuid");
const express = require("express");
const session = require("express-session");
const proxy = require("express-http-proxy");

const passport = require("passport");
const OnshapeStrategy = require("passport-onshape");

const config = require("./config");

const app = express();
app.set("trust proxy", true);

let store;
if (config.isProduction) {
    // TODO: use gcp firebase in production
    store = new session.MemoryStore();
} else {
    store = new session.MemoryStore();
}

app.use(
    session({
        store,
        name: "robot-manager",
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: "none",
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 3600 * 24, // 1 day
        },
    }),
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(
    new OnshapeStrategy(
        {
            clientID: config.oauthClientId,
            clientSecret: config.oauthClientSecret,
            callbackURL: config.oauthCallbackUrl,
            authorizationURL: `${config.oauthUrl}/oauth/authorize`,
            tokenURL: `${config.oauthUrl}/oauth/token`,
            userProfileURL: `${config.oauthUrl}/api/users/sessioninfo`,
        },
        (accessToken, refreshToken, profile, done) => {
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            return done(null, profile);
        },
    ),
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use("/signin", (req, res) => {
    const state = req.session.state ?? {};
    state.redirectUri = req.query.redirectOnshapeUri;
    req.session.state = state;
    return passport.authenticate("onshape", {
        state: uuid.v4(req.session.state),
    })(req, res);
});

app.use(
    "/redirect",
    passport.authenticate("onshape", { failureRedirect: "/grantdenied" }),
    (req, res) => {
        const state = req.session.state;
        // state should always exist, but fallback to onshape.com if it doesn't
        let url = state
            ? state.redirectUri ?? state.url
            : "https://cad.onshape.com";
        return res.redirect(url);
    },
);

/**
 * An authentication handler which automatically routes requests through /signin.
 */
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.state = { url: req.url };
    return res.status(401).redirect("/signin");
}

// Authenticate selected routes
app.get(["/assembly", "/partstudio"], checkAuthentication);

/**
 * Redirect /api calls to the backend.
 */
app.use(
    "/api",
    proxy(config.backendUrl, {
        proxyReqOptDecorator: (options, req) => {
            options.headers["Authentication"] = "Basic " + req.user.accessToken;
            return options;
        },
    }),
);

module.exports = app;
