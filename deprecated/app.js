const express = require('express');
const session = require('express-session');
const passport = require('passport')

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const url = require('url')

const authentication = require('./auth.js')
const utils = require('./utils.js')

require('dotenv').config();

const app = express();

app.use(session({
    secret: utils.environment('SESSION_SECRET'),
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: true,
        sameSite: 'none'
    }
}));

authentication.init_passport();

// cookie middleware
app.use(cookieParser());
// body parsing middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.unsubscribe(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
    console.log('Testing authentication.');
    // console.log('query: ' + req.query);
    // console.log('body: ' + req.body);

    if (req.isAuthenticated()) {
        res.status(200);
        return next();
    }
    res.status(401).redirect('/authenticate' + (url.parse(req.url, true).search ?? ''));
}
app.use('/execute', ensureAuthenticated);

// TODO: change to post?
app.get('/execute', (req, res) => {
    if (req.query['wmv'] == 'm' || req.query['wmv'] == 'v') {
        res.status(400).json({ message: 'Cannot execute auto assembly on a read-only version.' });
        return;
    }

    res.status(200).json({ message: 'Finished execution.' });
});

// app.use('/application', express.static(path.join(__dirname, 'public/application'), { maxAge: oneHour })); 


app.get('/authenticate', (req, res) => {
    let redirect = req.query.redirectOnshapeUri;
    if (!redirect) {
        redirect = '/execute' + (url.parse(req.url, true).search ?? '');
    }

    res.cookie('redirect', redirect, {
        secure: true,
        sameSite: 'none'
    });

    passport.authenticate('onshape')(req, res);
});

app.get('/grantDenied', (req, res) => {
    res.status(200).send('Grant failed, oh noes!');
});

app.get('/redirect',
    passport.authenticate('onshape', { failureRedirect: '/grantDenied' }),
    (req, res) => {
        console.log('Redirected');

        let redirect = req.cookies['redirect'];
        if (redirect) {
            res.redirect(redirect);
        }
        else {
            let querystring = url.parse(req.url, true).search ?? '';
            res.redirect('/execute' + querystring);
        }
    });

const fs = require('fs');
const https = require('https');

const options = {
    key: fs.readFileSync('client-key.pem'),
    cert: fs.readFileSync('client-cert.pem'),
};

https.createServer(options, app).listen(process.env.port, () => console.log('listening!'));
// app.listen(process.env.port, () => console.log('listening'));