import { GraphQLObjectType } from 'graphql';
import { postMutations } from './mutations/postMutations.js';
import { profileMutations } from './mutations/profileMutations.js';
import { subscribeToMutation } from './mutations/subscribeToMutation.js';
import { unsubscribeFromMutation } from './mutations/unsubscribeFromMutation.js';
import { userMutations } from './mutations/userMutations.js';

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...postMutations,
    ...profileMutations,
    ...userMutations,
    ...subscribeToMutation,
    ...unsubscribeFromMutation,
  }),
});
