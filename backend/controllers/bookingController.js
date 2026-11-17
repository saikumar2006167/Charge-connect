const db = require("../firebaseAdmin");
const { sendBookingEmail } = require("../services/emailService");
const {
  createNotification,
} = require("../services/notificationService");

// Add Booking
const addBooking = async (req, res) => {
  try {
    const booking = req.body;

    const docRef = await db.collection("bookings").add(booking);
    await sendBookingEmail({
  email: booking.userEmail,
  name: booking.userName || "Customer",
  station: booking.stationName,
  vehicle: booking.vehicleNumber,
  date: booking.bookingDate,
  time: booking.bookingSlot,
  amount: booking.estimatedPrice,
  status: booking.paymentMethod === "cash"
    ? "Cash at Station"
    : "Paid",
});

    // Create notification
    await createNotification({
      uid: booking.uid,
      title: "Booking Confirmed",
      message: `Your booking at ${booking.stationName} has been confirmed.`,
      type: "booking",
    });

   console.log("After Notification"); 
    res.status(201).json({
      success: true,
      id: docRef.id,
      message: "Booking Created Successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get User Bookings
const getBookings = async (req, res) => {
  try {
    const { email } = req.params;

    const snapshot = await db
      .collection("bookings")
      .where("userEmail", "==", email)
      .get();

    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(bookings);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Booking History
const getHistory = async (req, res) => {
  try {
    const { email } = req.params;

    const snapshot = await db
      .collection("history")
      .where("userEmail", "==", email)
      .get();

    const history = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(history);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Cancel Booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Get booking
    const bookingRef = db.collection("bookings").doc(id);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = bookingDoc.data();

    // Save to History
    await db.collection("history").add({
      ...booking,
      status: "Cancelled",
      cancelledAt: new Date().toLocaleString(),
    });

    // Delete from bookings
    await bookingRef.delete();

    res.json({
      success: true,
      message: "Booking Cancelled Successfully",
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
  addBooking,
  getBookings,
  getHistory,
  deleteBooking,
};