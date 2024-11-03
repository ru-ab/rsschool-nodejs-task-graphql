import {
  GraphQLFloat,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLString,
  Kind,
} from 'graphql';
import { Context } from '../gqlSchema.js';
import { UUIDType } from '../types/uuid.js';
import { post } from './postQueries.js';
import { profile } from './profileQueries.js';

const userInterface: GraphQLInterfaceType = new GraphQLInterfaceType({
  name: 'UserInterface',
  fields: () => ({
    id: { type: UUIDType },
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
    id: { type: UUIDType },
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
    resolve: async (
      _source,
      args,
      { prisma, loaders }: Context,
      info: GraphQLResolveInfo,
    ) => {
      const requestedFields = info.fieldNodes
        .filter((fieldNode) => !!fieldNode.selectionSet)
        .map((fieldNode) => {
          return fieldNode
            .selectionSet!.selections.map((selection) =>
              selection.kind === Kind.FIELD ? selection.name.value : null,
            )
            .filter((selection) => selection !== null);
        });

      const subscribedToUser = requestedFields[0].includes('subscribedToUser');
      const userSubscribedTo = requestedFields[0].includes('userSubscribedTo');

      const users = await prisma.user.findMany({
        include: { subscribedToUser, userSubscribedTo },
      });

      users.forEach((user) => {
        if (subscribedToUser) {
          const subscribers = Array.from(user.subscribedToUser).map((subscription) =>
            users.filter((subscriber) => subscription.subscriberId === subscriber.id),
          );
          loaders.subscribedToUser.prime(user.id, subscribers);
        }

        if (userSubscribedTo) {
          const authors = Array.from(user.userSubscribedTo).map((subscription) =>
            users.filter((author) => subscription.authorId === author.id),
          );
          loaders.userSubscribedTo.prime(user.id, authors);
        }
      });

      return users;
    },
  },
  user: {
    type: user,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: (_source, { id }: { id: string }, { loaders }: Context) =>
      loaders.userById.load(id),
  },
};
