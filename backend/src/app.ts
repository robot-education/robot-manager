// @ts-nocheck

import * as path from "path";
import * as uuid from "uuid";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";

import passport from "passport";
import OnshapeStrategy from "passport-onshape";

import * as config from "./config";

import * as apiRouter from "./api/api-router";

export const app = express();

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
    (accessToken: string, refreshToken: string, profile, done) => {
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
app.use(express.static(path.join(__dirname, "frontend")));

app.get("/grantDenied", (_, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "grant-denied.html"));
});

// app.use(express.static(path.join(__dirname, "dist")));
// app.get("/", (_, res) => {
//     res.sendFile(path.join(__dirname, "public", "html", "index.html"));
// });

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
    res.sendFile(path.join(__dirname, "public", "html", "application.html"));
});

app.use("/api", apiRouter.apiRouter);