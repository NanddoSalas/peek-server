/* eslint-disable eqeqeq */
const { withFilter } = require('apollo-server-express');
const { NOTE__ADDED, NOTE__DELETED, NOTE__UPDATED } = require('../eventLabels');


exports.noteAdded = {
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator([NOTE__ADDED]),
    ({ noteAdded: note }, _, { user }) => note.createdBy == user.id,
  ),
};

exports.noteDeleted = {
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator([NOTE__DELETED]),
    ({ noteDeleted: note }, _, { user }) => note.createdBy == user.id,
  ),
};

exports.noteUpdated = {
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator([NOTE__UPDATED]),
    ({ noteUpdated: note }, _, { user }) => note.createdBy == user.id,
  ),
};
