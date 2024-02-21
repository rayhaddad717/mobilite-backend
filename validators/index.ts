const Joi = require("joi");
export const VALIDATORS = {
  UniversityValidatorSchema: Joi.object({
    university_name: Joi.string().required(),
  }),
  DeleteUniversitySchena: Joi.object({
    id: Joi.number().required(),
  }),
};
