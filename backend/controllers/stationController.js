const db = require("../firebaseAdmin");

const getStations = async (req, res) => {
  try {
    const snapshot = await db.collection("stations").get();

    const stations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(stations);
  } catch (err) {
    console.error("Error fetching stations:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stations",
    });
  }
};

module.exports = {
  getStations,
};