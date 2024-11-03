import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';
import { Context } from '../gqlSchema.js';

export const memberTypeId = new GraphQLEnumType({
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

export const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: memberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

export const memberTypeQueries = {
  memberTypes: {
    type: new GraphQLList(memberType),
    resolve: (_source, args, { prisma }: Context) => prisma.memberType.findMany(),
  },
  memberType: {
    type: memberType,
    args: {
      id: {
        type: new GraphQLNonNull(memberTypeId),
      },
    },
    resolve: (_source, { id }: { id: MemberTypeId }, { loaders }: Context) =>
      loaders.memberTypeById.load(id),
  },
};
