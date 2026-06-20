
const express = require("express");
const router = express.Router();
const controller = require("../controllers/jobCardController");

router.post("/", controller.createJobCard);
router.get("/", controller.getJobCards);
router.get("/:id", controller.getJobCardById);

/* 🔥 FETCH JOB CARD FOR BILLING */
router.get("/:id/billing", controller.getJobCardForBilling);

router.put("/:id", controller.updateJobCard);
router.delete("/:id", controller.deleteJobCard);

module.exports = router;