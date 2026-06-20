const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/next-id", customerController.getNextId);
router.get("/", customerController.getAll);

// ✅ ADD THIS LINE (VERY IMPORTANT)
router.get("/by-id/:id", customerController.getByCustomerId);

router.post("/", customerController.create);
router.put("/:id", customerController.update);
router.delete("/:id", customerController.remove);

module.exports = router;
