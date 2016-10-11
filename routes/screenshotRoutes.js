var express = require('express');
var busboyBodyParser = require('busboy-body-parser');
var request = require('request');

var routes = function(gfs) {

  var screenshotRouter = express.Router();

  var busboyParser = busboyBodyParser({ limit: '5mb' });

  screenshotRouter.route('/upload/')
    .post(busboyParser, function(req, res) {
      var part = req.files.filefield;

      var writeStream = gfs.createWriteStream({
        filename: part.name,
        mode: 'w',
        content_type:part.mimetype
      });

      console.log("req.body.desktop: " + req.body.desktop);

      writeStream.on('close', function() {
        /*return res.status(200).send({
          message: 'Success'
        }); */

        // Update the desktop API with the screenshot name
        //attachScreenshotToDesktop(req.body.desktop, part.name);
        attachScreenshotToDesktop(req.body.desktopId, part.name);

        // Redirect to the screenshot itself
        res.redirect('/api/screenshot/' + part.name);
      });

      writeStream.write(part.data);

      writeStream.end()

    });

    screenshotRouter.route('/:filename')
      .get(busboyParser, function(req, res) {
        gfs.files.find({filename:req.params.filename}).toArray(function(err, files) {
          if (files.length === 0) {
            return res.status(400).send({
              message: 'File not found'
            });
          }

          res.writeHead(200, {'Content-Type': files[0].contentType});

          var readstream = gfs.createReadStream({
            filename: files[0].filename
          });

          readstream.on('data', function(data) {
            res.write(data);
          });

          readstream.on('end', function() {
            res.end();
          });

          readstream.on('error', function(err) {
            console.log('An error occured!', err);
            throw err;
          });
        });
      });

      // Function to patch desktop with screenshot name via desktop API
      var attachScreenshotToDesktop = function(desktop, screenshot) {
        var postData = {
          "lastCommunication": screenshot
        }

        var url = 'http://localhost:8000/api/desktop/' + desktop;
        console.log("Url: " + url);
        var options = {
          method: 'patch',
          body: postData,
          json: true,
          url: url
        };

        request(options, function (err, res, body) {
          if (err) {
            console.log("Error in post");
          }
          console.log("Status Code: " + res.statusCode);
        });
      }

    return screenshotRouter;
};

module.exports = routes;
