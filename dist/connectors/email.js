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
exports.EmailsApi = void 0;
const url_join_1 = __importDefault(require("url-join"));
const graphql_request_1 = require("graphql-request");
const config_1 = __importDefault(require("utils/config"));
exports.EmailsApi = new graphql_request_1.GraphQLClient(url_join_1.default(config_1.default.EMAIL.PROJECT_EMAILS_API, '/graphql'));
const sendInvitationEmail = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    mutation sendInvitationEmail($input: InvitationEmailInput!) {
      sendInvitationEmail(input: $input) {
        error { code }
      }
    }
  `;
    const { InvitationEmailOutput: response } = yield exports.EmailsApi.request(query, { input });
    return response;
});
exports.default = {
    sendInvitationEmail,
};
//# sourceMappingURL=email.js.map