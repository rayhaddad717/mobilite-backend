import CONSTANT from "../config";
import Inscription from "../models/InscriptionModel";
import { CreateInscriptionRequest, DeleteInscriptionRequest } from "../typings";

export class InscriptionController {
  //LIST
  async listInscription() {
    try {
      return await Inscription.findAll();
    } catch (error) {
      throw error;
    }
  }
  // DELETE
  async deleteInscription(payload: DeleteInscriptionRequest) {
    try {
      return await Inscription.destroy({ where: { id: payload.id } });
    } catch (error) {}
  }
  // CREATE
  async createInscription(payload: CreateInscriptionRequest) {
    try {
      const created = await Inscription.create({
        inscription_name: payload.Name,
      });
      return CONSTANT.HTTP_RESPONSES.CREATED<Inscription>(
        created,
        "Inscription created successfully"
      );
    } catch (error) {
      throw error;
    }
  }
}
export const inscriptionController = new InscriptionController();
