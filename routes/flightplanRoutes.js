var express = require('express');

// We need the "Flightplan" parameter to get the ORM model
var routes = function(Flightplan){
    // flightplanRouter is going to be our router (router-level middleware)
    var flightplanRouter = express.Router();

// Handle POST to add a new Flightplan
    flightplanRouter.route('/')
      .post(function(req, res){ // Handle POST
          // We're creating, so let's create a new Flightplan object based on what was posted
          var flightplan = new Flightplan(req.body);

          // If there isn't a title specified, we can't proceed. Everything else is okay with being empty.
          if(!req.body.title){
              res.status(400);
              res.send('Flightplan title is required');
          }
          else {
              // Save to MongoDB
              flightplan.save();
              // HTTP Code 201 (CREATED) is sent for success
              res.status(201);
              // Respond back with the object to the user
              res.send(flightplan);
          }
      }) // End .post
      .get(function(req,res){ // Handle GET
          // Lets handle a /?user= if applicable
          var query = {};
          if(req.query.category) { query.category = req.query.category; }

          // Find all Flightplans, and also process the query if defined
          Flightplan.find(query, function(err,flightplans){
              // If there's an error, post the Internal Server Error HTTP Code
              if(err)
                  res.status(500).send(err);
              else {
                  // Setup an array to store all the Flightplans returned
                  var returnFlightplans = [];
                  flightplans.forEach(function(element, index, array){
                      // Take the elements and turn them in to JSON format
                      var newFlightplan = element.toJSON();
                      // Add links to each Flightplan so its all HATEOAS compatible
                      newFlightplan.links= {};
                      newFlightplan.links.self = 'http://' + req.headers.host + '/api/flightplan/' + newFlightplan._id;
                      returnFlightplans.push(newFlightplan);
                  });
                  res.json(returnFlightplans);
              }
          });
      });

// We always want this to be executed when accessing by ID
    flightplanRouter.use('/:flightplanId', function(req,res,next){
        Flightplan.findById(req.params.flightplanId, function(err,flightplan){
            if(err)
                res.status(500).send(err);
            else if(flightplan)
            {
                req.flightplan = flightplan;
                next();
            }
            else
            {
                res.status(404).send('no flightplan found');
            }
        });
    });

// But we only want to route if the use() does a next()
    flightplanRouter.route('/:flightplanId')
        .get(function(req,res){

            var returnFlightplan = req.flightplan.toJSON();

            returnFlightplan.links = {};
            var newLink = 'http://' + req.headers.host + '/api/flightplan/?category=' + returnFlightplan.category;
            returnFlightplan.links.FilterByCategory = newLink.replace(' ', '%20');
            res.json(returnFlightplan);

        })
        .put(function(req,res){
            req.flightplan.title = req.body.title;
            req.flightplan.author = req.body.author;
            req.flightplan.revision = req.body.revision;
            req.flightplan.category = req.body.category;
            req.flightplan.product = req.body.product;
            req.flightplan.description = req.body.description;
            req.flightplan.outcome = req.body.outcome;
            req.flightplan.steps = req.body.steps;
            req.flightplan.save(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.flightplan);
                }
            });
        })
        .patch(function(req,res){
            if(req.body._id) // We do this because we don't want to patch the ID ever.
                delete req.body._id;

            for(var key in req.body)
            {
                req.flightplan[key] = req.body[key];
            }

            req.flightplan.save(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.flightplan);
                }
            });
        })
        .delete(function(req,res){
            req.flightplan.remove(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.status(204).send('Removed');
                }
            });
        });

    return flightplanRouter;
};

module.exports = routes;
