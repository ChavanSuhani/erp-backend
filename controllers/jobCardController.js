const JobCard = require("../models/JobCard");

/* CREATE */
exports.createJobCard = async (req, res) => {
  try {
    const jobCard = new JobCard(req.body);
    await jobCard.save();
    res.status(201).json(jobCard);
  } catch (err) {
    res.status(500).json({ message: "Failed to create job card" });
  }
};

/* GET ALL */
exports.getJobCards = async (req, res) => {
  try {
    const data = await JobCard.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job cards" });
  }
};

/* GET ONE */
exports.getJobCardById = async (req, res) => {
  try {
    const data = await JobCard.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job card" });
  }
};

/* 🔥 FETCH FOR BILLING */
exports.getJobCardForBilling = async (req, res) => {
  try {
    const jobCard = await JobCard.findById(req.params.id);

    if (!jobCard) {
      return res.status(404).json({ message: "Job card not found" });
    }

    if (jobCard.billingStatus === "Billed") {
      return res.status(400).json({
        message: "Job card already billed"
      });
    }

    res.json(jobCard);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch job card for billing"
    });
  }
};

/* UPDATE */
exports.updateJobCard = async (req, res) => {
  try {
    const updated = await JobCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

/* DELETE */
exports.deleteJobCard = async (req, res) => {
  try {
    await JobCard.findByIdAndDelete(req.params.id);
    res.json({ message: "Job card deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};