const InvoiceCounter = require("../models/InvoiceCounter");

exports.getNextInvoiceNumber = async (req, res) => {
  try {
    const year = new Date().getFullYear();

    let counter = await InvoiceCounter.findOne({ year });

    if (!counter) {
      counter = new InvoiceCounter({
        year,
        lastNumber: 1
      });
    } else {
      counter.lastNumber += 1;
    }

    await counter.save();

    const invoiceNo = `INV-${year}-${String(counter.lastNumber).padStart(4, "0")}`;

    res.status(200).json({ invoiceNo });
  } catch (error) {
    console.error("Invoice generation error:", error);
    res.status(500).json({ message: "Failed to generate invoice number" });
  }
};