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
  entretien_motivation: boolean;
  oral_exam: boolean;
  written_exam: boolean;
  nb_students: number;
  result_dates: Date;
  date_candidature_deposit: Date;
  id_bourse: number;
}
export interface DeleteMastersRequest {
  id: number;
}
export interface GetMastersRequest {
  id: number;
}

export interface CreateInscriptionRequest {
  Name: string;
}
export interface DeleteInscriptionRequest {
  id: number;
}
