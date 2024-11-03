import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { gqlSchema } from './gqlSchema.js';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { createLoaders } from './loaders/createLoaders.js';

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
      const schema = gqlSchema;
      const source = req.body.query;
      const variableValues = req.body.variables;
      const contextValue = { prisma, loaders: createLoaders(prisma) };

      const validationRules = [depthLimit(5)];
      const validationErrors = validate(schema, parse(source), validationRules);

      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }

      const response = await graphql({
        schema,
        source,
        variableValues,
        contextValue,
      });
      return response;
    },
  });
};

export default plugin;
