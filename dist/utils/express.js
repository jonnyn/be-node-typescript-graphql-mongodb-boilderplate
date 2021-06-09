"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// create Express server
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const http_status_1 = require("http-status");
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config"));
const log_1 = __importDefault(require("./log"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const routes_1 = __importDefault(require("../routes"));
class ExpressServer {
    constructor() {
        this.app = express_1.default();
        this.setup();
        // this.applyCustomErrorHandler();
        this.httpServer = http_1.default.createServer(this.app);
    }
    setup() {
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.json({ limit: config_1.default.FILE_SIZE }));
        this.app.use(cors_1.default());
        // helmet
        this.app.use(helmet_1.default());
        this.app.disable('x-powered-by');
        // enable logging
        this.app.use(morgan_1.default('combined'));
        // cookies
        this.app.use(cookie_parser_1.default());
        // connect to MongoDB
        mongoose_1.default.connect(config_1.default.MONGO.URI, { useNewUrlParser: true, useUnifiedTopology: true });
        mongoose_1.default.connection.on('error', err => log_1.default.fatal('[MONGODB] unable to connect', err));
        mongoose_1.default.connection.on('open', () => log_1.default.info('[MONGODB] connected'));
        // create RESTful API server
        this.app.use('/', routes_1.default);
        // create health check route
        this.app.get('/', (req, res) => {
            return res.send('true');
        });
    }
    applyCustomErrorHandler() {
        // if error is not an instanceOf APIError then convert it
        this.app.use((err, req, res, next) => {
            if (!(err instanceof HttpException_1.default)) {
                const apiError = new HttpException_1.default(http_status_1.INTERNAL_SERVER_ERROR, err.message);
                return next(apiError);
            }
            return next(err);
        });
        // catch 404 and forward to error handler
        this.app.use((req, res, next) => {
            const error = new HttpException_1.default(http_status_1.NOT_FOUND, 'Route Not Found');
            return next(error);
        });
        // general error handler
        this.app.use((err, req, res) => {
            res.status(err.status).json(err.toJSON());
        });
    }
    start() {
        this.httpServer.listen(config_1.default.PORT, () => {
            log_1.default.info(`[API]: ${config_1.default.PROJECT_NAME} 🚀 `, {
                port: config_1.default.PORT,
                env: config_1.default.ENV,
            });
        });
    }
}
exports.default = ExpressServer;
//# sourceMappingURL=express.js.map