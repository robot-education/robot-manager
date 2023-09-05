const uuid = require("uuid");
const express = require("express");
const session = require("express-session");
const proxy = require("express-http-proxy");

const passport = require("passport");
const OnshapeStrategy = require("passport-onshape");

const RedisStore = require("connect-redis").default;
const redis = require("redis");

const config = require("./config");

const app = express();
app.set("trust proxy", true);

let redisClient = redis.createClient();
redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
    client: redisClient,
    prefix: "robot-manager:",
});

app.use(
    session({
        store: redisStore,
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            name: "robot-manager",
            sameSite: "none",
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: 1000 * 60 * 60 * 24, // 1 day
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

/**
 * An authentication handler which automatically routes requests through /oauthSignin.
 */
function authenticationHandler(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.state = { url: req.url };
    return res.status(401).redirect("/oauthSignin");
}

// Authenticate selected routes
app.get(["/assembly", "/partstudio"], authenticationHandler);

app.get("/oauthSignin", (req, res) => {
    const state = req.session.state ?? {};
    state.redirectUri = req.query.redirectOnshapeUri;
    req.session.state = state;
    return passport.authenticate("onshape", {
        state: uuid.v4(req.session.state),
    })(req, res);
});

app.get(
    "/oauthRedirect",
    passport.authenticate("onshape", { failureRedirect: "/grantDenied" }),
    (req, res) => {
        const state = req.session.state;
        return res.redirect(state.redirectUri ?? state.url);
    },
);

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
app.use(
    "/api",
    proxy(config.backendUrl, {
        proxyReqOptDecorator: (options, req) => {
            options.headers["Authentication"] = "Basic " + req.user.accessToken;
            return options;
        },
    }),
);

module.exports = { app };
