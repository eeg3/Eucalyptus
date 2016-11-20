var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', isLoggedIn, function(req, res, next) {
  res.render('index', { user: req.user });
  //res.sendfile("index.html", {root: './ui'});
});

router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('loginMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', { user: req.user });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));


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

router.get('/help', isLoggedIn, function(req, res, next) {
  res.render('help', { title: 'Express' });
});

router.get('/api/getUserInfo', isLoggedIn, function(req, res, next) {
  var userInfo = [
    { username : req.user.local.email}
  ];
  res.json(userInfo);
});

router.all('/js/*', isLoggedIn);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');
}
