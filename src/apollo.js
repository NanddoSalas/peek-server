const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const cookieParserMiddleware = require('cookie-parser')();
const { authMiddleware } = require('./auth');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { SECRET } = require('./config');
const pubsub = require('./pubsub');
const { ENGINE_API_KEY, ENGINE_SCHEMA_TAG, DEBUGPRINTREPORTS } = require('./config').APOLLO;

const context = async ({ req, res, connection }) => {
  if (connection) {
    return {
      ...connection.context,
      pubsub,
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

const onConnect = async (_, ws) => {
  cookieParserMiddleware(ws.upgradeReq, {}, () => {});
  await authMiddleware(ws.upgradeReq, {}, () => {});

  if (!ws.upgradeReq.user) throw new AuthenticationError('Must authenticate');

  return { req: ws.upgradeReq, user: ws.upgradeReq.user };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  subscriptions: { onConnect, path: '/subscriptions' },
  playground: { subscriptionEndpoint: '/subscriptions' },
  engine: {
    apiKey: ENGINE_API_KEY,
    schemaTag: ENGINE_SCHEMA_TAG,
    debugPrintReports: DEBUGPRINTREPORTS,
  },
});

module.exports = server;
