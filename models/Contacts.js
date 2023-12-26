import mongoose from "mongoose";
import { handlerErrorSave, addAdjustmentsBeforeUpdate } from "./hooks.js";
import Joi from "joi";

// схеми JOI
export const addShemaContact = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

export const updateShemaContact = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});
export const updateShemaContactFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

// схеми mogoose
const { Schema, model } = mongoose;
const ContactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      // required: true,
    },
    phone: {
      type: String,
      // required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);
// хук зміни статусу помилки при запису
ContactSchema.post("save", handlerErrorSave);
// хук зміни налаштувань (оновлення та валідації) перед  оновленням документу
ContactSchema.pre("findOneAndUpdate", addAdjustmentsBeforeUpdate);
// хук зміни статусу помилки при оновленні
ContactSchema.post("findOneAndUpdate", handlerErrorSave);
//
const contactModel = model("contact", ContactSchema);

export default contactModel;
