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
/* eslint-disable @typescript-eslint/no-explicit-any */
const node_fetch_1 = __importDefault(require("node-fetch"));
const async_retry_1 = __importDefault(require("async-retry"));
const querystring_1 = __importDefault(require("querystring"));
const http_status_1 = require("http-status");
const log_1 = __importDefault(require("utils/log"));
const MAX_RETRIES = 5;
const FACTOR = 2;
const MIN_TIMEOUT = 50;
exports.default = (uri, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    return (async_retry_1.default((bail, attempt) => __awaiter(void 0, void 0, void 0, function* () {
        if (attempt > 1) {
            log_1.default.warn('retry, attempt', attempt);
        }
        const { method = 'GET', body, headers = {}, query, } = options;
        const url = query ? `${uri}?${querystring_1.default.stringify(query)}` : uri;
        const response = yield node_fetch_1.default(url, {
            headers: Object.assign({ Accept: 'application/json', 'Content-Type': 'application/json' }, headers),
            method,
            body: JSON.stringify(body),
        });
        if (!response.ok && response.status >= http_status_1.INTERNAL_SERVER_ERROR) {
            const error = new Error(response.statusText);
            error.response = response;
            error.text = yield response.text();
            throw error;
        }
        return response.json();
    }), { retries: MAX_RETRIES, factor: FACTOR, minTimeout: MIN_TIMEOUT }));
});
//# sourceMappingURL=api.js.map