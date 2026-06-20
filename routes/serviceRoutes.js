
const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

router.get("/next-id", serviceController.getNextId);
router.get("/", serviceController.getAll);
router.post("/", serviceController.create);
router.put("/:id", serviceController.update); // <-- Add update
router.delete("/:id", serviceController.remove);

module.exports = router;