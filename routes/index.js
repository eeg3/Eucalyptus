var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var config = require('../config/base.js');
var router = express.Router();

var env = {
  AUTH0_CLIENT_ID: "8NvOzTjcL8pxFNn1KCZIr13Zm9nQV9rP",
  AUTH0_DOMAIN: "eeg3.auth0.com",
  AUTH0_CALLBACK_URL: 'http://localhost:8001/callback'
};

router.get('/', ensureLoggedIn, function(req, res, next) {
  res.render('index', { user: req.user });
  //res.sendfile("index.html", {root: './ui'});
});

router.get('/login', function(req, res, next) {
  res.render('login', { user: req.user });
});

// We are also going to implement the callback route which will redirect the logged in user to the polls page if authentication succeeds.
router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });

router.get('/about', function(req, res, next) {
  res.render('about.ejs', { message: req.flash('loginMessage') });
});

router.get('/robots.txt', function(req, res, next) {
  res.render('robots.ejs', { message: req.flash('loginMessage') });
});

/*
router.get('/profile', ensureLoggedIn, function(req, res) {
  res.render('profile.ejs', { user: req.user });
});
*/

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/fpbuilder', ensureLoggedIn, function(req, res, next) {
  res.render('fpbuilder', { user: req.user });
  //res.sendfile("index.html", {root: './ui'});
});

router.get('/flightplan', ensureLoggedIn, function(req, res, next) {
  res.render('flightplan', { user: req.user });
});

/*
router.get('/admin', ensureLoggedIn, function(req, res, next) {
  res.render('admin', { title: 'Express' });
});
*/

/*
router.get('/api/getUserInfo', ensureLoggedIn, function(req, res, next) {
  var userInfo = [
    {
      id: req.user._id,
      name: req.user.local.name,
      email: req.user.local.email,
      walkthroughDashboard: req.user.local.walkthroughDashboard,
      walkthroughFlightplan: req.user.local.walkthroughFlightplan,
      walkthroughFpbuilder: req.user.local.walkthroughFpbuilder
    }
  ];
  res.json(userInfo);
});
*/

router.all('/js-prv/*', ensureLoggedIn);
router.all('/js-pub/*');

module.exports = router;
