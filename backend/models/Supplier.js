const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  id: String,
  name: String,
  contact: String,
  email: String,
  gst: String,
  category: String,
  address: String,
  state: String
});

module.exports = mongoose.model("Supplier", supplierSchema);
