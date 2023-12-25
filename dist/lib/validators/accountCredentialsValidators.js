"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCreditentialsValidation = void 0;
var zod_1 = require("zod");
exports.AuthCreditentialsValidation = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(5, { message: "Password must be 5 characters long" })
});
