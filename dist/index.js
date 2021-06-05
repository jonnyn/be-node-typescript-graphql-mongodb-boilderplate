"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./utils/express"));
const apollo_1 = __importDefault(require("./utils/apollo"));
const expressServer = new express_1.default();
const apolloServer = new apollo_1.default();
apolloServer.setup(expressServer);
expressServer.applyCustomErrorHandler();
expressServer.start();
//# sourceMappingURL=index.js.map