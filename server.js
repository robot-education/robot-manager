// Get the packages we need
const express = require('express');
const session = require('express-session');
const passport = require('passport')
const cookieParser = require('cookie-parser')

let OnshapeStrategy = require('passport-onshape').Strategy;

// const authentication = require('./src/authentication');

require('dotenv').config();

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: true,
        sameSite: 'none'
    }
}));

{
    if (process.env.OAUTH_CLIENT_ID) {
        oauthClientId = process.env.OAUTH_CLIENT_ID;
    }
    else {
        throw new Error('OAUTH_CLIENT_ID not set');
    }
    if (process.env.OAUTH_CLIENT_SECRET) {
        oauthClientSecret = process.env.OAUTH_CLIENT_SECRET;
    }
    else {
        throw new Error('OAUTH_CLIENT_SECRET not set');
    }
    if (process.env.OAUTH_URL) {
        oauthUrl = process.env.OAUTH_URL;
    }
    else {
        throw new Error('OAUTH_URL not set');
    }
    if (process.env.API_URL) {
        apiUrl = process.env.API_URL;
    }
    else {
        throw new Error('API_URL not set');
    }
    if (process.env.OAUTH_CALLBACK_URL) {
        callbackUrl = process.env.OAUTH_CALLBACK_URL;
    }
    else {
        throw new Error('OAUTH_CALLBACK_URL not set');
    }

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

    passport.use(new OnshapeStrategy({
        clientID: oauthClientId,
        clientSecret: oauthClientSecret,
        // Replace the callbackURL string with your own deployed servers path to handle the OAuth redirect
        callbackURL: callbackUrl,
        authorizationURL: oauthUrl + '/oauth/authorize',
        tokenURL: oauthUrl + '/oauth/token',
        userProfileURL: apiUrl + '/api/users/sessioninfo'
    },
        (accessToken, refreshToken, profile, done) => {
            // asynchronous verification, for effect...
            process.nextTick(() => {
                profile.accessToken = accessToken;
                profile.refreshToken = refreshToken;

                // To keep the example simple, the user's Onshape profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the Onshape account with a user record in your database,
                // and return that user instead.
                return done(null, profile);
            });
        }
    ));
}

// authentication.init();

app.use(cookieParser())

app.use(passport.initialize());
app.use(passport.session());

app.get('/application', (req, res) => {
    res.status(200).send('YAY!')
});

app.get('/login', (req, res) => {
    let redirect = req.query.redirectOnshapeUri ?? '/application' + url.parse(req.url, true).search;
    res.cookie('redirect', redirect, {
        secure: true,
        sameSite: 'none'
    });
    passport.authenticate('onshape')(req, res);
});

// function storeExtraParams(req, res) {
//     // let redirect = req.query.redirectOnshapeUri ?? '/application' + url.parse(req.url, true).search;
//     // res.cookie('redirect', redirect, {
//     //     secure: true,
//     //     sameSite: 'none'
//     // });

//     return passport.authenticate('onshape')(req, res);
// }

app.get('/grantDenied', (req, res) => {
    res.status(200).send('Grant failed, oh noes!');
})

app.get('/redirect',
    passport.authenticate('onshape', { failureRedirect: '/grantDenied' }),
    (req, res) => {
        let redirect = req.cookies['redirect'];
        if (!redirect) {
            redirect = '/application' + (url.parse(req.url, true).search ?? '');
        }
        res.redirect(redirect);
    });

const https = require('node:https');
const fs = require('node:fs');

const options = {
    key: fs.readFileSync('client-key.pem'),
    cert: fs.readFileSync('client-cert.pem'),
};

https.createServer(options, app).listen(process.env.port, () => console.log('listening!'))
// app.listen(process.env.port, () => console.log('listening'));