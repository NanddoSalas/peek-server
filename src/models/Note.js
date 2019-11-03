const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const NoteSchema = mongoose.Schema({

  title: {
    type: String,
    required: false,
  },

  text: {
    type: String,
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  createdBy: {
    type: ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('Note', NoteSchema);
