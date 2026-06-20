
const express = require("express");
const router = express.Router();
const controller = require("../controllers/transactionController");
const { verifyToken } = require("../controllers/authController");

router.post("/", verifyToken, controller.createTransaction);
router.get("/", controller.getAllTransactions);
router.get("/:id", controller.getTransactionById);
router.get("/my", verifyToken, controller.getMyTransactions);
router.put("/:id", verifyToken, controller.updateTransaction);
router.delete("/:id", verifyToken, controller.deleteTransaction);

/* 🔥 CREATE BILL FROM JOB CARD */
router.post(
  "/from-jobcard/:jobCardId",
  verifyToken,
  controller.createTransactionFromJobCard
);

module.exports = router;