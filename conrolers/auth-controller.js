//import { json } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { isWrapperControler } from "../decorators/index.js";
import { HttpError } from "../helpers/HttpError.js";
import userModel from "../models/User.js";
import dotenv from "dotenv/config";

const {JWT_SECRET} =process.env;
//const {JWT_SECRET}= process.env;


//console.log('process.env', process.env)

const signUp = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    throw HttpError(409, "User with email is already registered");
  }
  const hashPsw = await bcrypt.hash(password, 10);
  const newUser = await userModel.create({ ...req.body, password: hashPsw });
  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    throw HttpError(401,"Email or password is wrong");
  };
  const hashPsw = await bcrypt.compare(password, user.password);
  if (!hashPsw) {
    throw HttpError(401,"Email or password is wrong");
  };
const {_id }=user;
const payload = {_id};

 const token = jwt.sign(payload,JWT_SECRET,{expiresIn :'23h'})

  res.status(201).json({
    token,
  });
};
export default {
  signUp: isWrapperControler(signUp),
  signIn: isWrapperControler(signIn),
};
