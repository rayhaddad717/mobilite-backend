export interface CreateOrEditUniversityRequest {
  university_name: string;
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
