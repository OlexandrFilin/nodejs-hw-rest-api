//import { json } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { isWrapperControler } from "../decorators/index.js";
import { HttpError } from "../helpers/HttpError.js";
import userModel from "../models/User.js";

import gravatar from "gravatar";

import dotenv from "dotenv/config";

const { JWT_SECRET } = process.env;

const signUp = async (req, res) => {
  const { email, password } = req.body;
  const newPathRelative = gravatar.url(email);
  const user = await userModel.findOne({ email });
  if (user) {
    throw HttpError(409, "User with email is already registered");
  }
  const hashPsw = await bcrypt.hash(password, 10);
  const newUser = await userModel.create({
    ...req.body,
    avatarURL: newPathRelative,
    password: hashPsw,
  });
  res.status(201).json({
    user: {
      email: newUser.email,
      avatarURL: newUser.avatarURL,
      subscription: newUser.subscription,
    },
  });
};


const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const hashPsw = await bcrypt.compare(password, user.password);
  if (!hashPsw) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { _id } = user;
  const payload = { _id };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  const newUser = await userModel.findByIdAndUpdate(_id, { token });

  res.json({
    token,
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const getCurent = async (req, res) => {
  const { subscription, email } = req.user;
  

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await userModel.findByIdAndUpdate(_id, { token: "" });
  //res.json({ message: "Logout success" });
  res.status(204).json();
};

const cahngeSubscribtion = async (req, res) => {
  const { _id } = req.user;
  const { subscription: newSubscription } = req.body;
  const user = await userModel.findByIdAndUpdate(_id, {
    subscription: newSubscription,
  });
  res.status(201).json(user);
};
export default {
  signUp: isWrapperControler(signUp),
  signIn: isWrapperControler(signIn),
  getCurent: isWrapperControler(getCurent),
  logout: isWrapperControler(logout),
  cahngeSubscribtion: isWrapperControler(cahngeSubscribtion),

};
