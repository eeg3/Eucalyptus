var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var desktopModel = new Schema({
  name: {
    type: String
  },
  user: {
    type: String
  },
  os: {
    type: String
  },
  status: {
    type: String
  },
  sessionState: {
    type: String
  },
  lastCommunication: {
    type: String
  }
});

module.exports = mongoose.model('Desktop', desktopModel);
