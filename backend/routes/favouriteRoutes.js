const express = require("express");

const router = express.Router();

const {
  addFavourite,
  getFavourites,
  deleteFavourite,
} = require("../controllers/favouriteController");

router.post("/", addFavourite);

router.get("/:email", getFavourites);

router.delete("/:id", deleteFavourite);

module.exports = router;