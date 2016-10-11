/***** Load Modules *****/
// Routing & Middleware Web App Framework
var express = require('express');
// MongoDB Connector
var mongoose = require('mongoose');
// Import body parsers that were removed from Express
var bodyParser = require('body-parser');

// Include Node's built-in http, https, and fs in order to setup HTTP & HTTPS access
var http = require('http');
var https = require('https');
// Allow us to do very basic auth which will be used to restrict the API if desired
var auth = require ('./libs/auth.js');

/***************************************/
/******* Configurable Parameters *******/

  // Database Name
  var databaseName = "eucalyptusDB1";
  // SSL parameters: disabled by default, define key & cert files to use if enable
  var ssl = false;
  var sslKeyLoc = "ssl/key.pem";
  var sslCertLoc = "ssl/cert.cert";
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

/* Desktop API not needed yet
      /***** Desktop API *****
      // Create a ORM Model based on the desktopModel Schema
      var Desktop = require('./models/Desktop');
      // Load the desktop routes that handle POST/GET/PATCH/DELETE for the API; also holds the controller functionality
      desktopRouter = require('./routes/desktopRoutes')(Desktop);
*/

/* Screenshot API not needed yet
      /***** Screenshot API *****
      // MongoDB GridFS module
      var Grid = require('gridfs-stream');
      Grid.mongo = mongoose.mongo;
      var gfs = new Grid(mongoose.connection.db);
      // Load the screenshot routes that handle GET/POST; also holds controller functionality.
      screenshotRouter = require('./routes/screenshotRoutes')(gfs);
*/

/***** Enable Body-Parser Middleware *****/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/* Routers not needed yet
      /***** Attach the routers to the app *****
      if (lockAPI) {
        app.use('/api/desktop', auth, desktopRouter);
        app.use('/api/screenshot', auth, screenshotRouter);
      } else {
        app.use('/api/desktop', desktopRouter);
        app.use('/api/screenshot', screenshotRouter);
      }
*/

/***** Serve the static assets *****/
// The 'ui' folder holds all of the front-end code.
app.use(express.static('ui'));

// If we're not hitting something that exists whether a route or front-end, send this.
app.use(function(req, res, next) {
  res.status(404)
  res.send('404: Not found. :(');
})

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

  https.createServer(sslOptions, app).listen(443);
  console.log("Listening HTTPS on Port: 443");
}
