// Load required packages
let passport = require('passport');
let BasicStrategy = require('passport-http').BasicStrategy;
let BearerStrategy = require('passport-http-bearer').Strategy
let LocalStrategy = require('passport-local').Strategy

let Token = require('../models/token.js');
let Application = require('../models/application.js');
let User = require('../models/user.js');

passport.use(new BasicStrategy(
    (username, password, callback) => {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return callback(err); }

            // No user found with that username
            if (!user) { return callback(null, false); }

            // Make sure the password is correct
            user.verifyPassword(password, function (err, isMatch) {
                if (err) { return callback(err); }

                // Password did not match
                if (!isMatch) { return callback(null, false); }

                // Success
                return callback(null, user);
            });
        });
    }
));

passport.use('application-basic', new BasicStrategy(
    (username, password, callback) => {
        Application.findOne({ id: username }, function (err, application) {
            if (err) { return callback(err); }

            // No application found with that id or bad password
            if (!application || application.secret !== password) { return callback(null, false); }

            // Success
            return callback(null, application);
        });
    }
));

passport.use(new BearerStrategy((accessToken, callback) => {
    Token.findOne({ access: accessToken }, (err, token) => {
        if (err) { return callback(err); }

        // No token found
        if (!token) { return callback(null, false); }

        // Token expired
        let now = new Date();

        if ((Math.abs(token.dateModified.getTime() - now.getTime()) / 1000) > token.expiryTime) {
            return callback(null, false);
        }

        User.findOne({ _id: token.userId }, function (err, user) {
            if (err) { return callback(err); }

            // No user found
            if (!user) { return callback(null, false); }

            // Simple example with no scope
            callback(null, user, { scope: '*' });
        });
    });
}));

passport.use('local-part', new LocalStrategy({
    usernameField: 'client_id',
    passwordField: 'client_secret'
}, function (clientId, clientSecret, callback) {
    Application.findOne({ clientId: clientId }, function (err, application) {
        if (err) { return callback(err); }

        // No application found with that id or bad password
        if (!application || application.clientSecret !== clientSecret) { return callback(null, false); }

        // Success
        return callback(null, application);
    });
})
);

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session: false });
exports.isApplicationAuthenticated = passport.authenticate('local-part', { session: false });