const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  serviceId: String,
  service: String,
  qty: Number,
  rate: Number,
  gst: Number,
  amount: Number,
  cgstAmount: Number,
  sgstAmount: Number
});

const ProductSchema = new mongoose.Schema({
  productId: String,
  product: String,
  qty: Number,
  rate: Number,
  gst: Number,
  amount: Number,
  cgstAmount: Number,
  sgstAmount: Number
});

const TransactionSchema = new mongoose.Schema(
  {
    /* 🔗 LINK TO JOB CARD */
    jobCardId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "JobCard",
  default: null
},



    invoiceNo: String,
    invoiceDate: Date,

    customer: {
      id: String,
      name: String,
      vehicleNo: String,
      contact: String,
      state: String
    },

    services: [ServiceSchema],
    products: [ProductSchema],

    subtotal: Number,
    cgstTotal: Number,
    sgstTotal: Number,
    discount: Number,
    grandTotal: Number,

    payments: {
      cash: { type: Number, default: 0 },
      upi: { type: Number, default: 0 },
      credit: { type: Number, default: 0 }
    },

    totalPaid: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },

    paymentStatus: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);