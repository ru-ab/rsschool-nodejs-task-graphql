import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { Context } from '../gqlSchema.js';
import { UUIDType } from '../types/uuid.js';
import { post } from '../queries/postQueries.js';

type PostInputDto = {
  title: string;
  content: string;
  authorId: string;
};

const dtoFields = {
  title: { type: GraphQLString },
  content: { type: GraphQLString },
  authorId: { type: GraphQLString },
};

const createPostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    ...dtoFields,
  }),
});

const changePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    ...dtoFields,
  }),
});

export const postMutations = {
  createPost: {
    type: post,
    args: {
      dto: {
        type: new GraphQLNonNull(createPostInput),
      },
    },
    resolve: (_source, { dto }: { dto: PostInputDto }, { prisma }: Context) =>
      prisma.post.create({
        data: dto,
      }),
  },
  deletePost: {
    type: GraphQLBoolean,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_source, { id }: { id: string }, { prisma }: Context) =>
      !!(await prisma.post.delete({
        where: {
          id,
        },
      })),
  },
  changePost: {
    type: post,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
      dto: {
        type: new GraphQLNonNull(changePostInput),
      },
    },
    resolve: (
      _source,
      { id, dto }: { id: string; dto: PostInputDto },
      { prisma }: Context,
    ) =>
      prisma.post.update({
        where: { id },
        data: dto,
      }),
  },
};
