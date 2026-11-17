const express = require("express");

const router = express.Router();

const {
  getEntertainment,
  addEntertainment,
  updateEntertainment,
  deleteEntertainment,
} = require("../controllers/entertainmentController");

router.get("/", getEntertainment);

router.post("/", addEntertainment);

router.put("/:id", updateEntertainment);

router.delete("/:id", deleteEntertainment);

module.exports = router;