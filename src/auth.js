/* eslint-disable no-empty */
const { sign, verify } = require('jsonwebtoken');
const { NODE_ENV, ACCESTOKENSECRET, REFRESHTOKENSECRET } = require('./config');
const User = require('./models/User');

function createTokens(user) {
  const accesToken = sign(
    { id: user.id },
    ACCESTOKENSECRET,
    { expiresIn: '15min' },
  );

  const refreshToken = sign(
    { id: user.id, count: user.count },
    REFRESHTOKENSECRET,
    { expiresIn: '7d' },
  );

  return { accesToken, refreshToken };
}

function setTokens(res, user) {
  const { accesToken, refreshToken } = createTokens(user);

  const options = {
    httpOnly: true,
    secure: NODE_ENV === 'production',
  };

  res.cookie('accesToken', accesToken, options);
  res.cookie('refreshToken', refreshToken, options);
}

async function authMiddleware(req, res, next) {
  const { accesToken, refreshToken } = req.cookies;

  // No tokens found
  if (!accesToken && !refreshToken) return next();

  try {
    const { id } = verify(accesToken, ACCESTOKENSECRET);
    const user = await User.findById(id);
    req.user = user;
    // Valid token
    return next();
  } catch (error) {}

  if (!refreshToken) {
    // No refreshToken found
    return next();
  }

  let data;

  try {
    data = verify(refreshToken, REFRESHTOKENSECRET);
  } catch (error) {
    // Invalid refreshToken
    return next();
  }

  const user = await User.findById(data.id);

  if (!user) {
    // No user found
    return next();
  }

  if (user.count !== data.count) {
    // Expired refreshToken
    return next();
  }

  setTokens(res, user);
  req.user = user;

  return next();
}

function clearTokens(res) {
  res.clearCookie('accesToken');
  res.clearCookie('refreshToken');
}

module.exports = {
  createTokens,
  setTokens,
  authMiddleware,
  clearTokens,
};
