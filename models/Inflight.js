var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var inflightModel = new Schema({
  title: {
    type: String
  },
  referencedFlightplan: {
    type: String
  },
  user: {
    type: String
  },
  notes: {
    type: String
  },
  lastChecked: {
    type: String
  },
  completed: {
    type: Boolean
  }
});

module.exports = mongoose.model('Inflight', inflightModel);
