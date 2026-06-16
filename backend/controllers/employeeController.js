const Employee = require("../models/Employee");

// GET ALL
exports.getAll = async (req, res) => {
  const employees = await Employee.find().sort({ empId: 1 });
  res.json(employees);
};

// CREATE WITH AUTO ID
exports.create = async (req, res) => {
  const lastEmployee = await Employee.findOne().sort({ empId: -1 });

  let nextNumber = 1001;
  if (lastEmployee && lastEmployee.empId) {
    nextNumber = parseInt(lastEmployee.empId.split("-")[1]) + 1;
  }

  const newEmployee = {
    ...req.body,
    empId: `EMP-${nextNumber}`
  };

  await Employee.create(newEmployee);
  res.json({ message: "Employee saved successfully" });
};

// UPDATE
exports.update = async (req, res) => {
  await Employee.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Employee updated successfully" });
};

// DELETE
exports.remove = async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Employee deleted" });
};
