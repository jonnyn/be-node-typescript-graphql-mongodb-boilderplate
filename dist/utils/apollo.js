"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const path_1 = __importDefault(require("path"));
const apollo_server_express_1 = require("apollo-server-express");
const graphql_tools_1 = require("graphql-tools");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jsonwebtoken_2 = require("jsonwebtoken");
const directives_1 = __importDefault(require("./directives"));
const auth_middleware_1 = require("../middleware/auth.middleware");
// import all resolvers
const users_1 = __importDefault(require("../users"));
// add more resolvers
class Apollo {
    constructor() {
        this.pubsub = new apollo_server_express_1.PubSub();
    }
    setup(expressServer) {
        this.loadSchemas();
        Apollo.loadResolvers();
        this.server = new apollo_server_express_1.ApolloServer({
            typeDefs: this.typeDefs,
            resolvers: Apollo.loadResolvers(),
            schemaDirectives: directives_1.default,
            context: this.context,
        });
        const corsOptions = {
            origin(origin, callback) {
                callback(null, true);
            },
            credentials: true,
        };
        this.server.applyMiddleware({ app: expressServer.app, cors: corsOptions });
        this.server.installSubscriptionHandlers(expressServer.httpServer);
    }
    /**
     * Read all schema files with .graphql extension
     * looks for all directories inside ./src directory
     * @private
     */
    loadSchemas() {
        const typesArray = graphql_tools_1.loadFilesSync(path_1.default.join(__dirname, '../'), {
            extensions: ['graphql'],
        });
        this.typeDefs = graphql_tools_1.mergeTypeDefs(typesArray);
    }
    static loadResolvers() {
        return graphql_tools_1.mergeResolvers([users_1.default]);
    }
    context({ req, res, connection, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultContext = { req, res };
            try {
                // get token from request or connection
                // connection is used for subscriptions.
                // req is used for mutations/queries
                const header = connection
                    ? connection.context.authorization
                    : req.headers.authorization;
                if (!header)
                    return defaultContext;
                const cognitoPems = yield auth_middleware_1.getCognitoPems();
                const token = header === null || header === void 0 ? void 0 : header.split(' ')[1];
                // Decode the JWT token so we can match it to a key to verify it against
                const decodedNotVerified = jsonwebtoken_1.default.decode(token, { complete: true });
                // authenticate user using AWS Cognito
                const user = yield jsonwebtoken_1.default.verify(header.split(' ')[1], cognitoPems[decodedNotVerified.header.kid], { algorithms: ['RS256'] });
                user.id = user.sub;
                // add user and pubsub to context
                return Object.assign(Object.assign({}, defaultContext), { user, pubsub: this.pubsub });
            }
            catch (err) {
                if (err instanceof jsonwebtoken_2.TokenExpiredError) {
                    return Object.assign(Object.assign({}, defaultContext), { isTokenExpired: true });
                }
                // console.log('🚑 something went wrong', err.message)
                return defaultContext;
            }
        });
    }
}
exports.default = Apollo;
//# sourceMappingURL=apollo.js.map