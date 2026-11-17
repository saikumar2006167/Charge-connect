import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaUserEdit,
  FaLock,
  FaMoon,
  FaGlobe,
  FaBell,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaFileAlt,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";

export default function Settings() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-4xl mx-auto">

        {/* Header */}

        <div className="flex items-center gap-4 mb-8">

          <button
            onClick={() => navigate(-1)}
            className="bg-white p-3 rounded-xl shadow hover:bg-gray-100"
          >
            <FaArrowLeft />
          </button>

          <h1 className="text-4xl font-bold text-green-600">
            Settings
          </h1>

        </div>

        {/* Settings Card */}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <button
  onClick={() => navigate("/edit-profile")}
  className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 border-b"
>
  <div className="flex items-center gap-4">
    <FaUserEdit className="text-green-600 text-xl" />
    <span className="font-medium">Edit Profile</span>
  </div>

  <FaChevronRight />
</button>
          <button className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 border-b">
            <div className="flex items-center gap-4">
              <FaLock className="text-red-500 text-xl" />
              <span className="font-medium">Change Password</span>
            </div>
            <span>›</span>
          </button>

          <div className="flex items-center justify-between px-6 py-5 border-b">
            <div className="flex items-center gap-4">
              <FaMoon className="text-indigo-600 text-xl" />
              <span className="font-medium">Dark Mode</span>
            </div>

            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="w-5 h-5 accent-green-600"
            />
          </div>

         <button
  onClick={() => navigate("/language")}
  className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 border-b"
>
  <div className="flex items-center gap-4">
    <FaGlobe className="text-blue-600 text-xl" />
    <span className="font-medium">
      Language
    </span>
  </div>

  <FaChevronRight />
</button>

          <div className="flex items-center justify-between px-6 py-5 border-b">
            <div className="flex items-center gap-4">
              <FaBell className="text-yellow-500 text-xl" />
              <span className="font-medium">
                Notifications
              </span>
            </div>

            <input
              type="checkbox"
              checked={notifications}
              onChange={() =>
                setNotifications(!notifications)
              }
              className="w-5 h-5 accent-green-600"
            />
          </div>

          <button className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 border-b">
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-pink-600 text-xl" />
              <span className="font-medium">
                Location Permission
              </span>
            </div>

            <span className="text-green-600">
              Enabled
            </span>
          </button>

          <button 
          onClick={() => navigate("/privacy")}
          className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 border-b">
            <div className="flex items-center gap-4">
              <FaFileAlt className="text-gray-700 text-xl" />
              <span className="font-medium">
                Privacy Policy
              </span>
            </div>

            <span>›</span>
          </button>

          <button 
          onClick={() => navigate("/about")}
          className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 border-b">
            <div className="flex items-center gap-4">
              <FaInfoCircle className="text-cyan-600 text-xl" />
              <span className="font-medium">
                About ChargeConnect
              </span>
            </div>

            <span>›</span>
          </button>

        </div>

        {/* App Version */}

        <div className="bg-white rounded-2xl shadow-lg mt-6 p-6">

          <h3 className="text-xl font-bold text-green-600">
            App Information
          </h3>

          <p className="mt-3 text-gray-600">
            Version : <b>1.0.0</b>
          </p>

          <p className="text-gray-600">
            Developed using React + Node.js + Firebase
          </p>

        </div>

        {/* Logout */}

        <button
          onClick={logout}
          className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl flex justify-center items-center gap-3 text-lg font-semibold shadow-lg"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>
    </div>
  );
}