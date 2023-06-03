let path = require("path");
let uuid = require("uuid");
let express = require("express");
let session = require("express-session");
let bodyParser = require("body-parser");

let passport = require("passport");
let OnshapeStrategy = require("passport-onshape");

let config = require("./config");

const app = express();

app.use(bodyParser.json());

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

app.get("/", (req, res) => {
    console.log("Hello world.");
    res.redirect("/application");
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

const apiRouter = express.Router();
apiRouter.use("/api", async (req, res) => {
    const url = config.backendUrl + req.url // + "?token=" + req.user.accessToken;
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: "1234567890" }),
    });
    const json = await response.json();
    console.log(json);
    res.json(json);
});

app.use(apiRouter);

module.exports = { app };