import {  Router } from "express";
import { CreateUser, LoginUser, OauthGoogle, OauthGoogleCallback, RefreshToken } from "../../controller/user";

const UserRouter = Router()

UserRouter.post('/Register',CreateUser)
UserRouter.post('/Login',LoginUser)
UserRouter.post('/RefreshToken',RefreshToken)
// OauthGoogle 
UserRouter.get("/auth/google",OauthGoogle)
UserRouter.get("/auth/callback",OauthGoogleCallback)

export default UserRouter;



