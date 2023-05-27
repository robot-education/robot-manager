/**
 * Based on official code from Onshape found here:
 * https://github.com/onshape-public/inventory-oauth2-app/blob/master/server.js
 * 
 * Plus the documentation found here:
 * https://onshape-public.github.io/docs/6-app-development/extensions/#sample-application 
 */
let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let session = require('express-session');
let mongoose = require('mongoose');

let authController = require('./controllers/auth');
let oauth2Controller = require('./controllers/oauth2');

// Connect to the inventoryapplicationdb MongoDB
if (process.env.ENVIRONMENT === 'production') {
    mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to prod db');
} else {
    mongoose.connect('mongodb://localhost:27017/inventoryapplicationdb');
    console.log('Connected to Local db');
}

// Create our Express application
let app = express();

app.set('view engine', 'ejs');

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// Use express session support since OAuth2orize requires it
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}));

// Create our Express router
let router = express.Router();

// TODO: my custom router
// router.route('/executeAutoAssembly')
//     .post(authController.isAuthenticated, autoAssemblyController.execute)

// Create endpoint handlers for /applications
// router.route('/applications')
//     .post(authController.isAuthenticated, applicationController.postApplications)
//     .get(authController.isAuthenticated, applicationController.getApplications);

// Create endpoint handlers for oauth2 authorize
router.route('/oauth2/authorize')
    .get(authController.isAuthenticated, oauth2Controller.authorization)
    .post(authController.isAuthenticated, oauth2Controller.decision);

// Create endpoint handlers for oauth2 token
router.route('/oauth2/token')
    .post(authController.isApplicationAuthenticated, oauth2Controller.token);

// Register all our routes with /api
app.use('/api', router);

// set up static files in public directory
app.use(express.static(path.join(__dirname, 'public')));

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', (req, res) => {
    res.json({ message: 'You are running the inventory application!' });
});


// Start the server
const fs = require('fs');
const https = require('https');

const options = {
    key: fs.readFileSync('client-key.pem'),
    cert: fs.readFileSync('client-cert.pem'),
};

https.createServer(options, app).listen(process.env.PORT, () => console.log('Application running on port ' + process.env.PORT));