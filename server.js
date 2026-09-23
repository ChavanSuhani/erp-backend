const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

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

const app = express();

/* =========================
   CORS
========================= */

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* =========================
   BODY PARSER
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ERP Backend is running 🚀"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    server: "running"
  });
});

/* =========================
   ROUTES
========================= */

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

/* =========================
   404
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

/* =========================
   START SERVER
========================= */

// const PORT = process.env.PORT || 10000;

const startServer = async () => {
  try {
    console.log("Starting backend...");
    console.log("PORT:", PORT);

    await connectDB();

    console.log("Database connected. Starting HTTP server...");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend running on port ${PORT}`);
    });

  } catch (error) {
    console.error("FAILED TO START SERVER");
    console.error(error);

    process.exit(1);
  }
};

startServer();