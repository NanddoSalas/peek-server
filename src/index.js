require('dotenv').config();
const { ApolloServer, AuthenticationError } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const db = require('./config/db');
const { SECRET } = require('./config');
const { getUser } = require('./utils');
const pubsub = require('./pubsub');

const context = async ({ req, connection }) => {
  if (connection) {
    return { ...connection.context, pubsub };
  }

  const token = req.headers.authorization || '';

  const user = await getUser(token);

  return {
    SECRET,
    user,
    pubsub,
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
  subscriptions: { onConnect },
});

db.once('open', () => {
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
