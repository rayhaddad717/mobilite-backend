const Joi = require("joi");
export const VALIDATORS = {
  //university
  UniversityValidatorSchema: Joi.object({
    university_name: Joi.string().required(),
    id: Joi.number().optional(),
    country: Joi.string().required(),
    website: Joi.string().required(),
    convention_info: Joi.string().required(),
    convention_date: Joi.date().required(),
    procedure_inscription: Joi.string().required(),
    is_free: Joi.boolean().required(),
  }),
  DeleteUniversitySchema: Joi.object({
    id: Joi.number().required(),
  }),
  //scholarship
  ScholarshipValidatorSchema: Joi.object({
    id: Joi.number().optional(),
    name: Joi.string().required(),
    duration: Joi.number().required(),
    dateFrom: Joi.date().required(),
    dateTo: Joi.date().required(),
    value: Joi.number().required(),
    condition_obtention: Joi.string().required(),
  }),
  DeleteScholarshipSchema: Joi.object({
    id: Joi.number().required(),
  }),
  //Masters
  MastersValidatorSchema: Joi.object({
    id: Joi.number().optional(),
    university_id: Joi.number().required(),
    name: Joi.string().required(),
    departement_target: Joi.string().required(),
    type_diploma: Joi.string().required(),
    language_required: Joi.string().required(),
    recrutement_sur_dossier: Joi.boolean().required(),
    exemption_fees: Joi.number().required(),
    entretien_motivation: Joi.boolean().required(),
    oral_exam: Joi.boolean().required(),
    written_exam: Joi.boolean().required(),
    nb_students: Joi.number().required(),
    result_dates: Joi.date().required(),
    date_candidature_deposit: Joi.date().required(),
    id_bourse: Joi.number().required(),
  }),
  DeleteMastersSchema: Joi.object({
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
