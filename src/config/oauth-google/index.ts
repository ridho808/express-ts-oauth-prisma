import * as dotenv from "dotenv"
import { google } from "googleapis"
dotenv.config()


export const Oauth2Client = new google.auth.OAuth2({
    clientId : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_SECRET_ID,
    redirectUri : "http://localhost:3333/user/auth/callback"
});

 const scope = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
]

export const AuthorizationOauth = Oauth2Client.generateAuthUrl({
    access_type : "offline",
    scope : scope,
    include_granted_scopes : true
})