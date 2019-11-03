/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  password: {
    type: String,
    required: true,
  },

  notes: [ObjectId],

});

UserSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, 10);
};

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
