import { isWrapperControler } from "../decorators/index.js";
import { HttpError } from "../helpers/HttpError.js";
// import { listContacts, getContactById,addContact,updateById, removeContact } from "../models/contacts/index.js";

// import contactModel from "../models/Contacts.js";
import contactModel from "../models/Contacts.js";
//import contactModel,{ addShemaContact,updateShemaContact,updateShemaContactFavorite  } from "../models/Contacts.js";

const getAll = async (req, res) => {
  const list = await contactModel.find();
  res.json(list);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactModel.findById(contactId);
  if (!contact) {
    throw HttpError(404, ` Contact with id = ${contactId} not found`);
  }
  res.json(contact);
};

const update = async (req, res) => {
  //  const {error} =updateShemaContact.validate(req.body);
  // if (error) {
  //   throw HttpError(400, error.message);
  // }
  const { contactId } = req.params;
  // налаштування  {new:true,runValidators:true} вигесли в хук addAdjustmentsBeforeUpdate при створенні схеми mongoose
  const contact = await contactModel.findByIdAndUpdate(contactId, req.body);
  if (!contact) {
    throw HttpError(404, ` Contact with id = ${contactId} not found`);
  }
  res.status(201).json(contact);
};

const updateFavorite = async (req, res) => {
  //  const {error} =updateShemaContactFavorite.validate(req.body);
  // if (error) {
  //   throw HttpError(400, "missing field favorite");
  // }
  const { contactId } = req.params;
  // налаштування  {new:true,runValidators:true} вигесли в хук addAdjustmentsBeforeUpdate при створенні схеми mongoose
  const contact = await contactModel.findByIdAndUpdate(contactId, req.body);
  if (!contact) {
    throw HttpError(404, ` Contact with id = ${contactId} not found`);
  }
  res.status(201).json(contact);
};

const add = async (req, res) => {
  // const {error} =addShemaContact.validate(req.body);
  // if (error) {
  //   throw HttpError(400, error.message);
  // }
  const contact = await contactModel.create(req.body);
  res.status(201).json(contact);
};

const remove = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactModel.findByIdAndDelete(contactId);
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
