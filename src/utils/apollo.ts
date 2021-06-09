/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path'
import { Request, Response } from 'express'
import { ApolloServer, PubSub } from 'apollo-server-express'
import {
  loadFilesSync,
  mergeTypeDefs,
  mergeResolvers,
  ExecutionParams,
} from 'graphql-tools'
import jwt from 'jsonwebtoken'
import { TokenExpiredError } from 'jsonwebtoken'
import { DocumentNode } from 'graphql'
import ExpressServer from './express'
import directives from './directives'
import { Context } from './types'
import { getCognitoPems } from '../middleware/auth.middleware'

// import all resolvers
import UserResolvers from '../users'
// add more resolvers

export default class Apollo {
  private typeDefs: DocumentNode | undefined

  server: ApolloServer | undefined

  pubsub: PubSub

  constructor() {
    this.pubsub = new PubSub()
  }

  setup(expressServer: ExpressServer): void {
    this.loadSchemas()
    Apollo.loadResolvers()

    this.server = new ApolloServer({
      typeDefs: this.typeDefs,
      resolvers: Apollo.loadResolvers(),
      schemaDirectives: directives,
      subscriptions: {
        onConnect: () => ({ pubsub: this.pubsub }),
      },
      context: this.context,
    })

    const corsOptions = {
      origin(origin: any, callback: (arg0: null, arg1: boolean) => void) {
        callback(null, true)
      },
      credentials: true,
    }

    this.server.applyMiddleware({ app: expressServer.app, cors: corsOptions })
    this.server.installSubscriptionHandlers(expressServer.httpServer)
  }

  /**
   * Read all schema files with .graphql extension
   * looks for all directories inside ./src directory
   * @private
   */
  private loadSchemas() {
    const typesArray = loadFilesSync(path.join(__dirname, '../'), {
      extensions: ['graphql'],
    })
    this.typeDefs = mergeTypeDefs(typesArray)
  }

  private static loadResolvers() {
    return mergeResolvers([UserResolvers])
  }

  private async context({
    req,
    res,
    connection,
  }: {
    req: Request
    res: Response
    connection: ExecutionParams
  }): Promise<Context> {
    const defaultContext = { req, res }

    try {
      // get token from request or connection
      // connection is used for subscriptions.
      // req is used for mutations/queries
      const header = connection
      ? connection.context.authorization
      : req.headers.authorization
      if (!header) return defaultContext

      const cognitoPems: any = await getCognitoPems()
      const token = header?.split(' ')[1]

      // Decode the JWT token so we can match it to a key to verify it against
      const decodedNotVerified: any = jwt.decode(token, { complete: true })

      // authenticate user using AWS Cognito
      const user: any = await jwt.verify(
        header.split(' ')[1],
        cognitoPems[decodedNotVerified.header.kid],
        { algorithms: ['RS256'] },
      )
      user.id = user.sub

      // add user and pubsub to context
      return {
        ...defaultContext,
        user,
        pubsub: this.pubsub,
      }
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return {
          ...defaultContext,
          isTokenExpired: true,
        }
      }
      // console.log('🚑 something went wrong', err.message)
      return defaultContext
    }
  }
}
