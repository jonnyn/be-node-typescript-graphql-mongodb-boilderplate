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
const url_join_1 = __importDefault(require("url-join"));
const config_1 = __importDefault(require("utils/config"));
const api_1 = __importDefault(require("./api"));
const toCompany = (data) => ({
    id: data.id,
    name: data.name,
    logo: data.companyLogoUri,
});
const coreApi = (endpoint, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const { URL, TOKEN } = config_1.default.CORE_API;
    const joinedUrl = url_join_1.default(URL, endpoint);
    const headers = Object.assign(Object.assign({}, options.headers), { Authorization: `Bearer ${TOKEN}` });
    return api_1.default(joinedUrl, Object.assign(Object.assign({}, options), { headers }));
});
const getCompany = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield coreApi(`/companies/${id}`);
    return toCompany(data);
});
exports.default = {
    getCompany,
};
//# sourceMappingURL=core.js.map