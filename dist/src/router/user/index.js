"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../../controller/user");
const UserRouter = (0, express_1.Router)();
UserRouter.post('/Register', user_1.CreateUser);
UserRouter.post('/Login', user_1.LoginUser);
UserRouter.post('/RefreshToken', user_1.RefreshToken);
// OauthGoogle 
UserRouter.get("/auth/google", user_1.OauthGoogle);
UserRouter.get("/auth/callback", user_1.OauthGoogleCallback);
exports.default = UserRouter;
