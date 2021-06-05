"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFileUrl = exports.uploadFile = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = __importDefault(require("../utils/config"));
const S3 = new aws_sdk_1.default.S3({
    accessKeyId: config_1.default.AWS.S3.ACCESS_KEY,
    secretAccessKey: config_1.default.AWS.S3.SECRET_ACCESS_KEY,
});
const uploadFile = (url, key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield node_fetch_1.default(url);
        // TODO: use stream instead of buffer()
        const body = yield response.buffer();
        const result = yield S3.upload({
            Bucket: config_1.default.AWS.S3.BUCKET,
            Key: key,
            Body: body,
        }).promise();
        return result;
    }
    catch (err) {
        console.error(err);
        return err;
    }
});
exports.uploadFile = uploadFile;
const generateFileUrl = (key) => __awaiter(void 0, void 0, void 0, function* () {
    S3.getSignedUrl('getObject', {
        Bucket: config_1.default.AWS.S3.BUCKET,
        Key: key,
    }, (err, url) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return err;
        }
        return url;
    }));
});
exports.generateFileUrl = generateFileUrl;
exports.default = S3;
//# sourceMappingURL=s3.js.map