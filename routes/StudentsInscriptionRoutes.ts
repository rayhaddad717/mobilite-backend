import express from "express";
import { VALIDATORS } from "../validators";
import { StudentsInscriptionController, student_inscriptionController } from "../controllers/StudentsInscriptionController";
import CONSTANT from "../config";
import StudentsInscription from "../models/StudentsInscriptionModel";
const { createValidator } = require("express-joi-validation");
const router = express.Router();
const validator = createValidator();

//GET
router.get("/:id", async (req, res) => {
  try {
    const result = await student_inscriptionController.getStudentsInscription({
      id: Number(req.params.id),
    });
    return res.json(
      CONSTANT.HTTP_RESPONSES.OK<StudentsInscription | null>(
        result,
        "Successfully returned university"
      )
    );
  } catch (error: any) {
    return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
  }
});
//LIST
router.get("/", async (req, res) => {
  try {
    const result = await student_inscriptionController.listStudentsInscription();
    return res.json(result);
  } catch (error: any) {
    return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
  }
});
// DELETE
router.delete(
  "/:id",
  validator.params(VALIDATORS.DeleteStudentsInscriptionSchema),
  async (req, res) => {
    try {
      const result = await student_inscriptionController.deleteStudentsInscription({
        id: Number(req.params.id),
      });
      return res.json(
        CONSTANT.HTTP_RESPONSES.OK<null>(
          null,
          "Students Inscription successfully deleted"
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
  validator.body(VALIDATORS.StudentsInscriptionValidatorSchema),
  async (req, res) => {
    try {
      const result = await student_inscriptionController.createOrEditStudentsInscription(req.body);
      res.json(result);
    } catch (error: any) {
      return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
    }
  }
);

export default router;
