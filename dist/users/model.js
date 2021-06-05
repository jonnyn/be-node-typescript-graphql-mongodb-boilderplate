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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        index: true,
    },
    lastName: {
        type: String,
        required: true,
        index: true,
    },
    userState: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    phone: {
        type: String,
        required: false,
    },
    phoneExt: {
        type: String,
        required: false,
    },
    company: {
        type: String,
        required: true,
        enum: ['REMAX', 'ROYAL_PACIFIC', 'OAKWYN', 'OTHER'],
        index: true,
        sparse: true,
    },
    position: {
        type: String,
        required: true,
        index: true,
        enum: ['ADMIN', 'CLIENT', 'AGENT'],
    },
    role: {
        type: String,
        required: true,
        index: true,
        enum: ['ADMIN', 'USER'],
    },
    lastLogin: {
        type: Date,
        required: false,
    },
}, { timestamps: true });
UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id; // eslint-disable-line
        delete ret._id; // eslint-disable-line
        delete ret.__v; // eslint-disable-line
    },
});
exports.default = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=model.js.map