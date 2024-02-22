const Joi = require("joi");
export const VALIDATORS = {
  UniversityValidatorSchema: Joi.object({
    university_name: Joi.string().required(),
    id: Joi.number().optional(),
  }),
  DeleteUniversitySchena: Joi.object({
    id: Joi.number().required(),
  }),
};
