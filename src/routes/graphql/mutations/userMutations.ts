import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { user } from '../query.js';
import { Context } from '../gqlSchema.js';
import { UUIDType } from '../types/uuid.js';

type UserInputDto = {
  name: string;
  balance: number;
};

const dtoFields = {
  name: { type: GraphQLString },
  balance: { type: GraphQLFloat },
};

const createUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    ...dtoFields,
  }),
});

const changeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    ...dtoFields,
  }),
});

export const userMutations = {
  createUser: {
    type: user,
    args: {
      dto: {
        type: new GraphQLNonNull(createUserInput),
      },
    },
    resolve: (_source, { dto }: { dto: UserInputDto }, { prisma }: Context) =>
      prisma.user.create({
        data: dto,
      }),
  },
  deleteUser: {
    type: GraphQLBoolean,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_source, { id }: { id: string }, { prisma }: Context) =>
      !!(await prisma.user.delete({
        where: {
          id,
        },
      })),
  },
  changeUser: {
    type: user,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
      dto: {
        type: new GraphQLNonNull(changeUserInput),
      },
    },
    resolve: (
      _source,
      { id, dto }: { id: string; dto: UserInputDto },
      { prisma }: Context,
    ) =>
      prisma.user.update({
        where: { id },
        data: dto,
      }),
  },
};
