import { HttpError } from "../helpers/HttpError.js";

const validateAccordingSchema = (schemaMongoose, msg) => {
//  console.log("schemaMongoose", msg);
  const fn = (req, res, next) => {
    const { error } = schemaMongoose.validate(req.body);
    if (error) {
      return next(HttpError(400, msg || error.message));
    }
    next();
  };

  return fn;
};
export default validateAccordingSchema;
