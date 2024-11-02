import { PrismaClient } from '@prisma/client';
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { MemberTypeId } from '../member-types/schemas.js';
import { UUIDType } from './types/uuid.js';

type Context = { prisma: PrismaClient };

const memberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: {
      value: 'BASIC',
    },
    BUSINESS: {
      value: 'BUSINESS',
    },
  },
});

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

const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: memberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

const post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: GraphQLString },
  }),
});

const user = new GraphQLObjectType({
  name: 'User',
  interfaces: [userInterface],
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profile,
      resolve: (_source: { id: string }, args, { prisma }: Context) =>
        prisma.profile.findUnique({
          where: {
            userId: _source.id,
          },
        }),
    },
    posts: {
      type: new GraphQLList(post),
      resolve: (_source: { id: string }, args, { prisma }: Context) =>
        prisma.post.findMany({
          where: {
            authorId: _source.id,
          },
        }),
    },
    userSubscribedTo: {
      type: new GraphQLList(userInterface),
      resolve: (_source: { id: string }, args, { prisma }: Context) =>
        prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: _source.id,
              },
            },
          },
        }),
    },
    subscribedToUser: {
      type: new GraphQLList(userInterface),
      resolve: (_source: { id: string }, args, { prisma }: Context) =>
        prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: _source.id,
              },
            },
          },
        }),
    },
  }),
});

const profile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: GraphQLString },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: {
      type: memberType,
      resolve: (_source: { memberTypeId: MemberTypeId }, args, { prisma }: Context) =>
        prisma.memberType.findUnique({
          where: {
            id: _source.memberTypeId,
          },
        }),
    },
  }),
});

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(memberType),
      resolve: (_source, args, { prisma }: Context) => prisma.memberType.findMany(),
    },
    memberType: {
      type: memberType,
      args: {
        id: {
          type: memberTypeId,
        },
      },
      resolve: (_source, { id }: { id: MemberTypeId }, { prisma }: Context) =>
        prisma.memberType.findUnique({
          where: {
            id,
          },
        }),
    },
    posts: {
      type: new GraphQLList(post),
      resolve: (_source, args, { prisma }: Context) => prisma.post.findMany(),
    },
    post: {
      type: post,
      args: {
        id: {
          type: UUIDType,
        },
      },
      resolve: (_source, { id }: { id: string }, { prisma }: Context) =>
        prisma.post.findUnique({
          where: {
            id,
          },
        }),
    },
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
      resolve: (_source, { id }: { id: string }, { prisma }: Context) =>
        prisma.user.findUnique({
          where: {
            id,
          },
        }),
    },
    profile: {
      type: profile,
      args: {
        id: {
          type: UUIDType,
        },
      },
      resolve: (_source, { id }: { id: string }, { prisma }: Context) =>
        prisma.profile.findUnique({
          where: {
            id,
          },
        }),
    },
    profiles: {
      type: new GraphQLList(profile),
      resolve: (_source, args, { prisma }: Context) => prisma.profile.findMany(),
    },
  }),
});

export const gqlSchema = new GraphQLSchema({
  query,
});
