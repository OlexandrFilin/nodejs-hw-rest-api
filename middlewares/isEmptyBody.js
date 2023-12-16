import { HttpError } from "../helpers/HttpError.js";

const isEmptyBody = (req,res,next)=>{
 const {length} = Object.keys(req.body);
 if (!length) {
  return next(HttpError(400,"Missing fields"))
 }
 return next();
}

export default isEmptyBody;