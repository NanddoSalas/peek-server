/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const server = require('./apollo');
const db = require('./config/db');
const { authMiddleware } = require('./auth');

const app = express();

app.use(cookieParser());
app.use(authMiddleware);

server.applyMiddleware({
  app,
  path: '/',
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

db.once('open', () => {
  httpServer.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    console.log(`🚀 Server ready at ws://localhost:4000${server.subscriptionsPath}`);
  });
});
