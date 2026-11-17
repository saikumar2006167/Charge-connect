const db = require("../firebaseAdmin");

// Register Station Owner + Create Station
const registerStationOwner = async (ownerData) => {
  try {
    // 1. Create Station Owner
    const ownerRef = await db.collection("stationOwners").add({
      ...ownerData,

      approved: false,
      status: "Pending",

      createdAt: new Date(),
    });

    const ownerId = ownerRef.id;

    // 2. Create Station from registration data
    const stationRef = await db.collection("stations").add({
      ownerId: ownerId,

      ownerName: ownerData.ownerName || "",
      ownerEmail: ownerData.email || "",
      ownerMobile: ownerData.mobile || "",

      stationName: ownerData.stationName || "",
      stationType: ownerData.stationType || "",

      chargers: Number(ownerData.chargers || 0),
      connectorType: ownerData.connectorType || "",
      price: Number(ownerData.price || 0),

      address: ownerData.address || "",
      city: ownerData.city || "",
      district: ownerData.district || "",
      state: ownerData.state || "",
      pincode: ownerData.pincode || "",

      latitude: ownerData.latitude || "",
      longitude: ownerData.longitude || "",

      openingTime: ownerData.openingTime || "",
      closingTime: ownerData.closingTime || "",

      // Station approval
      approvalStatus: "Pending",
      available: false,

      createdAt: new Date(),
    });

    console.log("OWNER CREATED:", ownerId);
    console.log("STATION CREATED:", stationRef.id);

    return ownerId;
  } catch (error) {
    console.error("Register Owner + Station Error:", error);
    throw error;
  }
};


// Login
const loginStationOwner = async (email, password) => {
  const snapshot = await db
    .collection("stationOwners")
    .where("email", "==", email)
    .where("password", "==", password)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];

  return {
    id: doc.id,
    ...doc.data(),
  };
};


// Profile
const getOwnerProfile = async (id) => {
  const doc = await db
    .collection("stationOwners")
    .doc(id)
    .get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
};


// Update Profile
const updateOwnerProfile = async (id, data) => {
  await db
    .collection("stationOwners")
    .doc(id)
    .update(data);
};


module.exports = {
  registerStationOwner,
  loginStationOwner,
  getOwnerProfile,
  updateOwnerProfile,
};