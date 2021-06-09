// create Express server
import http, { Server } from 'http'
import express, { Express, Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status'
import cors from 'cors'
import CONFIG from './config'
import log from './log'
import HttpException from '../exceptions/HttpException'
import routes from '../routes'

export default class ExpressServer {
  app: Express
  httpServer: Server

  constructor() {
    this.app = express()
    this.setup()
    // this.applyCustomErrorHandler();
    this.httpServer = http.createServer(this.app)
  }

  setup(): void {
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json({ limit: CONFIG.FILE_SIZE }))
    this.app.use(cors())

    // helmet
    this.app.use(helmet())
    this.app.disable('x-powered-by')

    // enable logging
    this.app.use(morgan('combined'))

    // cookies
    this.app.use(cookieParser())

    // connect to MongoDB
    mongoose.connect(CONFIG.MONGO.URI, { useNewUrlParser: true, useUnifiedTopology: true })
    mongoose.connection.on('error', err => log.fatal('[MONGODB] unable to connect', err))
    mongoose.connection.on('open', () => log.info('[MONGODB] connected'))

    // create RESTful API server
    this.app.use('/', routes)

    // create health check route
    this.app.get('/', (req: Request, res: Response) => {
      return res.send('true')
    })
  }

  applyCustomErrorHandler(): NextFunction | void {
    // if error is not an instanceOf APIError then convert it
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (!(err instanceof HttpException)) {
          const apiError = new HttpException(INTERNAL_SERVER_ERROR, err.message)
          return next(apiError)
        }
        return next(err)
      }
    )

    // catch 404 and forward to error handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const error = new HttpException(NOT_FOUND, 'Route Not Found')
      return next(error)
    })

    // general error handler
    this.app.use((err: HttpException, req: Request, res: Response) => {
      res.status(err.status).json(err.toJSON())
    })
  }

  start(): void {
    this.httpServer.listen(CONFIG.PORT, () => {
      log.info(`[API]: ${CONFIG.PROJECT_NAME} 🚀 `, {
        port: CONFIG.PORT,
        env: CONFIG.ENV,
      })
    })
  }
}
