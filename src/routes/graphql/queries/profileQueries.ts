import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';
import { Context } from '../gqlSchema.js';
import { UUIDType } from '../types/uuid.js';
import { memberType } from './memberTypeQueries.js';

export const profile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: GraphQLString },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: {
      type: memberType,
      resolve: (_source: { memberTypeId: MemberTypeId }, args, { loaders }: Context) =>
        loaders.memberTypeById.load(_source.memberTypeId),
    },
  }),
});

export const profileQueries = {
  profiles: {
    type: new GraphQLList(profile),
    resolve: (_source, args, { prisma }: Context) => prisma.profile.findMany(),
  },
  profile: {
    type: profile,
    args: {
      id: {
        type: UUIDType,
      },
    },
    resolve: (_source, { id }: { id: string }, { loaders }: Context) =>
      loaders.profileById.load(id),
  },
};
