
 import { HttpError } from "../helpers/HttpError.js";
// import { listContacts, getContactById,addContact,updateById, removeContact } from "../models/contacts/index.js";

// import contactModel from "../models/Contacts.js";
import contactModel,{ addShemaContact,updateShemaContact,updateShemaContactFavorite  } from "../models/Contacts.js";




export const getAll =async (req, res, next) => {
  try {
    const list = await contactModel.find();
    res.json(list);
  } catch (error) {
    next(error);
   
  }
    
  }


export const getById = async (req, res, next) => {
  try {
    const {contactId} =req.params;
    const contact = await contactModel.findById(contactId);

    if (!contact) {
      throw  HttpError(404,` Contact with id = ${contactId} not found`);
        }
     res.json(contact );
  } catch (error) {
     next(error); 
     }
  
};

export const update= async (req, res, next) => {
  try {
     const {error} =updateShemaContact.validate(req.body);
     const {contactId} =req.params
    if (error) {
      throw HttpError(400, error.message);
    } 
    // налаштування  {new:true,runValidators:true} вигесли в хук addAdjustmentsBeforeUpdate при створенні схеми mongoose
    const contact = await contactModel.findByIdAndUpdate(contactId,req.body);
    if (!contact) {
      throw  HttpError(404,` Contact with id = ${contactId} not found`);
        }
     res.status(201).json(contact );


  } catch (error) {
     next(error); 
     }
  
};

export const updateFavorite= async (req, res, next) => {
  try {
     const {error} =updateShemaContactFavorite.validate(req.body);
     const {contactId} =req.params
    if (error) {
      throw HttpError(400, "missing field favorite");
    } 
    // налаштування  {new:true,runValidators:true} вигесли в хук addAdjustmentsBeforeUpdate при створенні схеми mongoose
    const contact = await contactModel.findByIdAndUpdate(contactId,req.body);
    if (!contact) {
      throw  HttpError(404,` Contact with id = ${contactId} not found`);
        }
     res.status(201).json(contact );


  } catch (error) {
     next(error); 
     }
  
};


export const add = async (req, res, next) => {
  try {
    const {error} =addShemaContact.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
      const contact = await contactModel.create(req.body);
   
     res.status(201).json(contact );
  } catch (error) {
     next(error); 
     }
  
};

export const remove = async (req, res, next) => {
  try {
    const {contactId} =req.params
    const contact = await contactModel.findByIdAndDelete(contactId);
    if (!contact) {
      throw  HttpError(404,` Contact with id = ${contactId} not found`);
        }
    // res.json(contact );
     res.json({
      message:  "contact deleted"
     } );
  } catch (error) {
     next(error); 
     }
  
};
