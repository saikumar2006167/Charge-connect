const db = require("../firebaseAdmin");

// ===============================
// GET ADMIN DASHBOARD DATA
// ===============================

const getDashboardData = async (req, res) => {
  try {
    const stationsSnapshot = await db.collection("stations").get();
    const bookingsSnapshot = await db.collection("bookings").get();
    const ownersSnapshot = await db.collection("stationOwners").get();
    const usersSnapshot = await db.collection("users").get();
    const mechanicsSnapshot = await db
    
  .collection("mechanics")
  .get();
    const foodSnapshot = await db.collection("foods").get();
    const entertainmentSnapshot = await db
      .collection("entertainment")
      .get();

    const stations = stationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const bookings = bookingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const owners = ownersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const mechanics = mechanicsSnapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));

    const foods = foodSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const entertainment = entertainmentSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const reviewsSnapshot = await db
  .collection("reviews")
  .get();

const reviews = reviewsSnapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));

    // ===============================
    // STATISTICS
    // ===============================

    const totalStations = stations.length;
    const totalBookings = bookings.length;
    const totalOwners = owners.length;
    const totalUsers = users.length;

    const pendingOwners = owners.filter(
      (owner) =>
        owner.status === "Pending" ||
        owner.approved === false
    ).length;

    const totalRevenue = bookings.reduce(
      (total, booking) =>
        total + Number(booking.estimatedPrice || 0),
      0
    );

    const completedBookings = bookings.filter(
      (booking) => booking.status === "Completed"
    ).length;

    const pendingBookings = bookings.filter(
      (booking) => booking.status === "Pending"
    ).length;

    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "Cancelled"
    ).length;

    const availableStations = stations.filter(
      (station) => station.available !== false
    ).length;

    const availableChargers = stations
      .filter((station) => station.available !== false)
      .reduce(
        (total, station) =>
          total + Number(station.chargers || 0),
        0
      );

    const activeStations = stations.filter(
      (station) => station.available !== false
    ).length;

    const occupiedChargers = bookings.filter((booking) => {
      const status = String(
        booking.status || ""
      ).toLowerCase();

      return (
        status === "booked" ||
        status === "confirmed" ||
        status === "active" ||
        status === "ongoing"
      );
    }).length;

    const availableFood = foods.filter(
      (food) => food.available !== false
    ).length;

    const availableEntertainment = entertainment.filter(
      (item) => item.available !== false
    ).length;

    // ===============================
    // SEND RESPONSE
    // ===============================

    res.status(200).json({
      success: true,

      stats: {
        totalStations,
        totalBookings,
        totalOwners,
        totalUsers,
        pendingOwners,
        totalRevenue,
        completedBookings,
        pendingBookings,
        cancelledBookings,
        availableStations,
        availableChargers,
        activeStations,
        occupiedChargers,
        availableFood,
        availableEntertainment,
        mechanics,
      },

      stations,
      bookings,
      owners,
      users,
      foods,
      entertainment,
    });
  } catch (error) {
    console.error(
      "Admin Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch admin dashboard data",
      error: error.message,
    });
  }
};


// ===============================
// APPROVE STATION OWNER
// ===============================
  const approveStationOwner = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Owner ko approve karo
    const ownerRef = db.collection("stationOwners").doc(id);

    const ownerDoc = await ownerRef.get();

    if (!ownerDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Station owner not found",
      });
    }

    const ownerData = ownerDoc.data();

    await ownerRef.update({
      status: "Approved",
      approved: true,
      approvedAt: new Date().toISOString(),
    });

    // 2. Is owner ke saare stations find karo
    const stationsSnapshot = await db
      .collection("stations")
      .where("ownerId", "==", id)
      .get();

    // 3. Saare stations ko approve + available karo
    const batch = db.batch();

    stationsSnapshot.docs.forEach((stationDoc) => {
      batch.update(stationDoc.ref, {
        approvalStatus: "Approved",
        available: true,
        ownerApproved: true,
        approvedAt: new Date().toISOString(),

        // Owner information ensure karo
        ownerId: id,
        ownerName: ownerData.ownerName || "",
        ownerEmail: ownerData.email || "",
        ownerMobile: ownerData.mobile || "",
      });
    });

    await batch.commit();

    console.log("OWNER APPROVED:", id);
    console.log(
      "STATIONS APPROVED:",
      stationsSnapshot.size
    );

    res.status(200).json({
      success: true,
      message: "Station owner and all stations approved successfully",
      ownerId: id,
      stationsApproved: stationsSnapshot.size,
    });

  } catch (error) {
    console.error("Approve Owner Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to approve station owner",
      error: error.message,
    });
  }
};


// ===============================
// ADD EV MECHANIC
// ===============================

const addMechanic = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      location,
      rating,
      experience,
      status,
      photo,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !specialization ||
      !location ||
      rating === "" ||
      !experience
    ) {
      return res.status(400).json({
        success: false,
        message: "All mechanic fields are required",
      });
    }

    const mechanicRef = await db.collection("mechanics").add({
      name,
      email,
      phone,
      specialization,
      location,
      rating: Number(rating),
      experience,
      status: status || "Active",
      photo: photo || "",
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: "EV Mechanic added successfully",
      id: mechanicRef.id,
    });
  } catch (error) {
    console.error("Add Mechanic Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add EV mechanic",
      error: error.message,
    });
  }
};


const updateMechanic = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      specialization,
      location,
      rating,
      experience,
      status,
      photo,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !specialization ||
      !location ||
      rating === "" ||
      !experience
    ) {
      return res.status(400).json({
        success: false,
        message: "All mechanic fields are required",
      });
    }

    await db.collection("mechanics").doc(id).update({
      name,
      email,
      phone,
      specialization,
      location,
      rating: Number(rating),
      experience,
      status: status || "Active",
      photo: photo || "",
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: "EV Mechanic updated successfully",
    });
  } catch (error) {
    console.error("Update Mechanic Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update EV mechanic",
      error: error.message,
    });
  }
};

// ===============================
// DELETE EV MECHANIC
// ===============================

const deleteMechanic = async (req, res) => {
  try {
    const { id } = req.params;

    await db
      .collection("mechanics")
      .doc(id)
      .delete();

    res.status(200).json({
      success: true,
      message:
        "EV Mechanic removed successfully",
    });
  } catch (error) {
    console.error(
      "Delete Mechanic Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to remove EV mechanic",
      error: error.message,
    });
  }
};


// ===============================
// EXPORTS
// ===============================

module.exports = {
  getDashboardData,
  approveStationOwner,
  addMechanic,
  updateMechanic,
  deleteMechanic,
};