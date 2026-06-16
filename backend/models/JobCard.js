const mongoose = require("mongoose");

const JobCardSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment"
    },

    customerName: String,
    contactNo: String,
    vehicleNo: String,
    vehicleModel: String,
    state: String,

    servicesUsed: [
      {
        serviceId: mongoose.Schema.Types.ObjectId,
        name: String,
        qty: Number,
        rate: Number,
        gst: Number,
        amount: Number
      }
    ],

    productsUsed: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        name: String,
        qty: Number,
        rate: Number,
        gst: Number,
        amount: Number
      }
    ],

    assignedEmployee: String,
    inspectionNote: String,
    checkingReport: String,
    fuelLevel: String,
    kmReading: String,

    jobStatus: {
      type: String,
      default: "Checked-In"
    },

    billingStatus: {
      type: String,
      default: "Not Billed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobCard", JobCardSchema);