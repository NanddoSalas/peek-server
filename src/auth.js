const { sign } = require('jsonwebtoken');
const { SECRET } = require('./config');

function createTokens(user) {
  const accesToken = sign(
    { id: user.id },
    SECRET,
    { expiresIn: '15min' },
  );

  const refreshToken = sign(
    { id: user.id, count: user.count },
    SECRET,
    { expiresIn: '7d' },
  );

  return { accesToken, refreshToken };
}

function setTokens(res, user) {
  const { accesToken, refreshToken } = createTokens(user);

  res.cookie('accesToken', accesToken);
  res.cookie('refreshToken', refreshToken);
}

module.exports = {
  createTokens,
  setTokens,
};
