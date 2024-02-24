import express, { Request } from "express";
import { VALIDATORS } from "../validators";
import {
  StudentsInscriptionController,
  student_inscriptionController,
} from "../controllers/StudentsInscriptionController";
import CONSTANT from "../config";
import StudentsInscription from "../models/StudentsInscriptionModel";
import upload from "../upload";
import ExcelJS from "exceljs";
const { createValidator } = require("express-joi-validation");
const router = express.Router();
const validator = createValidator();
//EXPORT TO EXCEL
router.get(
  "/export",
  async (
    req: Request<
      any,
      any,
      any,
      {
        type:
          | "inscrit"
          | "autorise-elligible"
          | "non-autorise-list-attente"
          | "admis"
          | "will-travel";
      }
    >,
    res
  ) => {
    try {
      const workbook = await student_inscriptionController.exportToExcel(
        req.query.type
      );
      // Set the headers to prompt download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="universities.xlsx"'
      );

      // Write the workbook to the response
      await workbook.xlsx.write(res);

      // End the response
      res.end();
    } catch (error: any) {
      return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
    }
  }
);
//IMPORT FROM EXCEL
router.post("/import", upload.single("file"), async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    if (!req.file) throw Error("No file selected");
    await workbook.xlsx.load(req.file.buffer);
    await student_inscriptionController.importFromExcel(workbook);

    res.json(
      CONSTANT.HTTP_RESPONSES.OK<null>(
        null,
        "Excel file processed successfully."
      )
    );
  } catch (error: any) {
    return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
  }
});
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
    const result =
      await student_inscriptionController.listStudentsInscription();
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
      const result =
        await student_inscriptionController.deleteStudentsInscription({
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
      const result =
        await student_inscriptionController.createOrEditStudentsInscription(
          req.body
        );
      res.json(result);
    } catch (error: any) {
      return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
    }
  }
);

export default router;
