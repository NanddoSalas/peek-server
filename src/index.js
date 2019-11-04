require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const db = require('./config/db');
const { SECRET } = require('./config');
const { getUser } = require('./utils');

const context = async ({ req }) => {
  const token = req.headers.authorization || '';

  const user = await getUser(token);

  return {
    SECRET,
    user,
  };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

db.once('open', () => {
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
