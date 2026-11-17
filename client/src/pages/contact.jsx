import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaQuestionCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaBug,
  FaStar,
  FaInfoCircle,
  FaChevronRight,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="flex items-center gap-4 mb-8">

          <button
            onClick={() => navigate(-1)}
            className="bg-white p-3 rounded-xl shadow hover:bg-gray-100"
          >
            <FaArrowLeft />
          </button>

          <h1 className="text-4xl font-bold text-green-600">
            Help & Support
          </h1>

        </div>

        {/* Banner */}

        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-10 text-white shadow-xl">

          <h2 className="text-4xl font-bold">
            Need Help?
          </h2>

          <p className="mt-4 text-lg opacity-90">
            We're here to help you with bookings, charging,
            payments and everything related to ChargeConnect.
          </p>

        </div>

        {/* Support Options */}

        <div className="bg-white rounded-3xl shadow-xl mt-8 overflow-hidden">

          <button
            onClick={() => navigate("/faq")}
            className="w-full flex justify-between items-center px-6 py-5 border-b hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <FaQuestionCircle className="text-green-600 text-xl" />
              <span className="font-medium">
                Frequently Asked Questions
              </span>
            </div>

            <FaChevronRight />
          </button>

          <button className="w-full flex justify-between items-center px-6 py-5 border-b hover:bg-gray-50">

            <div className="flex items-center gap-4">
              <FaPhoneAlt className="text-blue-600 text-xl" />
              <span className="font-medium">
                Call Support
              </span>
            </div>

            <span className="font-semibold">
              +91 93463 54871
            </span>

          </button>

          <button className="w-full flex justify-between items-center px-6 py-5 border-b hover:bg-gray-50">

            <div className="flex items-center gap-4">
              <FaEnvelope className="text-red-500 text-xl" />
              <span className="font-medium">
                Email Support
              </span>
            </div>

            <span className="text-green-600">
              chargeconnectsupport@gmail.com
            </span>

          </button>

          <button
            onClick={() => navigate("/report-bug")}
            className="w-full flex justify-between items-center px-6 py-5 border-b hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <FaBug className="text-yellow-500 text-xl" />
              <span className="font-medium">
                Report a Bug
              </span>
            </div>

            <FaChevronRight />

          </button>

          <button
            onClick={() => navigate("/rate-app")}
            className="w-full flex justify-between items-center px-6 py-5 border-b hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <FaStar className="text-orange-500 text-xl" />
              <span className="font-medium">
                Rate Our App
              </span>
            </div>

            <FaChevronRight />

          </button>

          <button
            onClick={() => navigate("/about")}
            className="w-full flex justify-between items-center px-6 py-5 hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <FaInfoCircle className="text-purple-600 text-xl" />
              <span className="font-medium">
                About ChargeConnect
              </span>
            </div>

            <FaChevronRight />

          </button>

        </div>

        {/* Support Hours */}

        <div className="bg-white rounded-2xl shadow-lg mt-8 p-8">

          <div className="flex items-center gap-3 mb-6">

            <FaClock className="text-green-600 text-3xl" />

            <h2 className="text-2xl font-bold text-green-600">
              Support Hours
            </h2>

          </div>

          <div className="space-y-4 text-gray-700">

            <div className="flex justify-between border-b pb-3">
              <span>Monday - Friday</span>
              <span className="font-semibold">9:00 AM - 8:00 PM</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span>Saturday</span>
              <span className="font-semibold">10:00 AM - 6:00 PM</span>
            </div>

            <div className="flex justify-between">
              <span>Sunday</span>
              <span className="font-semibold text-red-500">
                Emergency Support Only
              </span>
            </div>

          </div>

        </div>

        {/* Follow Us */}

        <div className="bg-white rounded-2xl shadow-lg mt-8 p-8 text-center">

          <h2 className="text-2xl font-bold text-green-600 mb-6">
            Follow Us
          </h2>

          <div className="flex justify-center gap-8 text-4xl">

            <a href="#" className="text-blue-600 hover:scale-110 transition">
              <FaFacebook />
            </a>

            <a href="#" className="text-pink-600 hover:scale-110 transition">
              <FaInstagram />
            </a>

            <a href="#" className="text-blue-700 hover:scale-110 transition">
              <FaLinkedin />
            </a>

            <a href="#" className="text-red-600 hover:scale-110 transition">
              <FaYoutube />
            </a>

          </div>

        </div>

        {/* Footer */}

        <div className="bg-white rounded-2xl shadow-lg mt-8 p-8 text-center">

          <h2 className="text-2xl font-bold text-green-600">
            ChargeConnect
          </h2>

          <p className="mt-3 text-gray-600">
            Version 1.0.0
          </p>

          <p className="mt-2 text-gray-500">
            Smart EV Charging Platform built with React,
            Node.js & Firebase.
          </p>

        </div>

      </div>

    </div>
  );
}