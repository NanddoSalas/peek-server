// const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { ApolloError, AuthenticationError, ForbiddenError } = require('apollo-server');
const { validateInput } = require('../utils');
const { registerSchema } = require('../yupSchemas');
const User = require('../models/User');
const Note = require('../models/Note');


exports.register = async (_, args) => {
  await validateInput(args, registerSchema);
  const { username, password } = args;

  const user = new User({ username });
  user.setPassword(password);

  try {
    await user.save();
  } catch (error) {
    throw new ApolloError('Some Error');
  }

  return user;
};

exports.login = async (_, args, { SECRET }) => {
  const { username, password } = args;

  try {
    const user = await User.findOne({ username });
    if (!user.checkPassword(password)) throw new ApolloError('Invalid credentials');

    const token = jwt.sign({
      id: user.id,
    }, SECRET);

    return token;
  } catch (error) {
    throw new ApolloError('Invalid credentials');
  }
};

exports.createNote = async (_, args, { user }) => {
  if (!user) throw new AuthenticationError('Must authenticate');

  try {
    const note = await Note.create({
      ...args,
      createdBy: user.id,
    });

    user.notes.push(note.id);
    await user.save();

    return note;
  } catch (error) {
    throw new ApolloError('Some Error');
  }
};

exports.deleteNote = async (_, { id }, { user }) => {
  if (!user) throw new AuthenticationError('Must authenticate');

  const note = await Note.findById(id);
  if (!note) throw new ApolloError('Some Error');
  // eslint-disable-next-line eqeqeq
  if (note.createdBy != user.id) throw new ForbiddenError('Forbidden');

  await Note.deleteOne({ _id: id });

  user.notes.pull(id);
  await user.save();

  return note;
};
