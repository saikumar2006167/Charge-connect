const db = require("../firebaseAdmin");

// GET /mechanics
const getMechanics = async (req, res) => {
  try {
    const snapshot = await db.collection("mechanics").get();

    const mechanics = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(mechanics);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Unable to fetch mechanics",
    });
  }
};

module.exports = {
  getMechanics,
};