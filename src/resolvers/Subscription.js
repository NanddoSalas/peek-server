/* eslint-disable eqeqeq */
const { withFilter } = require('apollo-server-express');
const { NOTE__ADDED, NOTE__DELETED } = require('../eventLabels');


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
