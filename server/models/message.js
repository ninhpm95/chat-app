const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  time: {
    type: String
  },
  userId: {
    type: String,
    required: true
  }
}, {timestamps: true});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
