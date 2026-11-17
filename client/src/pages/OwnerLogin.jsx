import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaChargingStation,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function OwnerLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
  e.preventDefault();

  // Save owner email for dashboard
  localStorage.setItem("ownerEmail", email);

  // Navigate to dashboard
  navigate("/owner-dashboard");
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex justify-center items-center p-6">

      <div className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full">

        {/* LEFT SIDE */}
        <div className="bg-gradient-to-br from-green-700 to-emerald-500 text-white p-12 flex flex-col justify-center">

          <FaChargingStation size={70} className="mb-8" />

          <h1 className="text-5xl font-bold leading-tight">
            Station Owner Portal
          </h1>

          <p className="mt-6 text-lg leading-8">
            Welcome to the ChargeConnect Partner Portal.
            Manage your charging station, monitor bookings,
            revenue, charger availability and customer
            interactions from one powerful dashboard.
          </p>

          <div className="mt-10 space-y-4 text-lg">
            <p>✓ Manage Charging Stations</p>
            <p>✓ Approve Customer Bookings</p>
            <p>✓ Monitor Revenue</p>
            <p>✓ Track Charger Availability</p>
            <p>✓ View Customer Reviews</p>
            <p>✓ Business Analytics</p>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="p-12 flex flex-col justify-center">

          <h2 className="text-4xl font-bold text-green-700">
            Owner Login
          </h2>

          <p className="text-gray-500 mt-3">
            Login to access your dashboard.
          </p>

          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="mt-8">

              <label className="font-semibold">
                Email Address
              </label>

              <div className="flex items-center border rounded-xl mt-2 px-4">

                <FaEnvelope className="text-gray-400" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-4 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="mt-6">

              <label className="font-semibold">
                Password
              </label>

              <div className="flex items-center border rounded-xl mt-2 px-4">

                <FaLock className="text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full p-4 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>

              </div>

            </div>

            {/* REMEMBER ME + FORGOT PASSWORD */}
            <div className="flex justify-between items-center mt-6">

              <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  className="accent-green-600"
                />

                <span className="text-gray-600">
                  Remember Me
                </span>

              </label>

              <Link
                to="/owner-forgot-password"
                className="text-green-600 hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold text-lg mt-8 transition"
            >
              Login
            </button>

          </form>

          {/* DIVIDER */}
          <div className="flex items-center my-8">

            <div className="flex-1 border-t"></div>

            <span className="px-4 text-gray-500">
              OR
            </span>

            <div className="flex-1 border-t"></div>

          </div>

          {/* REGISTER */}
          <Link
            to="/owner-register"
            className="w-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-4 rounded-xl text-center font-semibold transition"
          >
            Register Your Charging Station
          </Link>

          {/* BACK TO HOME */}
          <div className="text-center mt-8">

            <Link
              to="/"
              className="text-green-600 hover:underline"
            >
              ← Back to Home
            </Link>

          </div>

          {/* FOOTER */}
          <p className="text-center text-gray-500 text-sm mt-10">
            © 2026 ChargeConnect. All Rights Reserved.
          </p>

        </div>

      </div>

    </div>
  );
}