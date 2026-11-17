const express = require("express");

const router = express.Router();

const {
  addVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

console.log("vehicleRoutes Loaded ✅");

// Test Route
router.get("/test", (req, res) => {
  res.send("Vehicle Route Working ✅");
});

// Get User Vehicles
router.get("/:uid", getVehicles);

// Add Vehicle
router.post("/", addVehicle);

// Update Vehicle
router.put("/:id", updateVehicle);

// Delete Vehicle
router.delete("/:id", deleteVehicle);

module.exports = router;