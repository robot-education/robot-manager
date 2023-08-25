const path = require('path');
const uuid = require('uuid');
const express = require('express');
const session = require('express-session');
const proxy = require('express-http-proxy');

const passport = require('passport');
const OnshapeStrategy = require('passport-onshape');

const config = require('./config');

const app = express();
app.set('trust proxy', true);

app.use(session({
    secret: config.sessionSecret,
    saveUninitialized: false,
    resave: false,
    cookie: {
        name: 'robot-manager',
        sameSite: 'none',
        secure: true,
        httpOnly: true,
        path: '/',
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

app.get('/oauthSignin', (req, res) => {
    req.session.state = req.session.state ?? {};
    req.session.state.redirectUri = req.query.redirectOnshapeUri;
    return passport.authenticate('onshape', { state: uuid.v4(req.session.state) })(req, res);
});


app.get('/oauthRedirect', passport.authenticate('onshape', { failureRedirect: '/grantDenied' }), (req, res) => {
    const redirectUri = req.session.state.redirectUri;
    if (redirectUri) { return res.redirect(redirectUri); }
    return res.redirect(req.session.state.url);
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/grantDenied', (_, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'denied.html'));
});

/**
 * An authentication handler which automatically routes requests through /oauthSignin.
 * Information about the query is automatically saved to state.
 */
function authenticationHandler(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.state = { url: req.url };
    return res.status(401).redirect('/oauthSignin');
}


/**
 * Register the auth handler for all types of requests.
 * Note this registration must occur between registering oauth sign in and oauth redirect in order
 * to prevent issues with infinite redirects/the oauth gateway.
 */
app.use(authenticationHandler);

app.get(['/assembly', '/partstudio'], (_, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

/**
 * Redirects /api calls to the python backend.
 */
app.use('/api', proxy(config.backendUrl, {
    proxyReqOptDecorator: (options, req) => {
        options.headers['Authentication'] = 'Basic ' + req.user.accessToken;
        return options;
    },
}));


module.exports = { app };