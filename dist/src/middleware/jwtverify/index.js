"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtVerify = (req, res, next) => {
    const authheader = req.headers.authorization;
    const token = authheader && authheader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, decode) => {
        if (err)
            return res.sendStatus(403);
        if (decode && typeof decode === "object") {
            req.email = decode.email;
        }
        next();
    });
};
exports.default = jwtVerify;
