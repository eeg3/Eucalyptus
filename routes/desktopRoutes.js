var express = require('express');

// We need the "Desktop" parameter to get the ORM model
var routes = function(Desktop){
    // desktopRouter is going to be our router (router-level middleware)
    var desktopRouter = express.Router();

// Handle POST to add a new desktop
    desktopRouter.route('/')
      .post(function(req, res){ // Handle POST
          // We're creating, so let's create a new desktop object based on what was posted
          var desktop = new Desktop(req.body);

          // If there isn't a name specified, we can't proceed. Everything else is okay with being empty.
          if(!req.body.name){
              res.status(400);
              res.send('Computer name is required');
          }
          else {
              // Save to MongoDB
              desktop.save();
              // HTTP Code 201 (CREATED) is sent for success
              res.status(201);
              // Respond back with the object to the user
              res.send(desktop);
          }
      }) // End .post
      .get(function(req,res){ // Handle GET
          // Lets handle a /?user= if applicable
          var query = {};
          if(req.query.user) { query.user = req.query.user; }

          // Find all desktops, and also process the query if defined
          Desktop.find(query, function(err,desktops){
              // If there's an error, post the Internal Server Error HTTP Code
              if(err)
                  res.status(500).send(err);
              else {
                  // Setup an array to store all the desktops returned
                  var returnDesktops = [];
                  desktops.forEach(function(element, index, array){
                      // Take the elements and turn them in to JSON format
                      var newDesktop = element.toJSON();
                      // Add links to each desktop so its all HATEOAS compatible
                      newDesktop.links= {};
                      newDesktop.links.self = 'http://' + req.headers.host + '/api/desktop/' + newDesktop._id
                      returnDesktops.push(newDesktop);
                  });
                  res.json(returnDesktops);
              }
          });
      });

// We always want this to be executed when accessing by ID
    desktopRouter.use('/:desktopId', function(req,res,next){
        Desktop.findById(req.params.desktopId, function(err,desktop){
            if(err)
                res.status(500).send(err);
            else if(desktop)
            {
                req.desktop = desktop;
                next();
            }
            else
            {
                res.status(404).send('no desktop found');
            }
        });
    });

// But we only want to route if the use() does a next()
    desktopRouter.route('/:desktopId')
        .get(function(req,res){

            var returnDesktop = req.desktop.toJSON();

            returnDesktop.links = {};
            var newLink = 'http://' + req.headers.host + '/api/desktop/?user=' + returnDesktop.user;
            returnDesktop.links.FilterByUser = newLink.replace(' ', '%20');
            res.json(returnDesktop);

        })
        .put(function(req,res){
            req.desktop.name = req.body.name;
            req.desktop.user = req.body.user;
            req.desktop.os = req.body.os;
            req.desktop.status = req.body.status;
            req.desktop.lastCommunication = req.body.lastCommunication;
            req.desktop.save(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.desktop);
                }
            });
        })
        .patch(function(req,res){
            if(req.body._id) // We do this because we don't want to patch the ID ever.
                delete req.body._id;

            for(var key in req.body)
            {
                req.desktop[key] = req.body[key];
            }

            req.desktop.save(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.desktop);
                }
            });
        })
        .delete(function(req,res){
            req.desktop.remove(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.status(204).send('Removed');
                }
            });
        });

    return desktopRouter;
};

module.exports = routes;
