const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// const router = express.Router();

// router.post("/login", (req, res) => {
//   res.json({ message: "Login API working" });
// });

// module.exports = router;

// Routes
const invoiceRoutes = require("./routes/invoiceRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const jobCardRoutes = require("./routes/jobCardRoutes");
const employeeRoutes = require("./routes/employeeRoutes");



// Load env variables
dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route (IMPORTANT)
app.get("/", (req, res) => {
  res.send("ERP Backend is running 🚀");
});

// Routes
//app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/appointments", appointmentRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/jobcards", jobCardRoutes);
app.use("/api/employees", employeeRoutes);
// Port (env-safe)
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});