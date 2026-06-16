const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");

router.get("/next-id", supplierController.getNextId);
router.get("/", supplierController.getAll);
router.post("/", supplierController.create);
router.put("/:id", supplierController.update); // <-- Add update function
router.delete("/:id", supplierController.remove);

module.exports = router;
