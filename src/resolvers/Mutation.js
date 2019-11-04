// const User = require('../models/User');
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
