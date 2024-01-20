import dotenv from "dotenv/config";
import nodemailer from "nodemailer";
import { HttpError } from "./HttpError.js";
const { UKR_NET_PASSWORD, UKR_NET_FROM } = process.env;

const sendEmail = async (dataEmail) => {
  const nodemailConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
      user: UKR_NET_FROM,
      pass: UKR_NET_PASSWORD,
    },
  };
  const transport = nodemailer.createTransport(nodemailConfig);

  const email = {
    from: UKR_NET_FROM,
    ...dataEmail,
  };
  try {
    await transport.sendMail(email);
  } catch (error) {
    throw HttpError(400, error.message);
  }
};

export default sendEmail;
