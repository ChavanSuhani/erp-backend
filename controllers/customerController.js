const Customer = require("../models/Customer");

exports.getAll = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    // 🔹 Find last customer
    const lastCustomer = await Customer.findOne().sort({ id: -1 });

    let nextNumber = 1001;

    if (lastCustomer && lastCustomer.id) {
      nextNumber = parseInt(lastCustomer.id.split("-")[1]) + 1;
    }

    const newCustomer = {
      ...req.body,
      id: `CUST-${nextNumber}`
    };

    await Customer.create(newCustomer);
    res.json({ message: "Customer saved successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.update = async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Customer updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNextId = async (req, res) => {
  const last = await Customer.findOne().sort({ createdAt: -1 });

  let nextId = "CUST001";
  if (last?.id) {
    const num = parseInt(last.id.replace("CUST", "")) + 1;
    nextId = `CUST${String(num).padStart(3, "0")}`;
  }

  res.json({ nextId });
};


exports.getByCustomerId = async (req, res) => {
  try {
    const customer = await Customer.findOne({ id: req.params.id });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
