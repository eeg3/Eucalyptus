var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var request = require("request");
var router = express.Router();

router.get('/', ensureLoggedIn, function(req, res, next) {
  var userInfo = [
    {
      id: req.user.id,
      name: req.user.name,
      email: req.user._json.email
    }
  ];
  res.json(userInfo);
});

router.get('/invite/:email', ensureLoggedIn, function(req, res, next) {
   var getTokenOptions = {
      method: 'POST',
      url: 'https://' + process.env.AUTH0_DOMAIN + '/oauth/token',
      headers: { 'content-type': 'application/json' },
      body:
       { grant_type: 'client_credentials',
         client_id: process.env.NI_AUTH0_CLIENT_ID,
         client_secret: process.env.NI_AUTH0_CLIENT_SECRET,
         audience: 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/' },
      json: true
    };

  request(getTokenOptions, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
    var access_token = body.access_token;

    var createUserOptions = {
      method: 'POST',
      url: 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/users',
      headers: {
        authorization: 'Bearer ' + access_token,
       'content-type': 'application/json'
     },
     body:
      {
        connection: process.env.AUTH0_CONNECTION,
        email: req.params.email,
        password: "eucalyptus",
        user_metadata: {},
        email_verified:false,
        verify_email:false,
        app_metadata:{}
      },
      json: true
    };

    request(createUserOptions, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
      var status = "Success";
      if(body.statusCode == "400") {
        status = "Bad Request";
      }
      res.render('invite', { status: status });
    });

  });
});

// Request a password reset email to be sent from Auth0
router.get('/change_password', ensureLoggedIn, function(req, res, next) {
  var options = { method: 'POST',
    url: 'https://' + process.env.AUTH0_DOMAIN + '/dbconnections/change_password',
    headers: { 'content-type': 'application/json' },
    body:
     { client_id: process.env.NI_AUTH0_CLIENT_ID,
       email: req.user._json.email,
       connection: process.env.AUTH0_CONNECTION
     },
    json: true
 };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    res.render('profile.ejs', {
      user: req.user,
      passwordChange: true
    });
  });

});

module.exports = router;
