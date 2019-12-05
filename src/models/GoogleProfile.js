const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const GoogleProfileSchema = new mongoose.Schema({
  ProfileId: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },

  user: {
    type: ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('GoogleProfile', GoogleProfileSchema);
