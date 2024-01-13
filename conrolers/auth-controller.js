//import { json } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { isWrapperControler } from "../decorators/index.js";
import { HttpError } from "../helpers/HttpError.js";
import userModel from "../models/User.js";
import path from "path";
import fs from "fs/promises";
import gravatar from "gravatar";
import Jimp from "jimp";
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

const updateAvatars = async (req, res) => {
  //переміщуємо отриманий з запиту файл з папки tmp в папку  public/avatar
  //path - це  повний шлях до файлу, включаючі його назву в папці tmp
  //filename - імя файлу (звертати увагу на регістр не кемелкейс)
  const { path: pathFileTemp, filename } = req.file;
  const {_id} = req.user;
  //створюємо абсолютний шлях до нового розташування файлу для його перенесення з папки tmp
  const result = await Jimp.read(pathFileTemp);
  result.resize(250, 250)
  .write(pathFileTemp);
  const extentFile = filename.split(".").pop();
  const newFileName = req.user.userName + "." + extentFile;
  const newPathAbsolute = path.resolve(
    "public",
    "avatars",
    newFileName
  );
   await fs.rename(pathFileTemp, newPathAbsolute);
 const newPathRelative = path.join("avatars", newFileName );
 await userModel.findByIdAndUpdate(_id, {avatarURL: newPathRelative });
  res.json({
    user: {
      avatarURL: newPathRelative,
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
  const { _id, } = user;
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
  updateAvatars: isWrapperControler(updateAvatars),
};
