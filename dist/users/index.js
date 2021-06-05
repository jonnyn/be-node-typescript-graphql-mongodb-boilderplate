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
const store_1 = __importDefault(require("./store"));
exports.default = {
    Query: {
        users: (root, { filter }) => store_1.default.getUsers({ filter }),
        user: (root, { id }) => store_1.default.getUser(id),
        me: (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const me = yield store_1.default.me(context);
            return { user: me };
        }),
    },
    Mutation: {
        createUser: (root, { input }, context) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield store_1.default.createUser(input, context);
            return { user };
        }),
        updateUser: (root, { input }, context) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield store_1.default.updateUser(input, context);
            return { user };
        }),
    },
};
//# sourceMappingURL=index.js.map