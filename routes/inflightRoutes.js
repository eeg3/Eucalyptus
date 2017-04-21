var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

// We need the "Inflight" parameter to get the ORM model
var routes = function(Inflight){
    // inflightRouter is going to be our router (router-level middleware)
    var inflightRouter = express.Router();

// Handle POST to add a new Inflight
    inflightRouter.route('/')
      .post(ensureLoggedIn, function(req, res){ // Handle POST
          // We're creating, so let's create a new Inflight object based on what was posted
          var inflight = new Inflight(req.body);

          // If there isn't a title specified, we can't proceed. Everything else is okay with being empty.
          if(!req.body.title){
              res.status(400);
              res.send('Inflight title is required');
          }
          else {
              // Save to MongoDB
              inflight.save();
              // HTTP Code 201 (CREATED) is sent for success
              res.status(201);
              // Respond back with the object to the user
              res.send(inflight);
          }
      }) // End .post
      .get(ensureLoggedIn, function(req,res){ // Handle GET
          // Lets handle a /?user= if applicable
          var query = {};
          if(req.query.category) { query.category = req.query.category; }

          // Find all Inflights, and also process the query if defined
          Inflight.find(query, function(err,inflights){
              // If there's an error, post the Internal Server Error HTTP Code
              if(err)
                  res.status(500).send(err);
              else {
                  // Setup an array to store all the Inflights returned
                  var returnInflights = [];
                  inflights.forEach(function(element, index, array){
                      // Take the elements and turn them in to JSON format
                      var newInflight = element.toJSON();
                      // Add links to each Inflight so its all HATEOAS compatible
                      newInflight.links= {};
                      newInflight.links.self = 'http://' + req.headers.host + '/api/inflight/' + newInflight._id;
                      returnInflights.push(newInflight);
                  });
                  res.json(returnInflights);
              }
          });
      });

// We always want this to be executed when accessing by ID
    inflightRouter.use('/:inflightId', ensureLoggedIn, function(req,res,next){
        Inflight.findById(req.params.inflightId, function(err,inflight){
            if(err)
                res.status(500).send(err);
            else if(inflight)
            {
                req.inflight = inflight;
                next();
            }
            else
            {
                res.status(404).send('no inflight found');
            }
        });
    });

// But we only want to route if the use() does a next()
    inflightRouter.route('/:inflightId')
        .get(function(req,res){

            var returnInflight = req.inflight.toJSON();

            returnInflight.links = {};
            var newLink = 'http://' + req.headers.host + '/api/inflight/?category=' + returnInflight.category;
            returnInflight.links.FilterByCategory = newLink.replace(' ', '%20');
            res.json(returnInflight);

        })
        .put(function(req,res){
            req.inflight.title = req.body.title;
            req.inflight.referencedFlightplan = req.body.referencedFlightplan;
            req.inflight.user = req.body.user;
            req.inflight.notes = req.body.notes;
            req.inflight.lastChecked = req.body.lastChecked;
            req.inflight.completed = req.body.completed;
            req.inflight.save(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.inflight);
                }
            });
        })
        .patch(function(req,res){
            if(req.body._id) // We do this because we don't want to patch the ID ever.
                delete req.body._id;

            for(var key in req.body)
            {
                req.inflight[key] = req.body[key];
            }

            req.inflight.save(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.inflight);
                }
            });
        })
        .delete(function(req,res){
            req.inflight.remove(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.status(204).send('Removed');
                }
            });
        });

    return inflightRouter;
};

module.exports = routes;
