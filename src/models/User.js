/* eslint-disable space-before-function-paren */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },

  name: {
    type: String,
    default: '',
  },

  password: {
    type: String,
    default: '',
  },

  googleProfile: {
    type: String,
    default: '',
  },

  count: {
    type: Number,
    default: 0,
  },

  notes: [ObjectId],
});

UserSchema.methods.setPassword = function(password) {
  this.password = bcrypt.hashSync(password, 10);
};

UserSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
