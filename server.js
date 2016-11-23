/***** Load Modules *****/
// Routing & Middleware Web App Framework
var express = require('express');
// MongoDB Connector
var mongoose = require('mongoose');
// Import body parsers that were removed from Express
var bodyParser = require('body-parser');
// Additional modules
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var session = require('express-session');
var fs = require('fs');

// Passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Include Node's built-in http, https, and fs in order to setup HTTP & HTTPS access
var http = require('http');
var https = require('https');

/***************************************/
/******* Configurable Parameters *******/

// Database Name
var databaseName = "eucalyptusDB4";
// SSL parameters: disabled by default, define key & cert files to use if enable
var ssl = true;
var sslKeyLoc = "../ssl/server.key";
var sslCertLoc = "../ssl/server.crt";
// Pick a port for the server to run on
var port = process.env.PORT || 8001;
// Use Basic Auth on API?
var lockAPI = false;

/**** End Configuration Parameters ****/
/**************************************/

/***** Connect to MongoDB *****/
var dbConnection = 'mongodb://localhost/' + databaseName;
var db = mongoose.connect(dbConnection, function() {
  console.log("Connected to Database: " + dbConnection);
});

/***** Initialize express *****/
var app = express();

// Load main site routes
var routes = require('./routes/index');
//var users = require('./routes/users');

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

require('./libs/passport')(passport);

app.use('/', routes);

var User = require('./models/user');
userRouter = require('./routes/userRoutes')(User);
app.use('/users', userRouter);

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

/* Screenshot API not needed yet
      /***** Screenshot API *****
      // MongoDB GridFS module
      var Grid = require('gridfs-stream');
      Grid.mongo = mongoose.mongo;
      var gfs = new Grid(mongoose.connection.db);
      // Load the screenshot routes that handle GET/POST; also holds controller functionality.
      screenshotRouter = require('./routes/screenshotRoutes')(gfs);
*/


// Static content doesn't need authentication, so allow it to be hit directly
app.use('/js', express.static(path.join(__dirname, 'ui/js')));
app.use('/css', express.static(path.join(__dirname, 'ui/css')));
app.use('/fonts', express.static(path.join(__dirname, 'ui/fonts')));
app.use('/img', express.static(path.join(__dirname, 'ui/img')));

app.use('/api/flightplan', flightplanRouter);
app.use('/api/inflight', inflightRouter);

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

/***** HTTP(S) Server Functionality *****/
// Start service with HTTP
http.createServer(app).listen(port);
console.log("Listening HTTP on Port: " + port);

// Start service with HTTPS too, if enabled in config parameters.
if (ssl) {
  // Define SSL Key & Cert
  var sslOptions = {
    key: fs.readFileSync(sslKeyLoc),
    cert: fs.readFileSync(sslCertLoc)
  };

  https.createServer(sslOptions, app).listen(8443);
  console.log("Listening HTTPS on Port: 8443");
}
