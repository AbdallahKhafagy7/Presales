const express = require("express");
const router = express.Router();
const {
  addRequirement,
  getRequirement,
  deleteRequirement,
} = require("../controllers/requirementsController");

router.post("/:opportunityId", addRequirement);

router.get("/:opportunityId", getRequirement);

router.delete("/:opportunityId", deleteRequirement);

export default router;
