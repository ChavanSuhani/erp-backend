const Appointment = require("../models/Appointment");
const Service = require("../models/Service");

/* ================= CREATE APPOINTMENT ================= */
exports.createAppointment = async (req, res) => {
  try {
    const servicePayload = [];

    // Prepare service array from service IDs sent from frontend
    for (const s of req.body.services || []) {
      const serviceMaster = await Service.findById(s.serviceId);
      if (!serviceMaster) continue; // skip if service not found

      const qty = s.qty || 1;
      const rate = serviceMaster.cost;
      let gst = serviceMaster.gst;

if (!gst && serviceMaster.gstCategory) {
  gst = Number(serviceMaster.gstCategory.replace("%", ""));
}

gst = Number(gst) || 0;


      const amount = qty * rate + (qty * rate * gst) / 100;

      servicePayload.push({
        serviceId: serviceMaster._id,
        name: serviceMaster.name,
        qty,
        rate,
        gst,
        amount
      });
    }

    const appointment = new Appointment({
      customerName: req.body.customerName,
      contactNo: req.body.contactNo,
      vehicleNo: req.body.vehicleNo || "",
      state: req.body.state,
      date: req.body.date,
      timeSlot: req.body.timeSlot,
      note: req.body.note || "",
      services: servicePayload
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    console.error("Create Appointment Error:", err);
    res.status(500).json({ message: "Failed to create appointment" });
  }
};

/* ================= GET ALL APPOINTMENTS ================= */
exports.getAppointments = async (req, res) => {
  try {
    const data = await Appointment.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("Get Appointments Error:", err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

/* ================= GET APPOINTMENT BY ID ================= */
exports.getAppointmentById = async (req, res) => {
  try {
    const data = await Appointment.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Appointment not found" });
    res.json(data);
  } catch (err) {
    console.error("Get Appointment By ID Error:", err);
    res.status(500).json({ message: "Failed to fetch appointment" });
  }
};

/* ================= UPDATE APPOINTMENT ================= */
exports.updateAppointment = async (req, res) => {
  try {
    const servicePayload = [];

    for (const s of req.body.services || []) {
      const serviceMaster = await Service.findById(s.serviceId);
      if (!serviceMaster) continue;

      const qty = s.qty || 1;
      const rate = serviceMaster.cost;
      const gst = Number(serviceMaster.gst);


      const amount = qty * rate + (qty * rate * gst) / 100;

      servicePayload.push({
        serviceId: serviceMaster._id,
        name: serviceMaster.name,
        qty,
        rate,
        gst,
        amount
      });
    }

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        customerName: req.body.customerName,
        contactNo: req.body.contactNo,
        vehicleNo: req.body.vehicleNo || "",
        state: req.body.state,
        date: req.body.date,
        timeSlot: req.body.timeSlot,
        note: req.body.note || "",
        services: servicePayload
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Appointment not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update Appointment Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ================= DELETE APPOINTMENT ================= */
exports.deleteAppointment = async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Delete Appointment Error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};