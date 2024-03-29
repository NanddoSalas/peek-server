const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    getNotes: [Note!]!
    me: User
  }

  type Mutation {
    register(username: String!, password: String!, password2: String!): Boolean!
    login(username: String!, password: String!): User!
    logout: Boolean!
    createNote(title: String, text: String): Note!
    deleteNote(id: ID!): Note!
    updateNote(id: ID!, title: String!, text: String!): Note!
    googleAuth(token: String!): User!
  }

  type Subscription {
    noteAdded: Note!
    noteDeleted: Note!
    noteUpdated: Note!
  }

  type User {
    id: ID!
    name: String!
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
