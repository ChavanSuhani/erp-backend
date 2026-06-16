
const Product = require("../models/Product");

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const products = await Product.find().sort({ pid: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE WITH AUTO ID
exports.create = async (req, res) => {
  try {
    // 🔥 FIND LAST PRODUCT
    const lastProduct = await Product.findOne().sort({ pid: -1 });

    let nextNumber = 1001;
    if (lastProduct && lastProduct.pid) {
      nextNumber = parseInt(lastProduct.pid.split("-")[1]) + 1;
    }

    const gstValue = req.body.tax
  ? Number(req.body.tax.replace("%", ""))
  : 0;

const newProduct = {
  ...req.body,
  gst: gstValue,                   // ✅ numeric GST
  purchase: Number(req.body.purchase),
  sale: Number(req.body.sale),
  mrp: Number(req.body.mrp),
  pid: `PRD-${nextNumber}`
};


    await Product.create(newProduct);
    res.json({ message: "Product saved successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const gstValue = req.body.tax
  ? Number(req.body.tax.replace("%", ""))
  : 0;

await Product.findByIdAndUpdate(req.params.id, {
  ...req.body,
  gst: gstValue,
  purchase: Number(req.body.purchase),
  sale: Number(req.body.sale),
  mrp: Number(req.body.mrp)
});

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};