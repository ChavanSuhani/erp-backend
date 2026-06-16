const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  empId: String,
  name: String,
  address: String,
  contact: String,
  email: String,
  type: String,
  state: String
});

module.exports = mongoose.model("Employee", employeeSchema);
