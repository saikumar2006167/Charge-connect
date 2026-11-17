const express = require("express");
const router = express.Router();

const {
  getDashboardData,
  approveStationOwner,
  addMechanic,
  updateMechanic,
  deleteMechanic,
} = require("../controllers/adminController");

// Dashboard
router.get("/dashboard", getDashboardData);

// Approve Station Owner
router.put(
  "/station-owners/:id/approve",
  approveStationOwner
);

// EV Mechanics
router.post(
  "/mechanics",
  addMechanic
);

router.put(
  "/mechanics/:id",
  updateMechanic
);

router.delete(
  "/mechanics/:id",
  deleteMechanic
);

module.exports = router;