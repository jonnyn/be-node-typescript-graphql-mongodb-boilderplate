"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
    toJSON() {
        return {
            status: this.status,
            message: this.message,
        };
    }
}
exports.default = HttpException;
//# sourceMappingURL=HttpException.js.map