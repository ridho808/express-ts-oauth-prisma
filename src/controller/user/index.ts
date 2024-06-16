import { Request,Response } from "express";
import { PrismaClient } from "../../generated/client";
import bcrypt from "bcrypt"
import { decode, sign, verify } from "jsonwebtoken";
import dotenv from "dotenv"
import { AuthorizationOauth, Oauth2Client } from "../../config/oauth-google";
import { google } from "googleapis";
dotenv.config()
const prisma = new PrismaClient();


export const CreateUser = async (req : Request,res:Response) =>{
    try {
        const {name,username,email,password} = req.body
        const findUser =await prisma.user_app.findMany({
            where : {
                email : email
            }
        })
        if(!name || !username || !email || !password) return res.status(400).json({status:400,message:"Please Fill All Field",data:null});
        if (findUser.length) return res.status(400).json({status:200,message:"Email Has been Registered",data:[]});
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const Register = await prisma.user_app.create({
            data : {
                name,username,email,password:hashedPassword
            }
        });
        return res.status(200).json({status:200,message:"Success Create User",data:Register});
    } catch (error) {
        return res.status(500).json({status : 500, message : 'Internal Server Error',data:error})
    }
}


export const LoginUser = async (req : Request,res:Response) =>{
    try {
        const {email,password} = req.body
        const findUser  =await prisma.user_app.findFirst({
            where : {
                email : email
            }
        });
        if(!email || !password) return res.status(400).json({status:400,message:"Please Fill All Field",data:null});
        if (!findUser) return res.status(200).json({status:200,message:"Email Not Registered",data:findUser});
        const isMatch =await bcrypt.compare(password, `${findUser.password}`);
        if (!isMatch) return res.status(200).json({status:200,message:"Password Wrong"});
        const {name,username} = findUser
        const token = sign({name,username,email},process.env.ACCESS_SECRET_TOKEN!,{expiresIn : `1d`});
        res.cookie("token",token,{
            httpOnly:true,
            maxAge : 24 * 60 * 60 * 1000
        })
        return res.status(200).json({status:200,message:"Success Login",data:token});
    } catch (error) {
        return res.status(500).json({status : 500, message : 'Internal Server Error',data:error})
    }
}

export const RefreshToken = async (req: Request,res:Response) =>{
    try {
        const {token} = req.body
        let OpenDecode = decode(token)
        if(!OpenDecode || !token) return res.status(401);

        if(typeof OpenDecode == "object"){
            let findUsers = await prisma.user_app.findFirst({where : {email : OpenDecode.email}})
            if(!findUsers) return res.status(401);

            verify(token,process.env.ACCESS_SECRET_TOKEN!,(err:any,decode:any)=>{
                if(err) return res.status(401);
                
                const {name,username,email} = decode
                const AccessToken = sign({name,username,email},process.env.ACCESS_SECRET_TOKEN!,{expiresIn : `1d`});
                
                return res.status(201).json({
                    status : 201,
                    message : "Success get Refresh Token",
                    token : AccessToken
                })
            })

        }

    } catch (error : any) {
        
        return res.json({status:400,data:error})
        
    }
}




export const OauthGoogle = async(req:Request,res:Response)=>{
    return res.redirect(AuthorizationOauth)
}

export const OauthGoogleCallback = async(req:Request,res:Response)=>{
    try {
        const {code} = req.query
        const {tokens} = await Oauth2Client.getToken(code as string)
        Oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({version : 'v2',auth : Oauth2Client})
        const {data} = await oauth2.userinfo.get()
        if(!data.email || !data.name){
            return res.json({
                data: data,
            })
        }
        let user = await prisma.user_app.findFirst({
            where:{
                email : data.email
            }
        });
        if(!user){
            user = await prisma.user_app.create({
                data:{
                    name : data.name,
                    email : data.email,
                    username : data.name
                }
            });
        }
        let payload = {
            id: user.id,
            name : user.name,
            email : user.email,
            username : user.username
        }
        let secret = process.env.ACCESS_SECRET_TOKEN!
        const expiredIn = 60 * 60 * 24
        const token = sign(payload,secret,{expiresIn:expiredIn})
        return res.status(201).json({
            data :user,
            token : token
        })
    } catch (error) {
        return res.json({
            message :"Error",
            data : error
        })
    }
}