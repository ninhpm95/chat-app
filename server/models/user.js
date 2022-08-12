const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  typing: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;
