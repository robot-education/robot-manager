const uuid = require('uuid');
const express = require('express');
const session = require('express-session');
const proxy = require('express-http-proxy');

const passport = require('passport');
const OnshapeStrategy = require('passport-onshape');

const config = require('./config');

// let ViteExpress = require("vite-express");
// app.use(ViteExpress.static());


const app = express();
app.set('trust proxy', true);

console.log("New session?");

app.use(session({
    secret: config.sessionSecret,
    saveUninitialized: false,
    resave: false,
    cookie: {
        name: 'robot-manager',
        sameSite: 'none',
        httpOnly: true,
        secure: true,
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


/**
 * An authentication handler which automatically routes requests through /oauthSignin.
 */
function authenticationHandler(req, res, next) {
    console.log("Checking auth info");
    if (req.isAuthenticated()) {
        console.log("Authenticated!");
        return next();
    }
    console.log("Nope");
    req.session.state = { url: req.url };
    req.session.save();
    return res.status(401).redirect('/oauthSignin');
}

// Authenticate selected routes
app.use(["/assembly", "/partstudio"], authenticationHandler);

app.get('/oauthSignin', (req, res) => {
    console.log("Signin ouath time");
    const state = req.session.state ?? {};
    state.redirectUri = req.query.redirectOnshapeUri;
    req.session.state = state;
    req.session.save();
    console.log(req.session.state);
    return passport.authenticate('onshape', { state: uuid.v4(req.session.state) })(req, res);
});


app.get('/oauthRedirect', passport.authenticate('onshape', { failureRedirect: '/grantDenied' }), (req, res) => {
    const redirectUri = req.session.state.redirectUri;
    if (redirectUri) { return res.redirect(redirectUri); }
    return res.redirect(req.session.state.url);
});



// app.get('/grantDenied', (_, res) => {
//     res.sendFile(path.join(__dirname, 'dist', 'denied.html'));
// });

// if (config.isProduction) {
//     app.use(express.static(path.join(process.cwd(), 'dist')));

//     app.get((_, res) => {
//         res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
//     });
// }

/**
 * Redirect /api calls to the backend.
 */
app.use('/api', proxy(config.backendUrl, {
    proxyReqOptDecorator: (options, req) => {
        options.headers['Authentication'] = 'Basic ' + req.user.accessToken;
        return options;
    },
}));

module.exports = { app };