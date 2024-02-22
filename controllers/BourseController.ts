import CONSTANT from "../config";
import Bourse from "../models/BourseModel";
import { CreateBourseRequest, DeleteBourseRequest } from "../typings";

export class BourseController {
  //LIST
  async listBourse() {
    try {
      return await Bourse.findAll();
    } catch (error) {
      throw error;
    }
  }
  // DELETE
  async deleteBourse(payload: DeleteBourseRequest) {
    try {
      return await Bourse.destroy({ where: { id: payload.id } });
    } catch (error) {}
  }
  // CREATE
  async createBourse(payload: CreateBourseRequest) {
    try {
      const created = await Bourse.create({
        bourse_name: payload.bourse_name,
      });
      return CONSTANT.HTTP_RESPONSES.CREATED<Bourse>(
        created,
        "Bourse created successfully"
      );
    } catch (error) {
      throw error;
    }
  }
}
export const bourseController = new BourseController();
