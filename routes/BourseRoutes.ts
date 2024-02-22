import express from "express";
import { VALIDATORS } from "../validators";
import { bourseController } from "../controllers/BourseController";
import CONSTANT from "../config";
const { createValidator } = require("express-joi-validation");
const router = express.Router();
const validator = createValidator();
//LIST
router.get("/", async (req, res) => {
  try {
    const result = await bourseController.listBourse();
    return res.json(result);
  } catch (error: any) {
    return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
  }
});
// DELETE
router.delete(
  "/:id",
  validator.params(VALIDATORS.DeleteBourseSchema),
  async (req, res) => {
    try {
      const result = await bourseController.deleteBourse({
        id: Number(req.params.id),
      });
      return res.json(
        CONSTANT.HTTP_RESPONSES.OK<null>(
          null,
          "Bourse successfully deleted"
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
  validator.body(VALIDATORS.BourseValidatorSchema),
  async (req, res) => {
    try {
      const result = await bourseController.createBourse(req.body);
      res.json(result);
    } catch (error: any) {
      return res.json(CONSTANT.HTTP_RESPONSES.ERROR(error.toString()));
    }
  }
);

export default router;
