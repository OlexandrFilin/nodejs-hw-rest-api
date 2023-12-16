
import { HttpError } from "../helpers/HttpError.js";
import { listContacts, getContactById,addContact,updateById, removeContact } from "../models/contacts/index.js";
import { addShemaContact,updateShemaContact } from "../shemas/contact-shema.js";



export const getAll =async (req, res, next) => {
  try {
    const list = await listContacts();
    res.json(list);
  } catch (error) {
    next(error);
   
  }
    
  }


export const getById = async (req, res, next) => {
  try {
    const {contactId} =req.params
    const contact = await getContactById(contactId);
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
    const contact = await updateById(contactId,req.body);
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
      const contact = await addContact(req.body);
   
     res.status(201).json(contact );
  } catch (error) {
     next(error); 
     }
  
};

export const remove = async (req, res, next) => {
  try {
    const {contactId} =req.params
    const contact = await removeContact(contactId);
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
