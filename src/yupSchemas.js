const yup = require('yup');
const User = require('./models/User');

exports.registerSchema = yup.object().shape({

  username: yup
    .string()
    .required()
    .min(3)
    .max(32)
    .matches(/^[a-zA-Z0-9]+$/, 'Letters and digits only.')
    .test('unique', 'Username already in use', async (value) => {
      try {
        const docs = await User.countDocuments({ username: value });
        if (docs === 0) return true;
        return false;
      } catch (error) {
        return false;
      }
    }),

  password: yup
    .string()
    .min(3)
    .max(32)
    .required(),

});
