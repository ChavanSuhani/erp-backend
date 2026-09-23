const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const InvoiceCounter = require("../models/InvoiceCounter");
const JobCard = require("../models/JobCard");

/* =========================================================
   CREATE NORMAL BILL
========================================================= */
exports.createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({
      invoiceNo: req.body.invoiceNo,
      invoiceDate: req.body.invoiceDate,

      customer: {
        name: req.body.customer?.customerName || "",
        vehicleNo: req.body.customer?.vehicleNo || "",
        contact: req.body.customer?.contactNo || "",
        state: req.body.customer?.state || ""
      },

      services: (req.body.services || []).map((s) => ({
        service: s.name,
        qty: s.qty,
        rate: s.rate,
        gst: s.gst,
        amount: s.amount,
        cgstAmount: (s.amount * s.gst) / 200,
        sgstAmount: (s.amount * s.gst) / 200
      })),

      products: (req.body.products || []).map((p) => ({
        product: p.name,
        qty: p.qty,
        rate: p.rate,
        gst: p.gst,
        amount: p.amount,
        cgstAmount: (p.amount * p.gst) / 200,
        sgstAmount: (p.amount * p.gst) / 200
      })),

      subtotal: req.body.subTotal || req.body.subtotal,

      cgstTotal: Number(req.body.gstTotal || 0) / 2,
      sgstTotal: Number(req.body.gstTotal || 0) / 2,

      discount: Number(req.body.discount || 0),
      grandTotal: Number(req.body.grandTotal || 0),

      payments: req.body.payment || req.body.payments,

      totalPaid: Number(req.body.totalPaid || 0),

      balanceAmount: Number(req.body.balance || 0),

      paymentStatus:
        Number(req.body.balance || 0) > 0 ? "Pending" : "Paid",

      createdBy: req.user.id
    });

    await transaction.save();

    res.status(201).json(transaction);
  } catch (err) {
    console.error("TRANSACTION ERROR:", err);

    res.status(500).json({
      message: err.message || "Transaction failed"
    });
  }
};


/* =========================================================
   CREATE BILL FROM JOB CARD
========================================================= */
exports.createTransactionFromJobCard = async (req, res) => {
  try {
    const { jobCardId } = req.params;

    // Validate Job Card ID
    if (!mongoose.Types.ObjectId.isValid(jobCardId)) {
      return res.status(400).json({
        message: "Invalid job card ID"
      });
    }

    const jobCard = await JobCard.findById(jobCardId);

    if (!jobCard) {
      return res.status(404).json({
        message: "Job card not found"
      });
    }

    if (jobCard.billingStatus === "Billed") {
      return res.status(400).json({
        message: "Already billed"
      });
    }


    /* -------------------------
       SERVICES
    ------------------------- */

    const services = (jobCard.servicesUsed || []).map((s) => {
      const qty = Number(s.qty || 1);
      const rate = Number(s.rate || s.cost || 0);
      const gst = Number(s.gst || 0);

      const amount = qty * rate;

      return {
        serviceId: s.serviceId || "",
        service: s.serviceName || s.service || s.name || "",
        qty,
        rate,
        gst,
        amount,

        cgstAmount: (amount * (gst / 2)) / 100,
        sgstAmount: (amount * (gst / 2)) / 100
      };
    });


    /* -------------------------
       PRODUCTS
    ------------------------- */

    const products = (jobCard.productsUsed || []).map((p) => {
      const qty = Number(p.qty || 1);
      const rate = Number(p.rate || p.sale || 0);
      const gst = Number(p.gst || 0);

      const amount = qty * rate;

      return {
        productId: p.productId || "",
        product: p.productName || p.product || p.name || "",
        qty,
        rate,
        gst,
        amount,

        cgstAmount: (amount * (gst / 2)) / 100,
        sgstAmount: (amount * (gst / 2)) / 100
      };
    });


    /* -------------------------
       TOTALS
    ------------------------- */

    const subtotal =
      services.reduce((total, s) => total + s.amount, 0) +
      products.reduce((total, p) => total + p.amount, 0);

    const cgstTotal =
      services.reduce((total, s) => total + s.cgstAmount, 0) +
      products.reduce((total, p) => total + p.cgstAmount, 0);

    const sgstTotal =
      services.reduce((total, s) => total + s.sgstAmount, 0) +
      products.reduce((total, p) => total + p.sgstAmount, 0);

    const discount = Number(req.body.discount || 0);

    const grandTotal =
      subtotal +
      cgstTotal +
      sgstTotal -
      discount;


    /* -------------------------
       PAYMENTS
    ------------------------- */

    const payments = req.body.payments || {
      cash: 0,
      upi: 0,
      credit: 0
    };

    const totalPaid =
      Number(payments.cash || 0) +
      Number(payments.upi || 0) +
      Number(payments.credit || 0);

    const balanceAmount = grandTotal - totalPaid;


    /* -------------------------
       CREATE TRANSACTION
    ------------------------- */

    const transaction = new Transaction({
      invoiceNo: req.body.invoiceNo,

      invoiceDate: new Date(),

      jobCardId: jobCard._id,

      customer: {
        id: jobCard.customerId || "",
        name: jobCard.customerName || "",
        vehicleNo: jobCard.vehicleNo || "",
        contact: jobCard.contactNo || "",
        state: jobCard.state || ""
      },

      services,
      products,

      subtotal,
      cgstTotal,
      sgstTotal,

      discount,
      grandTotal,

      payments,

      totalPaid,
      balanceAmount,

      paymentStatus:
        balanceAmount > 0 ? "Pending" : "Paid",

      createdBy: req.user.id
    });


    await transaction.save();


    /* -------------------------
       UPDATE JOB CARD
    ------------------------- */

    jobCard.billingStatus = "Billed";
    jobCard.transactionId = transaction._id;

    await jobCard.save();


    /* -------------------------
       UPDATE INVOICE COUNTER
    ------------------------- */

    await InvoiceCounter.findOneAndUpdate(
      { name: "invoice" },
      { $inc: { seq: 1 } },
      { upsert: true }
    );


    res.status(201).json(transaction);

  } catch (err) {
    console.error("TRANSACTION ERROR:", err);

    res.status(500).json({
      message: err.message || "Billing failed"
    });
  }
};


/* =========================================================
   GET ALL TRANSACTIONS
========================================================= */
exports.getAllTransactions = async (req, res) => {
  try {
    const data = await Transaction
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json(data);

  } catch (err) {
    console.error("GET ALL TRANSACTIONS ERROR:", err);

    res.status(500).json({
      message: "Failed to fetch transactions"
    });
  }
};


/* =========================================================
   GET TRANSACTION BY ID
========================================================= */
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;


    // IMPORTANT:
    // Prevent "Cast to ObjectId failed" errors
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid transaction ID"
      });
    }


    const bill = await Transaction.findById(id);


    if (!bill) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }


    res.status(200).json(bill);

  } catch (err) {
    console.error("GET TRANSACTION ERROR:", err);

    res.status(500).json({
      message: "Failed to fetch transaction"
    });
  }
};


/* =========================================================
   GET MY TRANSACTIONS
========================================================= */
exports.getMyTransactions = async (req, res) => {
  try {
    const bills = await Transaction
      .find({
        createdBy: req.user.id
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bills);

  } catch (err) {
    console.error("GET MY TRANSACTIONS ERROR:", err);

    res.status(500).json({
      message: "Failed to fetch your transactions"
    });
  }
};


/* =========================================================
   UPDATE TRANSACTION
========================================================= */
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid transaction ID"
      });
    }


    const updated = await Transaction.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );


    if (!updated) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }


    res.status(200).json(updated);

  } catch (err) {
    console.error("UPDATE TRANSACTION ERROR:", err);

    res.status(500).json({
      message: "Failed to update transaction"
    });
  }
};


/* =========================================================
   DELETE TRANSACTION
========================================================= */
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid transaction ID"
      });
    }


    const deleted = await Transaction.findByIdAndDelete(id);


    if (!deleted) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }


    res.status(200).json({
      message: "Transaction deleted successfully"
    });

  } catch (err) {
    console.error("DELETE TRANSACTION ERROR:", err);

    res.status(500).json({
      message: "Failed to delete transaction"
    });
  }
};