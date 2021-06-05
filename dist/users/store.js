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
const mongoose_1 = __importDefault(require("mongoose"));
const lodash_1 = __importDefault(require("lodash"));
const helper_1 = require("../utils/helper");
const model_1 = __importDefault(require("./model"));
const querySelector = (filter, id) => {
    let query = () => {
        const q = id ? model_1.default.find({ id }) : model_1.default.find();
        return q;
    };
    if (filter) {
        if (filter.type === 'search') {
            const regFilter = RegExp(filter.data, 'i');
            query = () => {
                const q = model_1.default.find({
                    $or: [
                        { firstName: { $regex: regFilter, $options: 'i' } },
                        { lastName: { $regex: regFilter, $options: 'i' } },
                        { email: { $regex: regFilter, $options: 'i' } },
                        { position: { $regex: regFilter, $options: 'i' } },
                    ],
                });
                return q;
            };
        }
        else if (filter.type === 'sales_search') {
            const regFilter = RegExp(filter.data, 'i');
            query = () => {
                const q = model_1.default.find({
                    $and: [
                        {
                            $or: [
                                { firstName: { $regex: regFilter, $options: 'i' } },
                                { lastName: { $regex: regFilter, $options: 'i' } },
                                { email: { $regex: regFilter, $options: 'i' } },
                            ],
                        },
                        { position: 'SALES' },
                    ],
                });
                return q;
            };
        }
        else {
            query = () => {
                const q = model_1.default.find({ [filter.type]: filter.data });
                return q;
            };
        }
    }
    return query;
};
// Queries
const getUsers = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, skip = 0, limit, sortBy = 'FIRST_NAME_DESC', filter, } = params;
    const sort = helper_1.toSort(sortBy);
    // if filters exist, then its a search, else return all users list
    const query = querySelector(filter, id);
    const count = yield query().countDocuments();
    const sortedQuery = query().sort(sort);
    const paginatedQuery = limit ? sortedQuery.skip(skip).limit(limit) : sortedQuery;
    const users = yield paginatedQuery.exec();
    return { users, count };
});
const getUser = (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return null;
    return model_1.default.findById(id);
};
const me = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = input.user;
    const now = new Date();
    //return User.findOneAndUpdate({ auth0Id: id }, { lastLogin: now })
    return model_1.default.findOne({ auth0Id: id });
});
// Mutations
const createUser = (input, context) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = model_1.default.create(input);
    return newUser;
});
const updateUser = (input, context) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = input;
    const props = lodash_1.default.omitBy(input, lodash_1.default.isNil);
    const updatedUserData = yield model_1.default.findByIdAndUpdate(id, props);
    return updatedUserData;
});
exports.default = {
    getUsers, createUser, getUser, updateUser, me,
};
//# sourceMappingURL=store.js.map