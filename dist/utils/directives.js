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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint max-classes-per-file: ["error", 4] */
/* eslint-disable no-param-reassign,func-names */
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("graphql");
const checkToken = (context) => {
    // token expired
    if (context.isTokenExpired)
        throw new apollo_server_express_1.AuthenticationError('Token Expired');
    // token not provided
    if (!context.user)
        throw new apollo_server_express_1.AuthenticationError('Not authenticated');
};
/** ****************
 * AUTHENTICATED
 ****************** */
class AuthenticatedDirective extends apollo_server_express_1.SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = graphql_1.defaultFieldResolver } = field;
        field.resolve = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const [, , context] = args;
                checkToken(context);
                return resolve.apply(this, args);
            });
        };
    }
}
/** ****************
 * ADMIN
 ****************** */
class AdminDirective extends apollo_server_express_1.SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = graphql_1.defaultFieldResolver } = field;
        field.resolve = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const [, , context] = args;
                checkToken(context);
                if (context.user.role !== 'ADMIN')
                    throw new apollo_server_express_1.ApolloError('Not Allowed');
                return resolve.apply(this, args);
            });
        };
    }
}
/** ****************
 * AGENCY
 ****************** */
class AgencyDirective extends apollo_server_express_1.SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = graphql_1.defaultFieldResolver } = field;
        field.resolve = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const [, , context] = args;
                checkToken(context);
                if (context.user.role !== 'AGENCY')
                    throw new apollo_server_express_1.ApolloError('Not Allowed');
                return resolve.apply(this, args);
            });
        };
    }
}
/** ****************
 * AGENT
 ****************** */
class AgentDirective extends apollo_server_express_1.SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = graphql_1.defaultFieldResolver } = field;
        field.resolve = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const [, , context] = args;
                checkToken(context);
                if (context.user.role !== 'AGENT')
                    throw new apollo_server_express_1.ApolloError('Not Allowed');
                return resolve.apply(this, args);
            });
        };
    }
}
exports.default = {
    authenticated: AuthenticatedDirective,
    admin: AdminDirective,
    agency: AgencyDirective,
    agent: AgentDirective,
};
//# sourceMappingURL=directives.js.map