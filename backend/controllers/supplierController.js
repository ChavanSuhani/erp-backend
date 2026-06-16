const Supplier = require("../models/Supplier");

exports.getAll = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNextId = async (req, res) => {
  try {
    const lastSupplier = await Supplier.findOne().sort({ id: -1 });

    let nextNum = 101;
    if (lastSupplier?.id) {
      nextNum = parseInt(lastSupplier.id.split("-")[1]) + 1;
    }

    res.json({ nextId: `SUP-${nextNum}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const lastSupplier = await Supplier.findOne().sort({ id: -1 });

    let nextNum = 101;
    if (lastSupplier?.id) {
      nextNum = parseInt(lastSupplier.id.split("-")[1]) + 1;
    }

    await Supplier.create({
      ...req.body,
      id: `SUP-${nextNum}`
    });

    res.json({ message: "Supplier saved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.update = async (req, res) => {
  try {
    await Supplier.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Supplier updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: "Supplier deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
