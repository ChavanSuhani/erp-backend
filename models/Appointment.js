const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true
    },

    contactNo: {
      type: String,
      required: true
    },

    vehicleNo: String,

    state: {
      type: String,
      required: true
    },

    date: {
      type: String,
      required: true
    },

    timeSlot: {
      type: String,
      required: true
    },

    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service"
        },
        name: String,
        qty: Number,
        rate: Number,
        gst: Number,          // ✅ THIS WAS MISSING
        amount: Number
      }
    ],

    note: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);