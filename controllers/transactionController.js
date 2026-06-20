const Transaction = require("../models/Transaction");
const InvoiceCounter = require("../models/InvoiceCounter");
const JobCard = require("../models/JobCard");

/* NORMAL BILL */
exports.createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({
      invoiceNo: req.body.invoiceNo,
      invoiceDate: req.body.invoiceDate,

      customer: {
        name: req.body.customer.customerName,
        vehicleNo: req.body.customer.vehicleNo,
        contact: req.body.customer.contactNo,
        state: req.body.customer.state
      },

      services: (req.body.services || []).map(s => ({
        service: s.name,
        qty: s.qty,
        rate: s.rate,
        gst: s.gst,
        amount: s.amount,
        cgstAmount: (s.amount * s.gst) / 200,
        sgstAmount: (s.amount * s.gst) / 200
      })),

      products: (req.body.products || []).map(p => ({
        product: p.name,
        qty: p.qty,
        rate: p.rate,
        gst: p.gst,
        amount: p.amount,
        cgstAmount: (p.amount * p.gst) / 200,
        sgstAmount: (p.amount * p.gst) / 200
      })),

      subtotal: req.body.subTotal || req.body.subtotal,
      cgstTotal: req.body.gstTotal / 2,
      sgstTotal: req.body.gstTotal / 2,
      discount: req.body.discount,
      grandTotal: req.body.grandTotal,

      payments: req.body.payment || req.body.payments,
      totalPaid: req.body.totalPaid,
      balanceAmount: req.body.balance,
      paymentStatus: req.body.balance > 0 ? "Pending" : "Paid",

      createdBy: req.user.id
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
  console.error("TRANSACTION ERROR 👉", err);
  res.status(500).json({ 
    message: err.message || "Transaction failed" 
  });
}

};


/*  BILL FROM JOB CARD */
exports.createTransactionFromJobCard = async (req, res) => {
  try {
    const jobCard = await JobCard.findById(req.params.jobCardId);

    if (!jobCard) {
      return res.status(404).json({ message: "Job card not found" });
    }

    if (jobCard.billingStatus === "Billed") {
      return res.status(400).json({ message: "Already billed" });
    }

    const services = (jobCard.servicesUsed || []).map(s => ({
  serviceId: s.serviceId || "",
  service: s.serviceName || s.service || s.name || "",
  qty: s.qty || 1,
  rate: s.rate || s.cost || 0,
  gst: s.gst || 0,
  amount: (s.qty || 1) * (s.rate || s.cost || 0),
  cgstAmount: ((s.qty || 1) * (s.rate || s.cost || 0) * ((s.gst || 0) / 2)) / 100,
  sgstAmount: ((s.qty || 1) * (s.rate || s.cost || 0) * ((s.gst || 0) / 2)) / 100
}));


    const products = (jobCard.productsUsed || []).map(p => ({
  productId: p.productId || "",
  product: p.productName || p.product || p.name || "",
  qty: p.qty || 1,
  rate: p.rate || p.sale || 0,
  gst: p.gst || 0,
  amount: (p.qty || 1) * (p.rate || p.sale || 0),
  cgstAmount: ((p.qty || 1) * (p.rate || p.sale || 0) * ((p.gst || 0) / 2)) / 100,
  sgstAmount: ((p.qty || 1) * (p.rate || p.sale || 0) * ((p.gst || 0) / 2)) / 100
}));


    const subtotal =
  services.reduce((a, s) => a + s.amount, 0) +
  products.reduce((a, p) => a + p.amount, 0);

const cgstTotal =
  services.reduce((a, s) => a + s.cgstAmount, 0) +
  products.reduce((a, p) => a + p.cgstAmount, 0);

const sgstTotal =
  services.reduce((a, s) => a + s.sgstAmount, 0) +
  products.reduce((a, p) => a + p.sgstAmount, 0);

const discount = Number(req.body.discount ?? 0);

const grandTotal = subtotal + cgstTotal + sgstTotal - discount;

const totalPaid =
  Number(req.body.payments?.cash || 0) +
  Number(req.body.payments?.upi || 0) +
  Number(req.body.payments?.credit || 0);

const balanceAmount = grandTotal - totalPaid;

    const transaction = new Transaction({
  invoiceNo: req.body.invoiceNo,
  invoiceDate: new Date(),
  jobCardId: jobCard._id,

  customer: {
    id: jobCard.customerId || "",
    name: jobCard.customerName,
    vehicleNo: jobCard.vehicleNo,
    contact: jobCard.contactNo,
    state: jobCard.state || ""
  },

  services,
  products,

  subtotal,
  cgstTotal,
  sgstTotal,
  discount,
  grandTotal,

  payments: req.body.payments || { cash: 0, upi: 0, credit: 0 },
  totalPaid: totalPaid,
balanceAmount: balanceAmount,
paymentStatus: balanceAmount > 0 ? "Pending" : "Paid",


  createdBy: req.user.id
});


    await transaction.save();

    jobCard.billingStatus = "Billed";
    jobCard.transactionId = transaction._id;
    await jobCard.save();

    await InvoiceCounter.findOneAndUpdate(
      { name: "invoice" },
      { $inc: { seq: 1 } }
    );

    res.status(201).json(transaction);
  } catch (err) {
  console.error("TRANSACTION ERROR 👉", err);
  res.status(500).json({ 
    message: err.message || "Billing failed" 
  });
}

};


/* REST (UNCHANGED) */
exports.getAllTransactions = async (req, res) => {
  const data = await Transaction.find().sort({ createdAt: -1 });
  res.json(data);
};

exports.getTransactionById = async (req, res) => {
  const bill = await Transaction.findById(req.params.id);
  res.json(bill);
};

exports.getMyTransactions = async (req, res) => {
  const bills = await Transaction.find({ createdBy: req.user.id });
  res.json(bills);
};

exports.updateTransaction = async (req, res) => {
  const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteTransaction = async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
