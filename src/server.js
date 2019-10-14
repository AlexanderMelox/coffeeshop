// filesystem package to read / write files
const fs = require('fs');
const cuid = require('cuid');
const { ApolloServer, gql } = require('apollo-server');

const orders = JSON.parse(fs.readFileSync(`${__dirname}/db.json`, 'utf-8'));

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
    orders: () => orders,
    order: (obj, args) => {
      let order = orders.find(order => order.id === args.id);
      return order;
    }
  },
  Mutation: {
    createOrder(obj, { input }) {
      let newOrder = {
        id: cuid(),
        ...input
      };
      orders.push(newOrder);
      return newOrder;
    },
    updateOrder(obj, { id, input }) {
      let updatedOrder;
      orders.forEach(order => {
        if (order.id === id) {
          order = { ...order, ...input };
          updatedOrder = order;
        }
      });
      return updatedOrder;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
