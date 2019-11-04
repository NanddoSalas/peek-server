const { ApolloError } = require('apollo-server');
const User = require('../models/User');

exports.createdBy = async ({ createdBy }) => {
  try {
    const user = await User.findById(createdBy);
    return user;
  } catch (error) {
    throw new ApolloError('Some Error');
  }
};
