import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { Context } from '../gqlSchema.js';
import { UUIDType } from '../types/uuid.js';
import { profile } from '../queries/profileQueries.js';

type ProfileInputDto = {
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
};

const dtoFields = {
  isMale: { type: GraphQLBoolean },
  yearOfBirth: { type: GraphQLInt },
  userId: { type: GraphQLString },
  memberTypeId: { type: GraphQLString },
};

const createProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    ...dtoFields,
  }),
});

const changeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    ...dtoFields,
  }),
});

export const profileMutations = {
  createProfile: {
    type: profile,
    args: {
      dto: {
        type: new GraphQLNonNull(createProfileInput),
      },
    },
    resolve: (_source, { dto }: { dto: ProfileInputDto }, { prisma }: Context) =>
      prisma.profile.create({
        data: dto,
      }),
  },
  deleteProfile: {
    type: GraphQLBoolean,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_source, { id }: { id: string }, { prisma }: Context) =>
      !!(await prisma.profile.delete({
        where: {
          id,
        },
      })),
  },
  changeProfile: {
    type: profile,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
      dto: {
        type: new GraphQLNonNull(changeProfileInput),
      },
    },
    resolve: (
      _source,
      { id, dto }: { id: string; dto: ProfileInputDto },
      { prisma }: Context,
    ) =>
      prisma.profile.update({
        where: { id },
        data: dto,
      }),
  },
};
