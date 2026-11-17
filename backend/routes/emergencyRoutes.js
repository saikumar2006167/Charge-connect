const express = require("express");

const router = express.Router();

const {
  requestEmergency,
  getEmergencyRequests,
  updateEmergencyStatus,
} = require("../controllers/emergencyController");

// Customer
router.post("/request", requestEmergency);

// Admin
router.get("/requests", getEmergencyRequests);

router.put(
  "/requests/:id",
  updateEmergencyStatus
);

module.exports = router;