import express from "express";
const router = express.Router();

import {
  getTechnologies,
  addTechnology,
  updateTechnology,
  deleteTechnology,
} from "./technology-catalog.controller.js";

import {
  addTechnologyValidation,
  updateTechnologyValidation,
  deleteTechnologyValidation,
} from "./technology-catalog.validation.js";

import { validate } from "../../utils/middleware/zod.validation.js";

router.get("/", getTechnologies);
router.post("/", validate(addTechnologyValidation), addTechnology);
router.put(
  "/:technologyId",
  validate(updateTechnologyValidation),
  updateTechnology,
);
router.delete(
  "/:technologyId",
  validate(deleteTechnologyValidation),
  deleteTechnology,
);

export default router;
