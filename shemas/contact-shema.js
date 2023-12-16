import Joi from "joi";

export const addShemaContact =Joi.object({
    "name": Joi.string().required(),
          "email": Joi.string().required(),
          "phone": Joi.string().required()
  });

  export const updateShemaContact =Joi.object({
         "name": Joi.string(),
          "email": Joi.string(),
          "phone": Joi.string()
  });