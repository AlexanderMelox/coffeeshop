// filesystem package to read / write files
const cuid = require('cuid');
const { ApolloServer, gql } = require('apollo-server');

const {
  getAllOrders,
  getOrderByID,
  insertOne,
  updateOrderByID,
  deleteOrderByID
} = require('./utils/orders');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  enum CoffeeSize {
    SHORT
    TALL
    GRANDE
    MUYGRANDE
  }

  enum CoffeeFlavor {
    MOCHA
    ALMOND
    HAZELNUT
    VANILLA
  }

  type Order {
    id: ID!
    name: String!
    email: String!
    size: CoffeeSize!
    espressoShots: Int
    iced: Boolean
    flavor: CoffeeFlavor
  }

  input NewOrderInput {
    name: String!
    email: String!
    size: CoffeeSize!
    espressoShots: Int
    iced: Boolean
    flavor: CoffeeFlavor
  }

  input UpdateOrderInput {
    name: String
    email: String
    size: CoffeeSize
    espressoShots: Int
    iced: Boolean
    flavor: CoffeeFlavor
  }

  type Query {
    orders: [Order]!
    order(id: ID!): Order!
  }

  type Mutation {
    createOrder(input: NewOrderInput!): Order!
    updateOrder(id: ID!, input: UpdateOrderInput!): Order!
    deleteOrder(id: ID!): Order
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    orders: () => {
      return getAllOrders();
    },
    order: (obj, args) => {
      const order = getOrderByID(args.id);
      return order;
    }
  },
  Mutation: {
    createOrder(obj, { input }) {
      const newOrder = insertOne(input);
      return newOrder;
    },
    updateOrder(obj, { id, input }) {
      let updatedOrder = updateOrderByID(id, input);
      return updatedOrder;
    },
    deleteOrder(obj, { id }) {
      const deletedOrder = deleteOrderByID(id);
      return deletedOrder;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
