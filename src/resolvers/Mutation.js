// const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { ApolloError } = require('apollo-server');
const { validateInput } = require('../utils');
const { registerSchema } = require('../yupSchemas');
const User = require('../models/User');


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
