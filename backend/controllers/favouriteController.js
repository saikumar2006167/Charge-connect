const db = require("../firebaseAdmin");

// Add Favourite
const addFavourite = async (req, res) => {
  try {
    const favourite = req.body;

    const docRef = await db.collection("favorites").add(favourite);

    res.status(201).json({
      success: true,
      id: docRef.id,
      message: "Favourite Added Successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get User Favourites
const getFavourites = async (req, res) => {
  try {
    const { email } = req.params;

    const snapshot = await db
      .collection("favorites")
      .where("userEmail", "==", email)
      .get();

    const favourites = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(favourites);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Favourite
const deleteFavourite = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("favorites").doc(id).delete();

    res.json({
      success: true,
      message: "Favourite Deleted",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  addFavourite,
  getFavourites,
  deleteFavourite,
};