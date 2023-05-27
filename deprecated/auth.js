const passport = require('passport')
let OnshapeStrategy = require('passport-onshape').Strategy;

utils = require('./utils.js')

function init_passport() {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

    let oauthUrl = utils.environment('OAUTH_URL')

    passport.use(new OnshapeStrategy({
        clientID: utils.environment('OAUTH_CLIENT_ID'),
        clientSecret: utils.environment('OAUTH_CLIENT_SECRET'),
        // Replace the callbackURL string with your own deployed servers path to handle the OAuth redirect
        callbackURL: utils.environment('OAUTH_CALLBACK_URL'),
        authorizationURL: oauthUrl + '/oauth/authorize',
        tokenURL: oauthUrl + '/oauth/token',
        userProfileURL: utils.environment('API_URL') + '/api/users/sessioninfo'
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

module.exports = {
    init_passport,
}