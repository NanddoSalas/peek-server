const { UserInputError } = require('apollo-server');

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
