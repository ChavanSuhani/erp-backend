
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  id: String,
  name: String,

  gstCategory: String,   // "5%" / "18%"
  gst: Number,           // 5 / 18  ✅ NEW

  cost: Number,          // was String ❌
  category: String
});


module.exports = mongoose.model("Service", serviceSchema);