const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },

  name: String,
  address: String,
  contact: String,
  email: String,
  vehicleNo: String,
  gst: String,
  category: String,
  state: String
});

module.exports = mongoose.model("Customer", customerSchema);
