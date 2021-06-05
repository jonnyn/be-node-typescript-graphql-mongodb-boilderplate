import { Request, Response } from 'express'
import { PubSub } from 'apollo-server-express'

export interface User {
  id?: string
}

export interface Context {
  req: Request
  res: Response
  user?: User
  isTokenExpired?: boolean
  pubsub?: PubSub
}

export interface HttpExceptionJSON {
  status: number
  message: string
}
