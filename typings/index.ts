export interface CreateOrEditUniversityRequest {
  university_name: string;
  country:string;
  website:string;
  is_free:boolean;
  convention_info:string;
  convention_date:Date;
  procedure_inscription:string;
  id?: number;
}
export interface DeleteUniversityRequest {
  id: number;
}
export interface GetUniversityRequest {
  id: number;
}
export interface CreateOrEditDepartmentRequest {
  department_name: string;
  id?: number;
}
export interface DeleteDepartmentRequest {
  id: number;
}
export interface GetDepartmentRequest {
  id: number;
}
export interface CreateBourseRequest {
  bourse_name: string;
}
export interface DeleteBourseRequest {
  id: number;
}
export interface CreateInscriptionRequest {
  Name: string;
}
export interface DeleteInscriptionRequest {
  id: number;
}
