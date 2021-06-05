"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHumanReadableId = exports.sortArray = exports.parseFilter = exports.toSort = void 0;
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const toSort = (sortBy) => {
    const str = sortBy.toLowerCase();
    const index = sortBy.lastIndexOf('_');
    const property = lodash_1.default.camelCase(str.slice(0, index));
    const order = str.slice(index + 1, sortBy.length) === 'asc' ? 1 : -1;
    return { [property]: order };
};
exports.toSort = toSort;
const parseFilter = (value) => {
    if (!value)
        return null;
    //const filter = value.trim()
    const filter = value;
    return filter;
};
exports.parseFilter = parseFilter;
const sortArray = (array, sortBy, orderBy = 'ASC') => {
    const sortedArray = lodash_1.default.sortBy(array, sortBy);
    if (orderBy === 'DESC') {
        sortedArray.reverse();
    }
    return sortedArray;
};
exports.sortArray = sortArray;
const generateHumanReadableId = (name) => {
    const unixString = moment_1.default().unix();
    const nameString = name.replace(/\s/g, '_').toUpperCase();
    const string = nameString.concat(`_${unixString}`);
    return string;
};
exports.generateHumanReadableId = generateHumanReadableId;
exports.default = {};
//# sourceMappingURL=helper.js.map