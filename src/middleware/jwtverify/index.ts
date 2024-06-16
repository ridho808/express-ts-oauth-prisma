import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
interface CustomRequest extends Request {
    email?: string;
  }
const jwtVerify = (req : CustomRequest,res : Response,next : NextFunction) =>{
    const authheader = req.headers.authorization
    const token = authheader && authheader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify(token,process.env.ACCESS_SECRET_TOKEN!,(err,decode) =>{
        if(err) return res.sendStatus(403)
        if(decode && typeof decode === "object"){
            req.email = decode.email
        }
        next()
    })
}

export default jwtVerify