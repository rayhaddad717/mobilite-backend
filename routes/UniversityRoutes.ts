import express from "express";
import { VALIDATORS } from "../validators";
import { universityController } from "../controllers/UniversityController";
import CONSTANT from "../config";
const { createValidator } = require("express-joi-validation");
const router = express.Router();
const validator = createValidator();
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
//CREATE
router.post(
  "/",
  validator.body(VALIDATORS.UniversityValidatorSchema),
  async (req, res) => {
    try {
      const result = await universityController.createUniversity(req.body);
      res.json(result);
    } catch (error: any) {
      return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
    }
  }
);

export default router;
