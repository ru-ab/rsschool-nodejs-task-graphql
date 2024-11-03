import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { Context } from '../gqlSchema.js';

export const unsubscribeFromMutation = {
  unsubscribeFrom: {
    type: GraphQLBoolean,
    args: {
      userId: {
        type: new GraphQLNonNull(UUIDType),
      },
      authorId: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (
      _source,
      { userId, authorId }: { userId: string; authorId: string },
      { prisma }: Context,
    ) =>
      !!(await prisma.subscribersOnAuthors.delete({
        where: {
          subscriberId_authorId: {
            subscriberId: userId,
            authorId,
          },
        },
      })),
  },
};
