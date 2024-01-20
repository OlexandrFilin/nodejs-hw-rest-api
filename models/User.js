import mongoose from "mongoose";
import { handlerErrorSave, addAdjustmentsBeforeUpdate } from "./hooks.js";
import Joi from "joi";

const { Schema, model } = mongoose;
const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: [true, "Name user is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegExp,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
      minlehgth: 6,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: {
      type: String,
      // required: true
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },

    token: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

// хук зміни статусу помилки при запису
userSchema.post("save", handlerErrorSave);
// хук зміни налаштувань (оновлення та валідації) перед  оновленням документу
userSchema.pre("findOneAndUpdate", addAdjustmentsBeforeUpdate);
// хук зміни статусу помилки при оновленні
userSchema.post("findOneAndUpdate", handlerErrorSave);

// схеми JOI
//схема реєстрації
export const userSignupSchema = Joi.object({
  userName: Joi.string().required(),
  email: Joi.string().required().pattern(emailRegExp),
  password: Joi.string().min(6).required(),
});
//схема входу зареєстрованого користувача
export const userSigninSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegExp),
  password: Joi.string().min(6).required(),
});

const userModel = model("user", userSchema);
export default userModel;
