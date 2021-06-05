import bunyan from 'bunyan'
import CONFIG from './config'

const log = bunyan.createLogger({ name: CONFIG.PROJECT_NAME })

export default log
