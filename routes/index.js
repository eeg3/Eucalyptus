var express = require('express');
var passport = require('passport');
var config = require('../config/base.js');
var router = express.Router();

router.get('/', isLoggedIn, function(req, res, next) {
  res.render('index', { user: req.user });
  //res.sendfile("index.html", {root: './ui'});
});

router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
  res.render('signup.ejs', {
    message: req.flash('loginMessage'),
    adminEmail: config.adminEmail
   });
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', { user: req.user });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
}), function(req, res) {
  res.redirect(req.session.returnTo || '/');
  delete req.session.returnTo;
});


router.get('/fpbuilder', isLoggedIn, function(req, res, next) {
  res.render('fpbuilder', { user: req.user });
  //res.sendfile("index.html", {root: './ui'});
});

router.get('/flightplan', isLoggedIn, function(req, res, next) {
  res.render('flightplan', { user: req.user });
});

router.get('/apitoolkit', isLoggedIn, function(req, res, next) {
  res.render('apitoolkit', { title: 'Express' });
});

router.get('/admin', isLoggedIn, function(req, res, next) {
  res.render('admin', { title: 'Express' });
});

router.get('/help', isLoggedIn, function(req, res, next) {
  res.render('help', { title: 'Express' });
});

router.get('/api/getUserInfo', isLoggedIn, function(req, res, next) {
  var userInfo = [
    {
      id: req.user._id,
      username : req.user.local.email
    }
  ];
  res.json(userInfo);
});

router.all('/js/*', isLoggedIn);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.local.enabled == true) {
      return next();
    }
  }
  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
}
