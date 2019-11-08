const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { SECRET } = require('./config');
const { getUser } = require('./utils');
const pubsub = require('./pubsub');

const context = async ({ req, res, connection }) => {
  if (connection) {
    return {
      ...connection.context,
      pubsub,
      req,
      res,
    };
  }

  return {
    SECRET,
    pubsub,
    req,
    res,
    user: req.user,
  };
};

const onConnect = async (connectionParams) => {
  const token = connectionParams.authToken;
  const user = await getUser(token);

  if (!user) throw new AuthenticationError('Must authenticate');

  return { user };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  subscriptions: { onConnect, path: '/subscriptions' },
  playground: { subscriptionEndpoint: '/subscriptions' },
});

module.exports = server;
