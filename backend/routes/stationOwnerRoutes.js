const express = require("express");

const router = express.Router();

const {
  register,
  login,
  profile,
  update,
} = require("../controllers/stationOwnerController");

// Register Station Owner
router.post("/register", register);

// Login
router.post("/login", login);

// Get Profile
router.get("/profile/:id", profile);

// Update Profile
router.put("/update/:id", update);

module.exports = router;