const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {
  getNotes: [Note!]!
}

type Mutation {
  register(username: String!, password: String!): AuthPayload!
  login(username: String!, password: String!): AuthPayload!
  createNote(title: String, text: String): Note!
  deleteNote(id: ID!): Note!
}

type Subscription {
  noteAdded: Note!
  noteDeleted: Note!
}

type User {
  id: ID!
  username: String!
  notes: [Note!]!
}

type Note {
  id: ID!
  title: String
  text: String
  createdAt: String!
  createdBy: User!
}

type AuthPayload {
  token: String!
  user: User!
}
`;

module.exports = typeDefs;
