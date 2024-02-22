import express from "express";
import { VALIDATORS } from "../validators";
import { universityController } from "../controllers/UniversityController";
import CONSTANT from "../config";
import University from "../models/UniversityModel";
import upload from "../upload";
import ExcelJS from "exceljs";
const { createValidator } = require("express-joi-validation");
const router = express.Router();
const validator = createValidator();
//EXPORT TO EXCEL
router.get("/export", async (req, res) => {
  try {
    const workbook = await universityController.exportToExcel();
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
});
//IMPORT FROM EXCEL
router.post("/import", upload.single("file"), async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    if (!req.file) throw Error("No file selected");
    await workbook.xlsx.load(req.file.buffer);
    await universityController.importFromExcel(workbook);

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
    const result = await universityController.getUniversity({
      id: Number(req.params.id),
    });
    return res.json(
      CONSTANT.HTTP_RESPONSES.OK<University | null>(
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
    const result = await universityController.listUniversity();
    return res.json(result);
  } catch (error: any) {
    return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
  }
});
// DELETE
router.delete(
  "/:id",
  validator.params(VALIDATORS.DeleteUniversitySchena),
  async (req, res) => {
    try {
      const result = await universityController.deleteUniversity({
        id: Number(req.params.id),
      });
      return res.json(
        CONSTANT.HTTP_RESPONSES.OK<null>(
          null,
          "University successfully deleted"
        )
      );
    } catch (error: any) {
      return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
    }
  }
);
//CREATE OR ADD
router.post(
  "/",
  validator.body(VALIDATORS.UniversityValidatorSchema),
  async (req, res) => {
    try {
      const result = await universityController.createOrEditUniversity(
        req.body
      );
      res.json(result);
    } catch (error: any) {
      return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
    }
  }
);

export default router;
