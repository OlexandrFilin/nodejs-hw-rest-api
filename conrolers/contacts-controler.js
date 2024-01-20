import path from "path";
import { isWrapperControler } from "../decorators/index.js";
import { HttpError } from "../helpers/HttpError.js";
import contactModel from "../models/Contacts.js";
// import fs from "fs/promises";


const getAll = async (req, res) => {
  const { page = 1, limit = 5, favorite } = req.query;
  const skip = (page - 1) * limit;
  const query = { owner: req.user._id };
  if (favorite) {
    query.favorite = favorite;
  }
  const list = await contactModel
    .find(query, "-createdAt", { skip, limit })
    .populate("owner", "email username");
  // const list = await contactModel.find();
  res.json(list);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactModel.findOne({
    _id: contactId,
    owner: req.user._id,
  });
  if (!contact) {
    throw HttpError(404, ` Contact with id = ${contactId} not found`);
  }
  res.json(contact);
};

const update = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  // налаштування  {new:true,runValidators:true} винесли в хук addAdjustmentsBeforeUpdate при створенні схеми mongoose

  const contact = await contactModel.findOneAndUpdate({
    _id: contactId,
    owner,
  });
  if (!contact) {
    throw HttpError(404, ` Contact with id = ${contactId} not found`);
  }
  res.status(201).json(contact);
};

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  // налаштування  {new:true,runValidators:true} винесли в хук addAdjustmentsBeforeUpdate при створенні схеми mongoose
  const contact = await contactModel.findOneAndUpdate(
    { _id: contactId, owner },
    req.body
  );
  if (!contact) {
    throw HttpError(404, ` Contact with id = ${contactId} not found`);
  }
  res.status(201).json(contact);
};

const add = async (req, res) => {
  const contact = await contactModel.create({
    ...req.body,
    //avatarURL: newPathRelative,
    owner: req.user._id,
  });
 res.status(201).json(contact);
};

const remove = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const contact = await contactModel.findOneAndDelete({
    _id: contactId,
    owner,
  });
  if (!contact) {
    throw HttpError(404, ` Contact with id = ${contactId} not found`);
  }
  res.json({
    message: "contact deleted",
  });
};

export default {
  getAll: isWrapperControler(getAll),
  getById: isWrapperControler(getById),
  update: isWrapperControler(update),
  updateFavorite: isWrapperControler(updateFavorite),
  add: isWrapperControler(add),
  remove: isWrapperControler(remove),
};
