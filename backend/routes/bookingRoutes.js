const express = require("express");

const router = express.Router();

const {
  addBooking,
  getBookings,
  getHistory,
  deleteBooking,
} = require("../controllers/bookingController");

// Test Route
router.get("/test", (req, res) => {
  res.send("Booking Route Works ✅");
});

// Add Booking
router.post("/", addBooking);

router.get("/history/:email", getHistory);

// Get User Bookings
router.get("/:email", getBookings);

// Delete Booking
router.delete("/:id", deleteBooking);

module.exports = router;