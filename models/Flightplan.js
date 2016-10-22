var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var flightplanModel = new Schema({
  title: {
    type: String
  },
  author: {
    type: String
  },
  revision: {
    type: String
  },
  category: {
    type: String
  },
  product: {
    type: String
  },
  description: {
    type: String
  },
  outcome: {
    type: String
  },
  steps: {
    type: String
  }
});

module.exports = mongoose.model('Flightplan', flightplanModel);
