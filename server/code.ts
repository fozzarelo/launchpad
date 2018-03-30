export const STARTER_CODE = `// Welcome to Launchpad!
// Log in to edit and save pads, run queries in GraphiQL on the right.
// Click "Download" above to get a zip with a standalone Node.js server.
// See docs and examples at https://github.com/apollographql/awesome-launchpad

// graphql-tools combines a schema string with resolvers.
import { makeExecutableSchema } from 'graphql-tools';

// Construct a schema, using GraphQL schema language
const typeDefs = \`
  type Query {
    hello: String
  }
\`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return 'Hello world!';
    },
  },
};

// Required: Export the GraphQL.js schema object as "schema"
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Optional: Export a function to get context from the request. It accepts two
// parameters - headers (lowercased http headers) and secrets (secrets defined
// in secrets section). It must return an object (or a promise resolving to it).
export function context(headers, secrets) {
  return {
    headers,
    secrets,
  };
};

// Optional: Export a root value to be passed during execution
// export const rootValue = {};

// Optional: Export a root function, that returns root to be passed
// during execution, accepting headers and secrets. It can return a
// promise. rootFunction takes precedence over rootValue.
// export function rootFunction(headers, secrets) {
//   return {
//     headers,
//     secrets,
//   };
// };
`;

export const RUNNER_WRAPPER = (code: string) =>
  `
  var __LAUNCHPAD__runtimeError;
  try {
    ${code};
  } catch (e) {
    __LAUNCHPAD__runtimeError = e;
  }

  (function() {
    if (__LAUNCHPAD__runtimeError) {
      module.exports = function (context, callback) {
        callback(__LAUNCHPAD__runtimeError);
      };
      return;
    }

    var graphql = require('graphql');
    var ApolloEngine = require('apollo-engine').ApolloEngine;
    var express = require('express');
    var Webtask = require('webtask-tools');
    var bodyParser = require('body-parser');
    var graphqlExpress = require('launchpad-module').apolloServerExpress.graphqlExpress;
    var request = require('request');

    //global variables that survive across runs
    var __server, __proxyExpress, __engine, __webtask;

    var schemaFunction =
      exports.schemaFunction ||
      function() {
        return exports.schema;
      };
    var schema;
    var rootValue = exports.rootValue || {};
    var rootFunction =
      exports.rootFunction ||
      function() {
        return rootValue;
      };
    var contextFn =
      exports.context ||
      function(headers, secrets) {
        return Object.assign(
          {
            headers: headers,
          },
          secrets
        );
      };

    Object.keys(exports).forEach(function(key) {
      if (
        [
          'default',
          'schema',
          'schemaFunction',
          'context',
          'rootValue',
          'rootFunction',
        ].indexOf(key) === -1
      ) {
        throw new Error('Unknown export: ' + key);
      }
    });

    if (!exports.schema && !exports.schemaFunction) {
      throw new Error(
        'You need to export object with a field \`schema\` or a function \`schemaFunction\` to run a Pad.'
      );
    }

    process.env["GOMAXPROCS"] = "1"

    if (!__server) {
      __server = express();
      __server.use(
        '/',
        (req, res, next) => {
          try{
            req.userContext = JSON.parse(req.headers['usercontext']) || {};
          } catch (e){
            req.userContext = {};
          }
          if (!schema) {
            schema = schemaFunction(req.userContext);
          }
          next();
        },
        bodyParser.json(),
        (req, res, next) => {
          const engineKey = req.userContext.APOLLO_ENGINE_KEY;

          graphqlExpress(req =>
            Promise.all([
              Promise.resolve(schema),
              Promise.resolve(contextFn(req.headers, req.userContext)),
              Promise.resolve(rootFunction(req.headers, req.userContext))
            ]).then(results => ({
              schema: results[0],
              context: results[1],
              rootValue: results[2],
              tracing: engineKey && engineKey !== '' ? true : false,
              cacheControl: engineKey && engineKey !== '' ? true : false,
            }))
          )(req, res, next)
        }
      );
    }

    if(!__proxyExpress) {
      __proxyExpress = express();
    }

    if(!__webtask) {
      __webtask = Webtask.fromExpress(__server);
    }

    module.exports = function (context, req, res) {
      req.userContext = JSON.parse(
        context.secrets.userContext
      ).reduce(function(acc, next) {
        acc[next.key] = next.value;
        return acc;
      }, {});

      if (req.userContext.APOLLO_ENGINE_KEY) {
        if(!__engine) {
          __engine = new ApolloEngine({
            apiKey: req.userContext.APOLLO_ENGINE_KEY,
          });

          __engine.listen({
            graphqlPaths: ['/'],
            expressApp: __server,
            port: 0,
            innerHost: '127.0.0.1'
          }, () => {
            __proxyExpress.use((req, res, next) => {
              req.pipe(process.stdout);

              var proxyRes = req.pipe(request({
                uri: __engine.engineListeningAddress.url,
                forever: true,
                headers: {
                  'usercontext': JSON.stringify(req.userContext),
                  'host': req.headers['host'],
                },
              }))
                .on('error', (err) => {
                  console.error(err);
                  res.writeHead(503);
                  res.end();
                });

              proxyRes.pipe(process.stdout);
              proxyRes.pipe(res);
            });

            __webtask = Webtask.fromExpress(__proxyExpress);
            __webtask(context, req, res);
          });
        } else {
          __webtask(context, req, res);
        }
      } else {
        __webtask(context, req, res);
      }
    }
  })();
`;
