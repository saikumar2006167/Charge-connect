require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const stationRoutes = require("./routes/stationRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const mechanicRoutes = require("./routes/mechanicRoutes");
const stationOwnerRoutes = require("./routes/stationOwnerRoutes");
const foodRoutes = require("./routes/foodRoutes");
const entertainmentRoutes = require("./routes/entertainmentRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(cors());
app.use(express.json());

app.use("/foods", foodRoutes);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/stations", stationRoutes);
app.use("/favourites", favouriteRoutes);
app.use("/bookings", bookingRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/api/station-owner", stationOwnerRoutes);
app.use("/payment", paymentRoutes);
app.use("/auth", authRoutes);
app.use("/emergency", emergencyRoutes);
app.use("/mechanics", mechanicRoutes);
app.use("/entertainment", entertainmentRoutes);
app.use("/admin", adminRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});