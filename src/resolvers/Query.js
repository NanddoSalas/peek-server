const { ApolloError, AuthenticationError } = require('apollo-server-express');
const Note = require('../models/Note');

exports.getNotes = (_, __, { user }) => {
  if (!user) throw new AuthenticationError('Must authenticate');

  try {
    const notes = Note.find({ _id: { $in: user.notes } }, null, { sort: { _id: -1 } });
    if (!notes) return [];
    return notes;
  } catch (error) {
    throw new ApolloError('Some Error');
  }
};

exports.me = (_, __, { user }) => user;
