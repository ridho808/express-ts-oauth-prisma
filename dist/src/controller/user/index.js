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
exports.OauthGoogleCallback = exports.OauthGoogle = exports.RefreshToken = exports.LoginUser = exports.CreateUser = void 0;
const client_1 = require("../../generated/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
const oauth_google_1 = require("../../config/oauth-google");
const googleapis_1 = require("googleapis");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const CreateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, username, email, password } = req.body;
        const findUser = yield prisma.user_app.findMany({
            where: {
                email: email
            }
        });
        if (!name || !username || !email || !password)
            return res.status(400).json({ status: 400, message: "Please Fill All Field", data: null });
        if (findUser.length)
            return res.status(400).json({ status: 200, message: "Email Has been Registered", data: [] });
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const Register = yield prisma.user_app.create({
            data: {
                name, username, email, password: hashedPassword
            }
        });
        return res.status(200).json({ status: 200, message: "Success Create User", data: Register });
    }
    catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal Server Error', data: error });
    }
});
exports.CreateUser = CreateUser;
const LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const findUser = yield prisma.user_app.findFirst({
            where: {
                email: email
            }
        });
        if (!email || !password)
            return res.status(400).json({ status: 400, message: "Please Fill All Field", data: null });
        if (!findUser)
            return res.status(200).json({ status: 200, message: "Email Not Registered", data: findUser });
        const isMatch = yield bcrypt_1.default.compare(password, `${findUser.password}`);
        if (!isMatch)
            return res.status(200).json({ status: 200, message: "Password Wrong" });
        const { name, username } = findUser;
        const token = (0, jsonwebtoken_1.sign)({ name, username, email }, process.env.ACCESS_SECRET_TOKEN, { expiresIn: `1d` });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ status: 200, message: "Success Login", data: token });
    }
    catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal Server Error', data: error });
    }
});
exports.LoginUser = LoginUser;
const RefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        let OpenDecode = (0, jsonwebtoken_1.decode)(token);
        if (!OpenDecode || !token)
            return res.status(401);
        if (typeof OpenDecode == "object") {
            let findUsers = yield prisma.user_app.findFirst({ where: { email: OpenDecode.email } });
            if (!findUsers)
                return res.status(401);
            (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_SECRET_TOKEN, (err, decode) => {
                if (err)
                    return res.status(401);
                const { name, username, email } = decode;
                const AccessToken = (0, jsonwebtoken_1.sign)({ name, username, email }, process.env.ACCESS_SECRET_TOKEN, { expiresIn: `1d` });
                return res.status(201).json({
                    status: 201,
                    message: "Success get Refresh Token",
                    token: AccessToken
                });
            });
        }
    }
    catch (error) {
        return res.json({ status: 400, data: error });
    }
});
exports.RefreshToken = RefreshToken;
const OauthGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.redirect(oauth_google_1.AuthorizationOauth);
});
exports.OauthGoogle = OauthGoogle;
const OauthGoogleCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.query;
        const { tokens } = yield oauth_google_1.Oauth2Client.getToken(code);
        oauth_google_1.Oauth2Client.setCredentials(tokens);
        const oauth2 = googleapis_1.google.oauth2({ version: 'v2', auth: oauth_google_1.Oauth2Client });
        const { data } = yield oauth2.userinfo.get();
        if (!data.email || !data.name) {
            return res.json({
                data: data,
            });
        }
        let user = yield prisma.user_app.findFirst({
            where: {
                email: data.email
            }
        });
        if (!user) {
            user = yield prisma.user_app.create({
                data: {
                    name: data.name,
                    email: data.email,
                    username: data.name
                }
            });
        }
        let payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username
        };
        let secret = process.env.ACCESS_SECRET_TOKEN;
        const expiredIn = 60 * 60 * 24;
        const token = (0, jsonwebtoken_1.sign)(payload, secret, { expiresIn: expiredIn });
        return res.status(201).json({
            data: user,
            token: token
        });
    }
    catch (error) {
        return res.json({
            message: "Error",
            data: error
        });
    }
});
exports.OauthGoogleCallback = OauthGoogleCallback;
