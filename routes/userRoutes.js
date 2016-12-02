var express = require('express');
var passport = require('passport');
var bcrypt   = require('bcrypt-nodejs');

var routes = function(User) {
  var userRouter = express.Router();

  userRouter.route('/')
    .post(isLoggedIn, function(req, res) {
      var user = new User();
      if (!req.body.email) {
        res.status(400);
        res.send('Email is required');
      } else if (!req.body.password) {
        res.status(400);
        res.send('Password is required');
      } else {
        user.local.email = req.body.email;
        user.local.password = user.generateHash(req.body.password);
        user.local.name = req.body.name;
        user.local.enabled = false;
        user.local.walkthroughDashboard = true;
        user.local.walkthroughFlightplan = true;
        user.local.walkthroughFpbuilder = true;
        user.save();
        res.status(201);
        res.send(user);
      }
    })
    .get(isLoggedIn, function(req, res) {
      var query = {};

      User.find({}, function(err,users) {
        if(err) {
          res.status(500).send(err);
        } else {
          var returnUsers = []
          users.forEach(function(element, index, array) {
            var newUser = element.toJSON();
            newUser.local["password"] = "hidden"; // Dont let the API return peoples hashed passwords
            returnUsers.push(newUser);
          });
          res.json(returnUsers);
        }
      });
    });

    userRouter.use('/:userId', isLoggedIn, function(req, res, next) {
      User.findById(req.params.userId, function(err, user) {
        if (err) {
          res.status(500).send(err);
        } else if (user) {
          req.user = user;
          next();
        } else {
          res.status(404).send('No id found');
        }
      });
    });


    userRouter.route('/:userId')
      .get(function(req, res) {
        req.user.local.password = "hidden";
        var returnUser = req.user.toJSON();

        res.json(returnUser);
      })
      .patch(function(req,res){
          for(var key in req.body) {
            if (key == "password") {
              req.user.local["password"] = req.user.generateHash(req.body[key]);
            } else {
              req.user.local[key] = req.body[key];
            }
          }

          req.user.save(function(err){
              if(err) {
                res.status(500).send(err);
              } else {
                  res.json(req.user);
              }
          });
      })
      .delete(function(req,res){
          req.user.remove(function(err){
              if(err)
                  res.status(500).send(err);
              else{
                  res.status(204).send('Removed');
              }
          });
      });


  return userRouter;
};


/* GET users listing. */
//router.get('/', isLoggedIn, function(req, res, next) {
//  res.send('respond with a resource');
//});

module.exports = routes;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.local.enabled == true) {
      return next();
    }
  }
  res.redirect('/login');
}
