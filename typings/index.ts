//University

export interface CreateOrEditUniversityRequest {
  university_name: string;
  country: string;
  website: string;
  is_free: boolean;
  convention_info: string;
  convention_date: Date;
  procedure_inscription: string;
  id?: number;
}
export interface DeleteUniversityRequest {
  id: number;
}
export interface GetUniversityRequest {
  id: number;
}

//Scholarship
export interface CreateOrEdiScholarshipRequest {
  id?: number;
  name: string;
  duration: number;
  dateFrom: Date;
  dateTo: Date;
  value: number;
  condition_obtention: string;
}
export interface DeleteScholarshipRequest {
  id: number;
}
export interface GetScholarshipRequest {
  id: number;
}
//Masters
export interface CreateOrEditMastersRequest {
  id?: number;
  university_id: number;
  name: string;
  departement_target: string;
  type_diploma: string;
  language_required: string;
  recrutement_sur_dossier: boolean;
  exemption_fees: number;
  entretien_motivation: Date;
  oral_exam: Date;
  date_d_appel: Date;
  written_exam: Date;
  nb_students: number;
  result_dates: Date;
  date_candidature_deposit: Date;
  id_bourse: number | null;
}
export interface DeleteMastersRequest {
  id: number;
}
export interface GetMastersRequest {
  id: number;
}
//Masters
export interface CreateOrEditStudentsRequest {
  id?: number;
  name: string;
  notes: { [x: string]: number }[];
  nbr_dossier: number;
  family_name: string;
  phone: number;
  email: string;
  departement: string;
  annee: number;
  branch: number;
  average: number;
  eligible: boolean;
  expected_grad_date: Date;
  comment: string;
}
export interface DeleteStudentsRequest {
  id: number;
}
export interface GetStudentsRequest {
  id: number;
}
//StudentsInscription
export interface CreateOrEditStudentsInscriptionRequest {
  id: number;
  name: string;
  family: string;
  nbr_dossier: number;
  type_diploma: string;
  phone: number;
  email: string;
  departement: string;
  year: number;
  branch: number;
  average: number;
  grades: number;
  eligible: boolean;
  expected_grad_date: Date;
  id_university: number;
  comment: string;
}
export interface DeleteStudentsInscriptionRequest {
  id: number;
}
export interface GetStudentsInscriptionRequest {
  id: number;
}
