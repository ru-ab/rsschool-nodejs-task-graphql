import { GraphQLObjectType } from 'graphql';
import { memberTypeQueries } from './queries/memberTypeQueries.js';
import { postQueries } from './queries/postQueries.js';
import { userQueries } from './queries/userQueries.js';
import { profileQueries } from './queries/profileQueries.js';

export const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...postQueries,
    ...userQueries,
    ...memberTypeQueries,
    ...profileQueries,
  }),
});
