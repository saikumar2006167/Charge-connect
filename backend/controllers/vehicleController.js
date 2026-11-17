const db = require("../firebaseAdmin");

// ================================
// Add Vehicle
// ================================
const addVehicle = async (req, res) => {
  try {
    const vehicle = {
      ...req.body,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("vehicles").add(vehicle);

    res.status(201).json({
      success: true,
      id: docRef.id,
      message: "Vehicle Added Successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================================
// Get User Vehicles
// ================================
const getVehicles = async (req, res) => {
  try {
    const { uid } = req.params;

    const snapshot = await db
      .collection("vehicles")
      .where("uid", "==", uid)
      .get();

    const vehicles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(vehicles);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================================
// Update Vehicle
// ================================
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("vehicles").doc(id).update(req.body);

    res.json({
      success: true,
      message: "Vehicle Updated Successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================================
// Delete Vehicle
// ================================
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("vehicles").doc(id).delete();

    res.json({
      success: true,
      message: "Vehicle Deleted Successfully",
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
  addVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
};