const Joi = require("joi");
export const VALIDATORS = {
  UniversityValidatorSchema: Joi.object({
    university_name: Joi.string().required(),
    id: Joi.number().optional(),
    country: Joi.string().required(),
    website:Joi.string().required()
  }),
  DeleteUniversitySchema: Joi.object({
    id: Joi.number().required(),
  }),
  BourseValidatorSchema: Joi.object({
    bourse_name: Joi.string().required(),
  }),
  DeleteBourseSchema: Joi.object({
    id: Joi.number().required(),
  }),
  InscriptionValidatorSchema: Joi.object({
    Name: Joi.string().required(),
  }),
  DeleteInscriptionSchema: Joi.object({
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
