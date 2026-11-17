const db = require("../firebaseAdmin");
const { Timestamp } = require("firebase-admin/firestore");

// ==========================================
// CUSTOMER - REQUEST EMERGENCY
// ==========================================
const requestEmergency = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      userMobile,

      stationId,
      stationName,

      ownerName,
      ownerMobile,

      service,
      message,

      latitude,
      longitude,
    } = req.body;

    const doc = {
      userId: userId || "",
      userName: userName || "",
      userEmail: userEmail || "",
      userMobile: userMobile || "",

      stationId: stationId || "",
      stationName: stationName || "",

      ownerName: ownerName || "",
      ownerMobile: ownerMobile || "",

      service: service || "Emergency Assistance",
      message: message || "",

      latitude:
        typeof latitude === "number" ? latitude : null,

      longitude:
        typeof longitude === "number" ? longitude : null,

      status: "Pending",

      createdAt: Timestamp.now(),
    };

    const ref = await db
      .collection("emergencyRequests")
      .add(doc);

    res.json({
      success: true,
      id: ref.id,
      message: "Emergency Request Submitted",
    });
  } catch (err) {
    console.log("Emergency Request Error:", err);

    res.status(500).json({
      success: false,
      message: "Unable to submit request",
    });
  }
};


// ==========================================
// ADMIN - GET ALL EMERGENCY REQUESTS
// ==========================================
const getEmergencyRequests = async (req, res) => {
  try {
    const snapshot = await db
      .collection("emergencyRequests")
      .orderBy("createdAt", "desc")
      .get();

    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      requests,
    });
  } catch (err) {
    console.log("Get Emergency Requests Error:", err);

    res.status(500).json({
      success: false,
      message: "Unable to fetch emergency requests",
    });
  }
};


// ==========================================
// ADMIN - UPDATE EMERGENCY STATUS
// ==========================================
const updateEmergencyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    await db
      .collection("emergencyRequests")
      .doc(id)
      .update({
        status,
        updatedAt: Timestamp.now(),
      });

    res.json({
      success: true,
      message: "Emergency status updated successfully",
    });
  } catch (err) {
    console.log("Update Emergency Status Error:", err);

    res.status(500).json({
      success: false,
      message: "Unable to update emergency status",
    });
  }
};


// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  requestEmergency,
  getEmergencyRequests,
  updateEmergencyStatus,
};