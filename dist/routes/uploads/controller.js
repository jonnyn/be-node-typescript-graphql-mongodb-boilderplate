"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.uploadAvatar = exports.uploadDocument = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importStar(require("http-status"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const mime_types_1 = __importDefault(require("mime-types"));
const uuid_1 = __importDefault(require("uuid"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = __importDefault(require("../../utils/config"));
const s3_1 = require("../../connectors/s3");
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: config_1.default.AWS.S3.ACCESS_KEY,
    secretAccessKey: config_1.default.AWS.S3.SECRET_ACCESS_KEY,
});
const limits = {
    fileSize: 50 * 1024 * 1024, // 50Mb, in bytes
};
const uploadDocument = (req, res) => {
    const storage = multer_s3_1.default({
        s3,
        bucket: config_1.default.AWS.S3.BUCKET,
        key: (_, file, cb) => {
            const f = file;
            const extension = mime_types_1.default.extension(file.mimetype);
            f.id = `documents/${uuid_1.default.v4()}.${extension}`.replace(/-/g, '');
            f.extension = extension;
            cb(null, f.id);
        },
    });
    const fileFilter = (_, file, cb) => {
        const allowedExtensions = ['pdf'];
        const extension = mime_types_1.default.extension(file.mimetype);
        if (allowedExtensions.includes(extension)) {
            cb(null, true);
        }
        else {
            const error = new Error('Invalid file extension');
            error.code = 'INVALID_EXTENSION';
            cb(error);
        }
    };
    const upload = multer_1.default({ storage, fileFilter, limits }).single('file');
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(http_status_1.default.BAD_REQUEST).json({
                code: err.code.toLowerCase(),
                message: err.message,
            });
            return;
        }
        const file = {
            name: req.file.originalname,
            key: req.file.id,
        };
        res.status(http_status_1.CREATED).json(file);
    }));
};
exports.uploadDocument = uploadDocument;
const uploadAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storage = multer_s3_1.default({
        s3,
        bucket: config_1.default.AWS.S3.BUCKET,
        key: (_, file, cb) => {
            const f = file;
            const extension = mime_types_1.default.extension(file.mimetype);
            f.id = `avatars/${uuid_1.default.v4()}.${extension}`.replace(/-/g, '');
            f.extension = extension;
            cb(null, f.id);
        },
    });
    const fileFilter = (_, file, cb) => {
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        const extension = mime_types_1.default.extension(file.mimetype);
        if (allowedExtensions.includes(extension)) {
            cb(null, true);
        }
        else {
            const error = new Error('Invalid file extension');
            error.code = 'INVALID_EXTENSION';
            cb(error);
        }
    };
    const upload = multer_1.default({ storage, fileFilter, limits }).single('file');
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(http_status_1.default.BAD_REQUEST).json({
                code: err.code.toLowerCase(),
                message: err.message,
            });
            return;
        }
        const file = {
            name: req.file.originalname,
            key: req.file.key,
            url: yield s3_1.generateFileUrl(req.file.key),
        };
        res.status(http_status_1.CREATED).json(file);
    }));
});
exports.uploadAvatar = uploadAvatar;
exports.default = { uploadDocument: exports.uploadDocument, uploadAvatar: exports.uploadAvatar };
//# sourceMappingURL=controller.js.map