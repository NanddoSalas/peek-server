// const User = require('../models/User');
const {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express');
const { ObjectId } = require('mongoose').Types;
const { validateInput } = require('../utils');
const { registerSchema } = require('../yupSchemas');
const User = require('../models/User');
const Note = require('../models/Note');
const GoogleProfile = require('../models/GoogleProfile');
const { NOTE__ADDED, NOTE__DELETED, NOTE__UPDATED } = require('../eventLabels');
const { setTokens, clearTokens, verifyGoogleToken } = require('../auth');

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
    if (!user.checkPassword(password)) {
      throw new ApolloError('Invalid credentials');
    }

    setTokens(res, user);

    return user;
  } catch (error) {
    throw new ApolloError('Invalid credentials');
  }
};

exports.googleAuth = async (_, { token }, { res }) => {
  let payload;
  try {
    payload = await verifyGoogleToken(token);
  } catch (error) {
    return null;
  }

  let googleProfile;

  try {
    googleProfile = await GoogleProfile.findOne({ ProfileId: payload.sub });
  } catch (error) {
    return null;
  }

  if (googleProfile) {
    const user = await User.findById(googleProfile.user);
    setTokens(res, user);
    return user;
  }

  const user = new User({
    name: payload.name,
    email: payload.email,
    googleProfile: payload.sub,
  });

  try {
    await user.save();
  } catch (error) {
    return null;
  }

  googleProfile = await GoogleProfile.create({
    ProfileId: payload.sub,
    user: user.id,
  });

  try {
    await googleProfile.save();
  } catch (error) {
    return null;
  }

  setTokens(res, user);

  return user;
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

exports.updateNote = async (_, { id, title, text }, { user, pubsub }) => {
  if (!user) throw new AuthenticationError('Must authenticate');
  if (!ObjectId.isValid(id)) throw new ApolloError('Some Error');

  const note = await Note.findById(id);

  if (!note) throw new ApolloError('Some Error');
  // eslint-disable-next-line eqeqeq
  if (note.createdBy != user.id) throw new ForbiddenError('Forbidden');

  note.title = title;
  note.text = text;
  await note.save();

  pubsub.publish(NOTE__UPDATED, { noteUpdated: note });

  return note;
};
