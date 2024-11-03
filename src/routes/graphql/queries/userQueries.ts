import {
  GraphQLFloat,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Context } from '../gqlSchema.js';
import { UUIDType } from '../types/uuid.js';
import { post } from './postQueries.js';
import { profile } from './profileQueries.js';

const userInterface: GraphQLInterfaceType = new GraphQLInterfaceType({
  name: 'UserInterface',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profile,
    },
    posts: {
      type: new GraphQLList(post),
    },
    userSubscribedTo: {
      type: new GraphQLList(userInterface),
    },
    subscribedToUser: {
      type: new GraphQLList(userInterface),
    },
  }),
  resolveType: () => user.name,
});

export const user = new GraphQLObjectType({
  name: 'User',
  interfaces: [userInterface],
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profile,
      resolve: (_source: { id: string }, args, { loaders }: Context) =>
        loaders.profileByUserId.load(_source.id),
    },
    posts: {
      type: new GraphQLList(post),
      resolve: (_source: { id: string }, args, { loaders }: Context) =>
        loaders.postsByAuthorId.load(_source.id),
    },
    userSubscribedTo: {
      type: new GraphQLList(userInterface),
      resolve: (_source: { id: string }, args, { loaders }: Context) =>
        loaders.userSubscribedTo.load(_source.id),
    },
    subscribedToUser: {
      type: new GraphQLList(userInterface),
      resolve: (_source: { id: string }, args, { loaders }: Context) =>
        loaders.subscribedToUser.load(_source.id),
    },
  }),
});

export const userQueries = {
  users: {
    type: new GraphQLList(user),
    resolve: (_source, args, { prisma }: Context) => prisma.user.findMany(),
  },
  user: {
    type: user,
    args: {
      id: {
        type: UUIDType,
      },
    },
    resolve: (_source, { id }: { id: string }, { loaders }: Context) =>
      loaders.userById.load(id),
  },
};
