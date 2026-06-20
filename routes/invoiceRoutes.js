const express = require("express");
const router = express.Router();
const { getNextInvoiceNumber } = require("../controllers/invoiceController");

router.get("/next", getNextInvoiceNumber);

module.exports = router;