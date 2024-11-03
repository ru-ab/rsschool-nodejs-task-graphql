import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { Context } from '../gqlSchema.js';
import { UUIDType } from '../types/uuid.js';

export const post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: GraphQLString },
  }),
});

export const postQueries = {
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
    resolve: (_source, { id }: { id: string }, { loaders }: Context) =>
      loaders.postById.load(id),
  },
};
