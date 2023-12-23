import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers/HttpError.js";

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
// пишемо return  тому що next не перериває виконання функції
   return next(HttpError(404,`${contactId} not valid`));
  }
 next();
};

export default isValidId;
