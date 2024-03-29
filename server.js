/***** Load Modules *****/
// Routing & Middleware Web App Framework
var express = require('express');
// MongoDB Connector
var mongoose = require('mongoose');
// Import body parsers that were removed from Express
var bodyParser = require('body-parser');
// Additional modules
var path = require('path');
var dotenv = require('dotenv');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var session = require('express-session');
var fs = require('fs');
var http = require('http');

// Load Environment Variables
dotenv.load();

// Passport
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

// This will configure Passport to use Auth0
var strategy = new Auth0Strategy({
  domain:       process.env.AUTH0_DOMAIN,
  clientID:     process.env.SPA_AUTH0_CLIENT_ID,
  clientSecret: process.env.SPA_AUTH0_CLIENT_SECRET,
  callbackURL:  process.env.SPA_AUTH0_CALLBACK_URL
}, function(accessToken, refreshToken, extraParams, profile, done) {
  // accessToken is the token to call Auth0 API (not needed in the most cases)
  // extraParams.id_token has the JSON Web Token
  // profile has all the information from the user
  return done(null, profile);
});

// Here we are adding the Auth0 Strategy to our passport framework
passport.use(strategy);

// The searlize and deserialize user methods will allow us to get the user data once they are logged in.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Database information
var databaseServer = process.env.DATABASE_SERVER || "localhost";
var databaseName = process.env.DATABASE_NAME || "eucalyptus";
// Port for the server to run on
var port = process.env.HTTP_PORT || 8001;

/***** Connect to MongoDB *****/
var dbConnection = 'mongodb://' + databaseServer + '/' + databaseName;
var db = mongoose.connect(dbConnection, function(err) {
  if (err) {
    console.log("Error connecting to database.");
    process.exit(1);
  }
  console.log("Connected to Database: " + dbConnection);
});

/***** Initialize express *****/
var app = express();

// Load main site routes
var routes = require('./routes/index');

// Configure Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'shhsecret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', routes);

/***** Flightplan API *****/
// Create a ORM Model based on the flightplanModel Schema
var Flightplan = require('./models/Flightplan');
// Load the desktop routes that handle POST/GET/PATCH/DELETE for the API; also holds the controller functionality
flightplanRouter = require('./routes/flightplanRoutes')(Flightplan);

/***** Inflight API *****/
// Create a ORM Model based on the flightplanModel Schema
var Inflight = require('./models/Inflight');
// Load the desktop routes that handle POST/GET/PATCH/DELETE for the API; also holds the controller functionality
inflightRouter = require('./routes/inflightRoutes')(Inflight);

// Static content doesn't need authentication, so allow it to be hit directly
app.use('/js-pub', express.static(path.join(__dirname, 'ui/js-pub')));
app.use('/js-prv', express.static(path.join(__dirname, 'ui/js-prv')));
app.use('/css', express.static(path.join(__dirname, 'ui/css')));
app.use('/fonts', express.static(path.join(__dirname, 'ui/fonts')));
app.use('/img', express.static(path.join(__dirname, 'ui/img')));

app.use('/api/flightplan', flightplanRouter);
app.use('/api/inflight', inflightRouter);

var userRouter = require('./routes/user');
app.use('/api/user', userRouter);

// If we're not hitting something that exists whether a route or front-end, send this.
app.use(function(req, res, next) {
  var err = new Error('Not found. :(');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

// Start service with HTTP
http.createServer(app).listen(port);
console.log("Listening HTTP on Port: " + port);
