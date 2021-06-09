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
exports.anotherMiddleware = exports.authenticate = exports.getCognitoPems = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const request_1 = __importDefault(require("request"));
const jwk_to_pem_1 = __importDefault(require("jwk-to-pem"));
const config_1 = __importDefault(require("../utils/config"));
const getCognitoPems = () => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        url: config_1.default.AWS.COGNITO.JWKS_URL,
        json: true,
    };
    request_1.default.get(options, (err, resp, body) => {
        if (err) {
            // console.debug(`Failed to download JWKS data. err: ${err}`)
            return (new Error('Internal error occurred downloading JWKS data.')); // don't return detailed info to the caller
        }
        if (!body || !body.keys) {
            // console.debug(`JWKS data is not in expected format. Response was: ${JSON.stringify(resp)}`)
            return (new Error('Internal error occurred downloading JWKS data.')); // don't return detailed info to the caller
        }
        const pems = {};
        for (let i = 0; i < body.keys.length; i += 1) {
            pems[body.keys[i].kid] = jwk_to_pem_1.default(body.keys[i]);
        }
        // console.info(`Successfully downloaded ${body.keys.length} JWK key(s)`)
        return pems;
    });
});
exports.getCognitoPems = getCognitoPems;
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const header = req.headers.authorization;
        if (!header)
            throw new Error('Authorization header is missing');
        const cognitoPems = yield exports.getCognitoPems();
        const token = header.split(' ')[1];
        // Decode the JWT token so we can match it to a key to verify it against
        const decodedNotVerified = jsonwebtoken_1.default.decode(token, { complete: true });
        const user = yield jsonwebtoken_1.default.verify(header.split(' ')[1], cognitoPems[decodedNotVerified.header.kid], { algorithms: ['RS256'] });
        user.id = user.sub;
        req.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.authenticate = authenticate;
const anotherMiddleware = (req, res, next) => {
    // console.log('anotherMiddleware')
    next();
};
exports.anotherMiddleware = anotherMiddleware;
//# sourceMappingURL=auth.middleware.js.map