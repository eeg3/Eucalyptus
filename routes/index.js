var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL
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

// Callback route which will redirect user to dashboard or where they came from if successful
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

router.get('/profile', ensureLoggedIn, function(req, res, next) {
  res.render('profile', {
    user: req.user,
    userProfile: JSON.stringify(req.user, null, '  ')
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/fpbuilder', ensureLoggedIn, function(req, res, next) {
  res.render('fpbuilder', { user: req.user });
});

router.get('/flightplan', ensureLoggedIn, function(req, res, next) {
  res.render('flightplan', { user: req.user });
});

router.get('/api/getUserInfo', ensureLoggedIn, function(req, res, next) {
  var userInfo = [
    {
      id: req.user.id,
      name: req.user.name,
      email: req.user._json.email
    }
  ];
  res.json(userInfo);
});


router.all('/js-prv/*', ensureLoggedIn);
router.all('/js-pub/*');

module.exports = router;
