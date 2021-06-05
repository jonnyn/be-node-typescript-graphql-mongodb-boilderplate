import ExpressServer from './utils/express'
import Apollo from './utils/apollo'

const expressServer = new ExpressServer()
const apolloServer = new Apollo()

apolloServer.setup(expressServer)

expressServer.applyCustomErrorHandler()

expressServer.start()
