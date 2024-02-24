import express from "express";
import { VALIDATORS } from "../validators";
import CONSTANT from "../config";
import { studentController } from "../controllers/StudentsController";
import Students from "../models/StudentsModel";
const { createValidator } = require("express-joi-validation");
const router = express.Router();
const validator = createValidator();
//EXPORT TO EXCEL
router.get("/export", async (req, res) => {
  try {
    console.log("here");
    const workbook = await studentController.exportToExcel();
    // Set the headers to prompt download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="students.xlsx"'
    );

    // Write the workbook to the response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
  } catch (error: any) {
    console.log(error);
    return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
  }
});

//GET
router.get("/:id", async (req, res) => {
  try {
    const result = await studentController.getStudents({
      id: Number(req.params.id),
    });
    return res.json(
      CONSTANT.HTTP_RESPONSES.OK<Students | null>(
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
    const result = await studentController.listStudents();
    return res.json(result);
  } catch (error: any) {
    return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
  }
});
// DELETE
router.delete(
  "/:id",
  validator.params(VALIDATORS.DeleteStudentsSchema),
  async (req, res) => {
    try {
      const result = await studentController.deleteStudents({
        id: Number(req.params.id),
      });
      return res.json(
        CONSTANT.HTTP_RESPONSES.OK<null>(null, "Student successfully deleted")
      );
    } catch (error: any) {
      return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
    }
  }
);
//CREATE OR ADD
router.post(
  "/",
  validator.body(VALIDATORS.StudentsValidatorSchema),
  async (req, res) => {
    try {
      const result = await studentController.createOrEditStudents(req.body);
      res.json(result);
    } catch (error: any) {
      return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
    }
  }
);

export default router;
