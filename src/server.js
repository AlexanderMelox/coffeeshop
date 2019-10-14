// filesystem package to read / write files
const { ApolloServer, gql } = require('apollo-server');

// Utils for querying the "database"
const {
  getAllOrders,
  getOrderByID,
  insertOne,
  updateOrderByID,
  deleteOrderByID
} = require('./utils/orders');

// Construct a schema, using GraphQL schema language
const typeDefs = gql``;

// Provide resolver functions for your schema fields
const resolvers = {};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
