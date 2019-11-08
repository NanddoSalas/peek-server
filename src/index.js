/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const http = require('http');
const server = require('./apollo');
const db = require('./config/db');

const app = express();

server.applyMiddleware({ app, path: '/' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

db.once('open', () => {
  httpServer.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    console.log(`🚀 Server ready at ws://localhost:4000${server.subscriptionsPath}`);
  });
});
