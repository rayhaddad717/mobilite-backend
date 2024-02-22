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
