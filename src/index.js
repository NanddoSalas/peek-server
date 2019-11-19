/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const server = require('./apollo');
const db = require('./config/db');
const { authMiddleware } = require('./auth');
const { FRONTEND_URL, PORT, NODE_ENV } = require('./config');

const app = express();

app.use(cookieParser());
app.use(authMiddleware);

server.applyMiddleware({
  app,
  path: '/',
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

db.once('open', () => {
  httpServer.listen({ port: PORT }, () => {
    if (NODE_ENV === 'development') {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`🚀 Server ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
    }
  });
});
