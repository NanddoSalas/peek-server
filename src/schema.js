const { gql } = require('apollo-server');

const typeDefs = gql`
type Query {}
type Mutation {}
type Subscription {}
`;

module.exports = typeDefs;
