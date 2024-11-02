import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql } from 'graphql';
import { gqlSchema } from './gqlSchema.js';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const response = await graphql({
        schema: gqlSchema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { prisma },
      });
      return response;
    },
  });
};

export default plugin;
