//import { json } from 'express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { isWrapperControler } from "../decorators/index.js";
import { HttpError } from "../helpers/HttpError.js";
import userModel from "../models/User.js";
import { nanoid } from "nanoid";

import gravatar from "gravatar";
import dotenv from "dotenv/config";
import sendEmail from "../helpers/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;
const getDataForEmail = (adrEmail, verifCode) => {
  const markup = `<table border='0' cellpadding='0' cellspacing='0' style='margin:0; padding:0'>
<tr>
  <td>
    <center style='max-width: 600px; width: 100%;'>
    <a href="${BASE_URL}/api/users/verify/${verifCode}" target="_blank" style="">click to verify email</a>
    </center>   
  </td>
</tr>
</table>`;

  return {
    to: adrEmail,
    subject: "verification email",
    html: markup,
  };
};

const signUp = async (req, res) => {
  console.log("signUp", 1111);
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
    verificationToken: nanoid(),
  });
  const dataEmail = getDataForEmail(email, newUser.verificationToken);
  await sendEmail(dataEmail);
  res.status(201).json({
    user: {
      email: newUser.email,
      avatarURL: newUser.avatarURL,
      subscription: newUser.subscription,
    },
  });
};

const verifyCod = async (req, res) => {
  const { verificationToken } = req.params;
  const findUserByCod = await userModel.findOne({ verificationToken });
  if (!findUserByCod) {
    throw HttpError(
      401,
      "Not found user by verify code. Email not found or email alredy confirmed"
    );
  }
  await userModel.findByIdAndUpdate(findUserByCod._id, {
    verificationToken: null,
    verify: true,
  });
  res.json({ message: "Email is confirmed" });
};
const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not confirmed");
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
  //res.json({ message: 'Logout success' });
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

const resendEmail = async (req, res) => {
  const { email } = req.body;
  const userByEmail = await userModel.findOne({ email });
  if (!userByEmail) {
    throw HttpError(400, "User by email not found");
  }
  if (userByEmail.verify) {
    throw HttpError(400, "email alredy confirmed");
  }
  await sendEmail(getDataForEmail(email, userByEmail.verificationToken));
  res.json({ message: "resend email access" });
};

export default {
  signUp: isWrapperControler(signUp),
  signIn: isWrapperControler(signIn),
  getCurent: isWrapperControler(getCurent),
  logout: isWrapperControler(logout),
  cahngeSubscribtion: isWrapperControler(cahngeSubscribtion),
  verifyCod: isWrapperControler(verifyCod),
  resendEmail: isWrapperControler(resendEmail),
};
