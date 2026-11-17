const db = require("../firebaseAdmin");

// ===============================
// GET ALL FOOD
// ===============================
const getFoods = async (req, res) => {
  try {
    const snapshot = await db
      .collection("foods")
      .orderBy("createdAt", "desc")
      .get();

    const foods = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(foods);
  } catch (err) {
    console.error("Get foods error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// ADD FOOD
// ===============================
const addFood = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      preparationTime,
      available,
      emoji,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Food name and price are required",
      });
    }

    const food = {
      name,
      price: Number(price),
      category: category || "Food",
      preparationTime: preparationTime || "10-15 min",
      available: available !== false,
      emoji: emoji || "🍴",
      createdAt: new Date().toISOString(),
    };

    const docRef = await db
      .collection("foods")
      .add(food);

    res.status(201).json({
      success: true,
      id: docRef.id,
      food: {
        id: docRef.id,
        ...food,
      },
      message: "Food added successfully",
    });
  } catch (err) {
    console.error("Add food error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// UPDATE FOOD
// ===============================
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      price,
      category,
      preparationTime,
      available,
      emoji,
    } = req.body;

    const foodRef = db.collection("foods").doc(id);

    const foodDoc = await foodRef.get();

    if (!foodDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    await foodRef.update({
      name,
      price: Number(price),
      category,
      preparationTime,
      available,
      emoji,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Food updated successfully",
    });
  } catch (err) {
    console.error("Update food error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// DELETE FOOD
// ===============================
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    const foodRef = db.collection("foods").doc(id);

    const foodDoc = await foodRef.get();

    if (!foodDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    await foodRef.delete();

    res.json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (err) {
    console.error("Delete food error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getFoods,
  addFood,
  updateFood,
  deleteFood,
};