
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  pid: String,
  name: String,
  partno: String,
  hsn: String,

  tax: String,     // "5%" / "18%"
  gst: Number,     // ✅ 5 / 18

  category: String,
  vehicleCat: String,

  purchase: Number,
  sale: Number,
  mrp: Number,

  brand: String,
  state: String
});


module.exports = mongoose.model("Product", productSchema);