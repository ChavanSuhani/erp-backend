const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentController");

router.post("/", controller.createAppointment);
router.get("/", controller.getAppointments);
router.get("/:id", controller.getAppointmentById);
router.put("/:id", controller.updateAppointment);
router.delete("/:id", controller.deleteAppointment);

module.exports = router;