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
    entretien_motivation: Joi.date().required().allow(null),
    oral_exam: Joi.date().required().allow(null),
    date_d_appel: Joi.date().required().allow(null),
    written_exam: Joi.date().required().allow(null),
    nb_students: Joi.number().required(),
    result_dates: Joi.date().required(),
    date_candidature_deposit: Joi.date().required(),
    id_bourse: Joi.number().required(),
  }),
  DeleteMastersSchema: Joi.object({
    id: Joi.number().required(),
  }),
  //Students
  StudentsValidatorSchema: Joi.object({
    id: Joi.number().optional(),
    name: Joi.string().required(),
    notes: Joi.array()
      .items(Joi.object().pattern(/.*/, Joi.number()))
      .required(),
    nbr_dossier: Joi.number().required(),
    family_name: Joi.string().required(),
    phone: Joi.number().required(),
    email: Joi.string().email().required(),
    departement: Joi.string().required(),
    annee: Joi.number().required(),
    branch: Joi.number().required(),
    average: Joi.number().required(),
    eligible: Joi.boolean().required(),
    expected_grad_date: Joi.date().required(),
    comment: Joi.string().required(),
  }),
  DeleteStudentsSchema: Joi.object({
    id: Joi.number().required(),
  }),
  //inscription
  StudentsInscriptionValidatorSchema: Joi.object({
    id: Joi.number().optional(),
    student_id: Joi.number().required(),
    master_id: Joi.number().required(),
    university_id: Joi.number().required(),
    is_admitted: Joi.boolean().required(),
    is_confirmed: Joi.boolean().required(),
    has_scholarship: Joi.boolean().required(),
    motivation_letter_file: Joi.string().allow(null, "").optional(), //base 64 pdf
    recommendation_letter_file: Joi.string().allow(null, "").optional(), //base 64 pdf
    cv_file: Joi.string().allow(null, "").optional(), //base 64 pdf
    admission_letter_file: Joi.string().allow(null, "").optional(), //base 64 pdf
    nomination_letter_file: Joi.string().allow(null, "").optional(), //base 64 pdf
  }),
  DeleteStudentsInscriptionSchema: Joi.object({
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
