import express from "express";
import { VALIDATORS } from "../validators";
import CONSTANT from "../config";
import upload from "../upload";
import ExcelJS from "exceljs";
import { masterController } from "../controllers/MastersController";
import Masters from "../models/MastersModel";
const { createValidator } = require("express-joi-validation");
const router = express.Router();
const validator = createValidator();
//EXPORT TO EXCEL
router.get("/export", async (req, res) => {
  try {
    const workbook = await masterController.exportToExcel();
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
    await masterController.importFromExcel(workbook);

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
    const result = await masterController.getMasters({
      id: Number(req.params.id),
    });
    return res.json(
      CONSTANT.HTTP_RESPONSES.OK<Masters | null>(
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
    const result = await masterController.listMasters();
    return res.json(result);
  } catch (error: any) {
    return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
  }
});
// DELETE
router.delete(
  "/:id",
  validator.params(VALIDATORS.DeleteMastersSchema),
  async (req, res) => {
    try {
      const result = await masterController.deleteMasters({
        id: Number(req.params.id),
      });
      return res.json(
        CONSTANT.HTTP_RESPONSES.OK<null>(null, "Master successfully deleted")
      );
    } catch (error: any) {
      return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
    }
  }
);
//CREATE OR ADD
router.post(
  "/",
  validator.body(VALIDATORS.MastersValidatorSchema),
  async (req, res) => {
    try {
      const result = await masterController.createOrEditMasters(req.body);
      res.json(result);
    } catch (error: any) {
      return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
    }
  }
);

export default router;
