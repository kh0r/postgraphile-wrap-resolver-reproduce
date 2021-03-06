const express = require("express");
const { postgraphile, makeWrapResolversPlugin, makeExtendSchemaPlugin, gql } = require("postgraphile");

const updatedAtWrapper = makeWrapResolversPlugin({
  Test: {
    async updatedAt(resolve, _source, _args, context, _resolveInfo) {
      const { pgClient } = context;
      await pgClient.query("UPDATE test SET updated_at=NOW();");
      const result = await resolve();
      return result;
    }
  },
});

const nowExtension = makeExtendSchemaPlugin(_build => {
  return {
    typeDefs: gql`
      extend type Test {
        now: Datetime!
      }`,
    resolvers: {
      Test: {
        now: async (_query, _args, context, _resolveInfo) => {
          const { pgClient } = context;

          const { rows } = await pgClient.query('SELECT NOW();');
          return rows[0].now.toISOString();
      }
    }
  },
};
});


const app = express();

app.use(
  postgraphile(
    process.env.DATABASE_URL || "postgres://postgres:mysecretpassword@localhost:5432/dbname",
    "public",
    {
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
      appendPlugins:[updatedAtWrapper, nowExtension]
    }
  )
);

app.listen(process.env.PORT || 3000);
