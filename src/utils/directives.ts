/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint max-classes-per-file: ["error", 4] */
/* eslint-disable no-param-reassign,func-names */
import {
  SchemaDirectiveVisitor,
  AuthenticationError,
  ApolloError,
} from 'apollo-server-express'
import { defaultFieldResolver, GraphQLField } from 'graphql'

const checkToken = (context: Record<string, unknown>) => {
  // token expired
  if (context.isTokenExpired) throw new AuthenticationError('Token Expired')

  // token not provided
  if (!context.user) throw new AuthenticationError('Not authenticated')
}

/** ****************
 * AUTHENTICATED
 ****************** */
class AuthenticatedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>): void {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async function (...args) {
      const [, , context] = args

      checkToken(context)

      return resolve.apply(this, args)
    }
  }
}

/** ****************
 * ADMIN
 ****************** */
class AdminDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>): void {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function (...args) {
      const [, , context] = args

      checkToken(context)

      if (context.user.role !== 'ADMIN') throw new ApolloError('Not Allowed')

      return resolve.apply(this, args)
    }
  }
}

/** ****************
 * AGENCY
 ****************** */
class AgencyDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>): void {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function (...args) {
      const [, , context] = args

      checkToken(context)

      if (context.user.role !== 'AGENCY') throw new ApolloError('Not Allowed')

      return resolve.apply(this, args)
    }
  }
}

/** ****************
 * AGENT
 ****************** */
class AgentDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>): void {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function (...args) {
      const [, , context] = args

      checkToken(context)

      if (context.user.role !== 'AGENT') throw new ApolloError('Not Allowed')

      return resolve.apply(this, args)
    }
  }
}

export default {
  authenticated: AuthenticatedDirective,
  admin: AdminDirective,
  agency: AgencyDirective,
  agent: AgentDirective,
}
