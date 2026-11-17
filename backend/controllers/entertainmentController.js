const db = require("../firebaseAdmin");

// GET ALL ENTERTAINMENT
const getEntertainment = async (req, res) => {
  try {
    const snapshot = await db
      .collection("entertainment")
      .orderBy("createdAt", "desc")
      .get();

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(items);
  } catch (error) {
    console.error("Get entertainment error:", error);
    res.status(500).json({
      message: "Failed to fetch entertainment",
    });
  }
};

// ADD ENTERTAINMENT
const addEntertainment = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      duration,
      available,
      emoji,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Name and price are required",
      });
    }

    const item = {
      name,
      price: Number(price),
      category: category || "Entertainment",
      duration: duration || "30 min",
      available: available !== false,
      emoji: emoji || "🎮",
      createdAt: new Date().toISOString(),
    };

    const docRef = await db
      .collection("entertainment")
      .add(item);

    res.status(201).json({
      id: docRef.id,
      ...item,
    });
  } catch (error) {
    console.error("Add entertainment error:", error);

    res.status(500).json({
      message: "Failed to add entertainment",
    });
  }
};

// UPDATE ENTERTAINMENT
const updateEntertainment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      price,
      category,
      duration,
      available,
      emoji,
    } = req.body;

    const updatedItem = {
      name,
      price: Number(price),
      category: category || "Entertainment",
      duration: duration || "30 min",
      available: available !== false,
      emoji: emoji || "🎮",
    };

    await db
      .collection("entertainment")
      .doc(id)
      .update(updatedItem);

    res.json({
      id,
      ...updatedItem,
    });
  } catch (error) {
    console.error(
      "Update entertainment error:",
      error
    );

    res.status(500).json({
      message: "Failed to update entertainment",
    });
  }
};

// DELETE ENTERTAINMENT
const deleteEntertainment = async (req, res) => {
  try {
    const { id } = req.params;

    await db
      .collection("entertainment")
      .doc(id)
      .delete();

    res.json({
      message: "Entertainment deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete entertainment error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete entertainment",
    });
  }
};

module.exports = {
  getEntertainment,
  addEntertainment,
  updateEntertainment,
  deleteEntertainment,
};