var express = require('express');

// We need the "Manifest" parameter to get the ORM model
var routes = function(Manifest){
    // manifestRouter is going to be our router (router-level middleware)
    var manifestRouter = express.Router();

// Handle POST to add a new Manifest
    manifestRouter.route('/')
      .post(function(req, res){ // Handle POST
          // We're creating, so let's create a new Manifest object based on what was posted
          var manifest = new Manifest(req.body);

          // If there isn't a title specified, we can't proceed. Everything else is okay with being empty.
          if(!req.body.title){
              res.status(400);
              res.send('Manifest title is required');
          }
          else {
              // Save to MongoDB
              manifest.save();
              // HTTP Code 201 (CREATED) is sent for success
              res.status(201);
              // Respond back with the object to the user
              res.send(manifest);
          }
      }) // End .post
      .get(function(req,res){ // Handle GET
          // Lets handle a /?user= if applicable
          var query = {};
          if(req.query.category) { query.category = req.query.category; }

          // Find all Manifests, and also process the query if defined
          Manifest.find(query, function(err,manifests){
              // If there's an error, post the Internal Server Error HTTP Code
              if(err)
                  res.status(500).send(err);
              else {
                  // Setup an array to store all the Manifests returned
                  var returnManifests = [];
                  manifests.forEach(function(element, index, array){
                      // Take the elements and turn them in to JSON format
                      var newManifest = element.toJSON();
                      // Add links to each Manifest so its all HATEOAS compatible
                      newManifest.links= {};
                      newManifest.links.self = 'http://' + req.headers.host + '/api/manifest/' + newManifest._id;
                      returnManifests.push(newManifest);
                  });
                  res.json(returnManifests);
              }
          });
      });

// We always want this to be executed when accessing by ID
    manifestRouter.use('/:manifestId', function(req,res,next){
        Manifest.findById(req.params.manifestId, function(err,manifest){
            if(err)
                res.status(500).send(err);
            else if(manifest)
            {
                req.manifest = manifest;
                next();
            }
            else
            {
                res.status(404).send('no manifest found');
            }
        });
    });

// But we only want to route if the use() does a next()
    manifestRouter.route('/:manifestId')
        .get(function(req,res){

            var returnManifest = req.manifest.toJSON();

            returnManifest.links = {};
            var newLink = 'http://' + req.headers.host + '/api/manifest/?category=' + returnManifest.category;
            returnManifest.links.FilterByCategory = newLink.replace(' ', '%20');
            res.json(returnManifest);

        })
        .put(function(req,res){
            req.manifest.title = req.body.title;
            req.manifest.author = req.body.author;
            req.manifest.revision = req.body.revision;
            req.manifest.category = req.body.category;
            req.manifest.product = req.body.product;
            req.manifest.description = req.body.description;
            req.manifest.outcome = req.body.outcome;
            req.manifest.steps = req.body.steps;
            req.manifest.save(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.manifest);
                }
            });
        })
        .patch(function(req,res){
            if(req.body._id) // We do this because we don't want to patch the ID ever.
                delete req.body._id;

            for(var key in req.body)
            {
                req.manifest[key] = req.body[key];
            }

            req.manifest.save(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.manifest);
                }
            });
        })
        .delete(function(req,res){
            req.manifest.remove(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.status(204).send('Removed');
                }
            });
        });

    return manifestRouter;
};

module.exports = routes;
