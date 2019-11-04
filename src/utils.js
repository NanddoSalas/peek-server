const { UserInputError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');
const User = require('./models/User');


function formatYupError(err) {
  // eslint-disable-next-line prefer-const
  let error = {};

  err.inner.forEach((e) => {
    if (!error[e.path]) error[e.path] = [];
    error[e.path].push(e.message);
  });

  return error;
}

exports.validateInput = async (data, schema) => {
  try {
    await schema.validate(data, { abortEarly: false });
  } catch (err) {
    throw new UserInputError('Invalid Input', formatYupError(err));
  }
};

exports.getUser = async (token) => {
  try {
    const { id } = jwt.verify(token, SECRET);
    const user = await User.findById(id);
    return user;
  } catch (error) {
    return null;
  }
};
