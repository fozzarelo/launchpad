/* @flow */

import { getCodeCompiler } from '../CodeService';

describe('Code Service', () => {
  test('compiles single quotes', async () => {
    const code = `"use strict;"

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = undefined;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

exports.context = context;

var _graphqlTools = require('graphql-tools');

var _dataloader = require("dataloader");

var _dataloader2 = _interopRequireDefault(_dataloader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This launchpad illustrates the use of DataLoader to perform
// batching and caching in GraphQL.
//
// Without a caching or batching mechanism,
// it's easy for a naive GraphQL server to
// issue new database requests each time a field is resolved.
//
// Without DataLoader, the GraphQL query requires 7 calls to the database.
// With DataLoader, the GraphQL query requires 2 calls to the database.
//
// All the calls to the database are logged. Press the "Logs" button at the bottom
// of the launchpad to view all the calls being made to the database.
//
// In order to show the use of DataLoader this launchpad uses a fake in-memory
// database. Normally you would use DataLoader with a database.
//
// For more info on DataLoader please refer to the docs: https://github.com/facebook/dataloader

var typeDefs = "\\n  type Post {\\n    id: ID!\\n    title: String\\n  }\\n\\n\\ttype User {\\n\\t\\tid: ID!\\n\\t\\tname: String\\n\\t\\tposts: [Post]!\\n\\t}\\n\\n  type Query {\\n    users: [User] @cacheControl(maxAge: 36000)\\n  }\\n";

var resolvers = {
	Query: {
		users: function users(root, args, context) {
			// execute some data request to return a set of users
			// call number one to the db
			return _promise2.default.resolve(_users);
		}
	},
	User: {
		// call number 2 to the db
		// without dataloader, this would be an additional 6 calls
		posts: function posts(user, args, _ref) {
			var loader = _ref.loader;
			return loader.loadMany(user.postsIds);
		}
	}
};

var schema = exports.schema = (0, _graphqlTools.makeExecutableSchema)({
	typeDefs: typeDefs,
	resolvers: resolvers
});

function context() {
	return {
		// Intitialize the dataloader with the batch function.
		// Note, we create a new DataLoader per request to ensure the cache is flushed.
		loader: new _dataloader2.default(findByIds)
	};
};

var bob = {
	id: 1,
	name: "Bob",
	postsIds: [2, 3, 4, 5]
};

var sam = {
	id: 2,
	name: "Sam",
	postsIds: [1]
};

var stephen = {
	id: 3,
	name: "Stephen",
	postsIds: [3, 4]
};

var pete = {
	id: 4,
	name: "Pete",
	postsIds: [5]
};

var chris = {
	id: 5,
	name: "Chris",
	postsIds: [3]
};

var josh = {
	id: 6,
	name: "Josh",
	postsIds: [1, 5]
};

var hello = {
	id: 1,
	title: "hello from the future"
};
var graphql = {
	id: 2,
	title: "graphql is great"
};
var engine = {
	id: 3,
	title: "apollo engine is amazing!"
};
var support = {
	id: 4,
	title: "the support subscription is super helpful"
};
var fast = {
	id: 5,
	title: "look how fast our app is now!"
};

// think of these like db tables where the join is from user => post on postsIds
var _users = [bob, sam, stephen, pete, chris, josh];
var posts = [hello, graphql, engine, support, fast];

var findByIds = function findByIds(ids) {
	console.log("Find by ids " + ids + ".");
	// this would normally be a database call where you lookup multiple ids at once
	return _promise2.default.resolve(posts.filter(function (post) {
		return ids.indexOf(post.id) > -1;
	}));
};`;

    const result = (await getCodeCompiler())(code);
    expect(result).toMatchSnapshot();

    const doubleQuotesCode = `"use strict;"

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = undefined;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

exports.context = context;

var _graphqlTools = require("graphql-tools");

var _dataloader = require("dataloader");

var _dataloader2 = _interopRequireDefault(_dataloader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This launchpad illustrates the use of DataLoader to perform
// batching and caching in GraphQL.
//
// Without a caching or batching mechanism,
// it's easy for a naive GraphQL server to
// issue new database requests each time a field is resolved.
//
// Without DataLoader, the GraphQL query requires 7 calls to the database.
// With DataLoader, the GraphQL query requires 2 calls to the database.
//
// All the calls to the database are logged. Press the "Logs" button at the bottom
// of the launchpad to view all the calls being made to the database.
//
// In order to show the use of DataLoader this launchpad uses a fake in-memory
// database. Normally you would use DataLoader with a database.
//
// For more info on DataLoader please refer to the docs: https://github.com/facebook/dataloader

var typeDefs = "\\n  type Post {\\n    id: ID!\\n    title: String\\n  }\\n\\n\\ttype User {\\n\\t\\tid: ID!\\n\\t\\tname: String\\n\\t\\tposts: [Post]!\\n\\t}\\n\\n  type Query {\\n    users: [User] @cacheControl(maxAge: 36000)\\n  }\\n";

var resolvers = {
	Query: {
		users: function users(root, args, context) {
			// execute some data request to return a set of users
			// call number one to the db
			return _promise2.default.resolve(_users);
		}
	},
	User: {
		// call number 2 to the db
		// without dataloader, this would be an additional 6 calls
		posts: function posts(user, args, _ref) {
			var loader = _ref.loader;
			return loader.loadMany(user.postsIds);
		}
	}
};

var schema = exports.schema = (0, _graphqlTools.makeExecutableSchema)({
	typeDefs: typeDefs,
	resolvers: resolvers
});

function context() {
	return {
		// Intitialize the dataloader with the batch function.
		// Note, we create a new DataLoader per request to ensure the cache is flushed.
		loader: new _dataloader2.default(findByIds)
	};
};

var bob = {
	id: 1,
	name: "Bob",
	postsIds: [2, 3, 4, 5]
};

var sam = {
	id: 2,
	name: "Sam",
	postsIds: [1]
};

var stephen = {
	id: 3,
	name: "Stephen",
	postsIds: [3, 4]
};

var pete = {
	id: 4,
	name: "Pete",
	postsIds: [5]
};

var chris = {
	id: 5,
	name: "Chris",
	postsIds: [3]
};

var josh = {
	id: 6,
	name: "Josh",
	postsIds: [1, 5]
};

var hello = {
	id: 1,
	title: "hello from the future"
};
var graphql = {
	id: 2,
	title: "graphql is great"
};
var engine = {
	id: 3,
	title: "apollo engine is amazing!"
};
var support = {
	id: 4,
	title: "the support subscription is super helpful"
};
var fast = {
	id: 5,
	title: "look how fast our app is now!"
};

// think of these like db tables where the join is from user => post on postsIds
var _users = [bob, sam, stephen, pete, chris, josh];
var posts = [hello, graphql, engine, support, fast];

var findByIds = function findByIds(ids) {
	console.log("Find by ids " + ids + ".");
	// this would normally be a database call where you lookup multiple ids at once
	return _promise2.default.resolve(posts.filter(function (post) {
		return ids.indexOf(post.id) > -1;
	}));
};`;

    const doubleQuotesResult = (await getCodeCompiler())(doubleQuotesCode);

    expect(doubleQuotesResult).toEqual(result);
  });

  test('compiles hello world', async () => {
    const code = `
// Welcome to Launchpad!
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

    const result = (await getCodeCompiler())(code);
    expect(result).toMatchSnapshot();
  });

  test('compiles dataloader example', async () => {
    const code = `
// This launchpad illustrates the use of DataLoader to perform
// batching and caching in GraphQL.
//
// Without a caching or batching mechanism,
// it's easy for a naive GraphQL server to
// issue new database requests each time a field is resolved.
//
// Without DataLoader, the GraphQL query requires 7 calls to the database.
// With DataLoader, the GraphQL query requires 2 calls to the database.
//
// All the calls to the database are logged. Press the "Logs" button at the bottom
// of the launchpad to view all the calls being made to the database.
//
// In order to show the use of DataLoader this launchpad uses a fake in-memory
// database. Normally you would use DataLoader with a database.
//
// For more info on DataLoader please refer to the docs: https://github.com/facebook/dataloader

import { makeExecutableSchema } from 'graphql-tools';
import DataLoader from "dataloader";

const typeDefs = \`
  type Post {
    id: ID!
    title: String
  }

    type User {
        id: ID!
        name: String
        posts: [Post]!
    }

  type Query {
    users: [User] @cacheControl(maxAge: 36000)
  }
\`;

const resolvers = {
  Query: {
    users: (root, args, context) => {
      // execute some data request to return a set of users
      // call number one to the db
      return Promise.resolve(users);
    },
  },
  User: {
    // call number 2 to the db
    // without dataloader, this would be an additional 6 calls
    posts: (user, args, { loader }) => loader.loadMany(user.postsIds)
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export function context() {
  return {
    // Intitialize the dataloader with the batch function.
    // Note, we create a new DataLoader per request to ensure the cache is flushed.
    loader: new DataLoader(findByIds)
  };
};


const bob = {
  id: 1,
  name: "Bob",
  postsIds: [2, 3, 4, 5]
};

const sam = {
  id: 2,
  name: "Sam",
  postsIds: [1]
};

const stephen = {
  id: 3,
  name: "Stephen",
  postsIds: [3, 4]
};

const pete = {
  id: 4,
  name: "Pete",
  postsIds: [5]
};

const chris = {
  id: 5,
  name: "Chris",
  postsIds: [3]
};

const josh = {
  id: 6,
  name: "Josh",
  postsIds: [1, 5]
};

const hello = {
  id: 1,
  title: "hello from the future"
};
const graphql = {
  id: 2,
  title: "graphql is great"
};
const engine = {
  id: 3,
  title: "apollo engine is amazing!"
};
const support = {
  id: 4,
  title: "the support subscription is super helpful"
};
const fast = {
  id: 5,
  title: "look how fast our app is now!"
};

// think of these like db tables where the join is from user => post on postsIds
const users = [bob, sam, stephen, pete, chris, josh];
const posts = [hello, graphql, engine, support, fast];

const findByIds = (ids) => {
  console.log(\`Find by ids \${ids}.\`);
  // this would normally be a database call where you lookup multiple ids at once
  return Promise.resolve(posts.filter(post => ids.indexOf(post.id) > -1));
}
    `;

    const result = (await getCodeCompiler())(code);
    expect(result).toMatchSnapshot();
  });
});
