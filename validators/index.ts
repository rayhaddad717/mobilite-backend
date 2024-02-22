const Joi = require("joi");
export const VALIDATORS = {
  UniversityValidatorSchema: Joi.object({
    university_name: Joi.string().required(),
    id: Joi.number().optional(),
  }),
  DeleteUniversitySchena: Joi.object({
    id: Joi.number().required(),
  }),
  DepartmentValidatorSchema: Joi.object({
    department_name: Joi.string().required(),
    id: Joi.number().optional(),
  }),
  DeleteDepartmentSchema: Joi.object({
    id: Joi.number().required(),
  }),
};
