import { HttpError } from "../helpers/HttpError.js";
import  jwt from 'jsonwebtoken';
import userModel from "../models/User.js";
import dotenv from "dotenv/config";
const {JWT_SECRET} = process.env;
const autentification = async (req,res,next)=>{
    
 const {authorization} = req.headers;

if (!authorization){
    return next(HttpError(401,"Not authorizet "));
};
const [bearer, token]=  authorization.split(" ");
if(! bearer === "Bearer") {
     return next(HttpError(401,"Not authorizet"));
}
try {
   const {_id}=jwt.verify(token,JWT_SECRET);
   const user = await userModel.findById(_id);
//    console.log('user.token', user.token)
//    console.log('token', token)
    if(!user || !user.token || user.token !== token){
       return next(HttpError(401,"User not found")); 
    };
    
    req.user = user;
   next();  
} catch (error) {
    console.log('first')
    return next(HttpError(401,error.message));
}

}

export default autentification;