"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = express_1.Router();
router.route('/documents').post(controller_1.uploadDocument);
router.route('/avatars').post(controller_1.uploadAvatar);
exports.default = router;
//# sourceMappingURL=route.js.map