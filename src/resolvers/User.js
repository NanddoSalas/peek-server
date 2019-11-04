const { ApolloError } = require('apollo-server');
const Note = require('../models/Note');

exports.notes = async ({ notes: noteIds }) => {
  try {
    const notes = await Note.find({ _id: { $in: noteIds } });
    return notes;
  } catch (error) {
    throw new ApolloError('Some Error');
  }
};
