var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');
}
