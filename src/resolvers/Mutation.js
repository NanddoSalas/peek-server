// const User = require('../models/User');
const { ApolloError, AuthenticationError, ForbiddenError } = require('apollo-server-express');
const { ObjectId } = require('mongoose').Types;
const { validateInput } = require('../utils');
const { registerSchema } = require('../yupSchemas');
const User = require('../models/User');
const Note = require('../models/Note');
const { NOTE__ADDED, NOTE__DELETED } = require('../eventLabels');
const { setTokens, clearTokens } = require('../auth');

exports.register = async (_, args) => {
  await validateInput(args, registerSchema);
  const { username, password } = args;

  const user = new User({ username });
  user.setPassword(password);

  try {
    await user.save();
    return true;
  } catch (error) {
    throw new ApolloError('Some Error');
  }
};

exports.login = async (_, args, { res }) => {
  const { username, password } = args;

  try {
    const user = await User.findOne({ username });
    if (!user.checkPassword(password)) throw new ApolloError('Invalid credentials');

    setTokens(res, user);

    return user;
  } catch (error) {
    throw new ApolloError('Invalid credentials');
  }
};

exports.createNote = async (_, args, { user, pubsub }) => {
  if (!user) throw new AuthenticationError('Must authenticate');

  try {
    const note = await Note.create({
      ...args,
      createdBy: user.id,
    });

    user.notes.push(note.id);
    await user.save();

    pubsub.publish(NOTE__ADDED, { noteAdded: note });

    return note;
  } catch (error) {
    throw new ApolloError('Some Error');
  }
};

exports.deleteNote = async (_, { id }, { user, pubsub }) => {
  if (!user) throw new AuthenticationError('Must authenticate');
  if (!ObjectId.isValid(id)) throw new ApolloError('Some Error');

  const note = await Note.findById(id);

  if (!note) throw new ApolloError('Some Error');
  // eslint-disable-next-line eqeqeq
  if (note.createdBy != user.id) throw new ForbiddenError('Forbidden');

  await Note.deleteOne({ _id: id });

  user.notes.pull(id);
  await user.save();

  pubsub.publish(NOTE__DELETED, { noteDeleted: note });

  return note;
};

exports.logout = (_, __, { res }) => {
  clearTokens(res);
  return true;
};

exports.updateNote = async (_, { id, title, text }, { user }) => {
  if (!user) throw new AuthenticationError('Must authenticate');
  if (!ObjectId.isValid(id)) throw new ApolloError('Some Error');

  const note = await Note.findById(id);

  if (!note) throw new ApolloError('Some Error');
  // eslint-disable-next-line eqeqeq
  if (note.createdBy != user.id) throw new ForbiddenError('Forbidden');

  note.title = title;
  note.text = text;
  await note.save();

  return note;
};
