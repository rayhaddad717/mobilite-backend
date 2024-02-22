import express from "express";
import { VALIDATORS } from "../validators";
import { inscriptionController } from "../controllers/InscriptionController";
import CONSTANT from "../config";
const { createValidator } = require("express-joi-validation");
const router = express.Router();
const validator = createValidator();
//LIST
router.get("/", async (req, res) => {
  try {
    const result = await inscriptionController.listInscription();
    return res.json(result);
  } catch (error: any) {
    return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
  }
});
// DELETE
router.delete(
  "/:id",
  validator.params(VALIDATORS.DeleteInscriptionSchema),
  async (req, res) => {
    try {
      const result = await inscriptionController.deleteInscription({
        id: Number(req.params.id),
      });
      return res.json(
        CONSTANT.HTTP_RESPONSES.OK<null>(
          null,
          "Inscription successfully deleted"
        )
      );
    } catch (error: any) {
      return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
    }
  }
);
//CREATE
router.post(
  "/",
  validator.body(VALIDATORS.InscriptionValidatorSchema),
  async (req, res) => {
    try {
      const result = await inscriptionController.createInscription(req.body);
      res.json(result);
    } catch (error: any) {
      return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
    }
  }
);

export default router;
