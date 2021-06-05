"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const route_1 = __importDefault(require("./uploads/route"));
const router = express_1.Router();
router.use('/uploads', auth_middleware_1.authenticate, route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map