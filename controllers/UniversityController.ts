import CONSTANT from "../config";
import University from "../models/UniversityModel";
import { CreateUniversityRequest, DeleteUniversityRequest } from "../typings";

export class UniversityController {
  //LIST
  async listUniversity() {
    try {
      return await University.findAll();
    } catch (error) {
      throw error;
    }
  }
  // DELETE
  async deleteUniversity(payload: DeleteUniversityRequest) {
    try {
      return await University.destroy({ where: { id: payload.id } });
    } catch (error) {}
  }
  // CREATE
  async createUniversity(payload: CreateUniversityRequest) {
    try {
      const created = await University.create({
        university_name: payload.university_name,
      });
      return CONSTANT.HTTP_RESPONSES.CREATED<University>(
        created,
        "University created successfully"
      );
    } catch (error) {
      throw error;
    }
  }
}
export const universityController = new UniversityController();
