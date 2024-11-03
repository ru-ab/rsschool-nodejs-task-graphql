import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { GraphQLSchema } from 'graphql';
import { mutation } from './mutation.js';
import { query } from './query.js';

export type Context = {
  prisma: PrismaClient;
  loaders: {
    userById: DataLoader<string, unknown>;
    postById: DataLoader<string, unknown>;
    postsByAuthorId: DataLoader<string, unknown>;
    profileById: DataLoader<string, unknown>;
    profileByUserId: DataLoader<string, unknown>;
    userSubscribedTo: DataLoader<string, unknown>;
    subscribedToUser: DataLoader<string, unknown>;
    memberTypeById: DataLoader<string, unknown>;
  };
};

export const gqlSchema = new GraphQLSchema({
  query,
  mutation,
});
