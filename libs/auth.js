var basicAuth = require('basic-auth');

// Basic authentication; uses basic-auth module, but could parse req.headers.authorization
// Based on: https://davidbeath.com/posts/expressjs-40-basicauth.html
// We don't really need this secured, but lets secure it just for sanity sake.

var auth = function(req,res, next) {
  // Send a 401 if unauthorized
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  // Parse req.headers.authorization into an object
  var user = basicAuth(req);

  // If there isn't a user name or pass, access is unauthorized
  if (!user || !user.name || !user.pass ) {
    return unauthorized(res);
  }

  // If the login matches, kick off the next callback, if not, access is unauthorized
  if (user.name === 'foo' && user.pass === 'bar') {
    return next();
  } else {
    return unauthorized(res);
  }
};

// Export the auth function
module.exports = auth;
