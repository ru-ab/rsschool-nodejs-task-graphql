import { PrismaClient } from '@prisma/client';
import { GraphQLSchema } from 'graphql';
import { mutation } from './mutation.js';
import { query } from './query.js';

export type Context = { prisma: PrismaClient };

export const gqlSchema = new GraphQLSchema({
  query,
  mutation,
});
