var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var request = require("request");
var router = express.Router();

var env = {
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CLIENT_ID: process.env.SPA_AUTH0_CLIENT_ID,
  AUTH0_CALLBACK_URL: process.env.SPA_AUTH0_CALLBACK_URL
};

router.get('/', ensureLoggedIn, function(req, res, next) {
  res.render('index', { user: req.user });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    user: req.user,
    env: env
   });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// Callback route which will redirect user to dashboard or where they came from if successful
router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });

router.get('/about', function(req, res, next) {
  res.render('about.ejs', { message: req.flash('loginMessage') });
});

router.get('/invite', ensureLoggedIn, function(req, res, next) {
  res.render('invite.ejs', {
    status: ""
  });
});

router.get('/robots.txt', function(req, res, next) {
  res.render('robots.ejs', { message: req.flash('loginMessage') });
});

router.get('/profile', ensureLoggedIn, function(req, res, next) {
  res.render('profile.ejs', {
    user: req.user,
    passwordChange: false
  });
});

router.get('/fpbuilder', ensureLoggedIn, function(req, res, next) {
  res.render('fpbuilder', { user: req.user });
});

router.get('/flightplan', ensureLoggedIn, function(req, res, next) {
  res.render('flightplan', { user: req.user });
});


// Protect private javascript files with authentication
router.all('/js-prv/*', ensureLoggedIn);

module.exports = router;
