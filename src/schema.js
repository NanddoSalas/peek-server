const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {
  getNotes: [Note!]!
  me: User
}

type Mutation {
  register(username: String!, password: String!): Boolean!
  login(username: String!, password: String!): User!
  createNote(title: String, text: String): Note!
  deleteNote(id: ID!): Note!
  logout: Boolean!
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
`;

module.exports = typeDefs;
