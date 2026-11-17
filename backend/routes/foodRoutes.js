const express = require("express");

const router = express.Router();

const {
  getFoods,
  addFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

// Get all food
router.get("/", getFoods);

// Add food
router.post("/", addFood);

// Update food
router.put("/:id", updateFood);

// Delete food
router.delete("/:id", deleteFood);

module.exports = router;