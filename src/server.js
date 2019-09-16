import { ApolloServer, gql } from 'apollo-server';
import mongoose from 'mongoose';
import config from './config';

import { Order } from './models/order';

(async () => {
  const typeDefs = gql`
    enum CoffeeSize {
      SHORT
      TALL
      GRANDE
    }

    enum CoffeeFlavor {
      CARAMEL
      ALMOND
      MOCHA
    }

    type Order {
      id: ID!
      name: String!
      email: String
      size: CoffeeSize!
      flavor: CoffeeFlavor
    }

    input NewOrderInput {
      name: String!
      email: String!
      size: CoffeeSize!
      flavor: CoffeeFlavor
    }

    input UpdateOrderInput {
      name: String
      email: String
      size: CoffeeSize
      flavor: CoffeeFlavor
    }

    type Query {
      orders: [Order]!
      order(id: ID!): Order!
    }

    type Mutation {
      newOrder(input: NewOrderInput!): Order!
      updateOrder(id: ID!, input: UpdateOrderInput!): Order!
      removeOrder(id: ID!): Order!
    }

    schema {
      query: Query
      mutation: Mutation
    }
  `;

  const resolvers = {
    Query: {
      orders: async () => {
        return Order.find({});
      },
      order: (_, { id }) => Order.findById(id)
    },
    Mutation: {
      newOrder: (_, { input }) => Order.create(input),
      updateOrder: (_, { id, input }) =>
        Order.findByIdAndUpdate(id, input, { new: true }),
      removeOrder: (_, { id }) => Order.findByIdAndRemove(id)
    },
    Order: {
      id: order => order._id
    }
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await mongoose.connect(config.DB_HOSTED, {
    useNewUrlParser: true
  });

  const { url } = await server.listen({ port: config.PORT });
  console.log(`GraphQL Server running on ${url}`);
})();
