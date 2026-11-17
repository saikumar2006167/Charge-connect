import {
  FaUserShield,
  FaDatabase,
  FaLock,
  FaMapMarkedAlt,
  FaCreditCard,
  FaUserCheck,
  FaEnvelope,
} from "react-icons/fa";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl text-white p-10 shadow-xl">

          <h1 className="text-5xl font-bold">
            Privacy Policy
          </h1>

          <p className="mt-4 text-lg opacity-95">
            Your privacy and data security are our highest priorities.
          </p>

          <p className="mt-2 text-sm opacity-90">
            Last Updated: July 2026
          </p>

        </div>

        {/* Introduction */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <h2 className="text-3xl font-bold text-green-600 mb-5">
            Welcome to ChargeConnect
          </h2>

          <p className="text-gray-700 leading-8 text-lg text-justify">
            ChargeConnect is committed to protecting your personal
            information and ensuring complete transparency in how your
            data is collected, used, stored, and protected. This Privacy
            Policy explains our practices regarding your personal
            information while using the ChargeConnect platform.Welcome to ChargeConnect, your trusted companion for smart electric vehicle mobility. As the adoption of electric vehicles continues to grow, the need for a reliable and connected charging ecosystem has become more important than ever. ChargeConnect is designed to bridge this gap by providing a seamless platform where EV users can easily discover charging stations, reserve charging slots, locate nearby EV mechanics, and access emergency roadside assistance—all in one place.

Our platform focuses on delivering a convenient, secure, and user-friendly experience while promoting sustainable transportation. Whether you are planning a long journey or searching for the nearest charging station in your city, ChargeConnect ensures that every EV owner has the tools and support needed for a smooth and worry-free journey.

We believe that technology should simplify electric mobility. By integrating smart booking, digital payments, real-time station information, navigation, and maintenance support into a single platform, ChargeConnect is helping build a cleaner, greener, and smarter future for electric vehicle users across India.
          </p>

          <p className="text-gray-700 leading-8 text-lg mt-5 text-justify">
            By accessing or using ChargeConnect, you agree to the
            collection and use of information in accordance with this
            Privacy Policy.
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <FaDatabase className="text-5xl text-green-600 mb-5" />

            <h2 className="text-2xl font-bold mb-4">
              Information We Collect
            </h2>

            <ul className="space-y-3 text-gray-700">
              <li>• Name and Email Address</li>
              <li>• Mobile Number</li>
              <li>• Vehicle Details</li>
              <li>• Booking Information</li>
              <li>• Favourite Charging Stations</li>
              <li>• Payment Status</li>
            </ul>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <FaUserShield className="text-5xl text-blue-600 mb-5" />

            <h2 className="text-2xl font-bold mb-4">
              How We Use Your Information
            </h2>

            <ul className="space-y-3 text-gray-700">
              <li>• Process charging bookings</li>
              <li>• Verify your account</li>
              <li>• Manage payments</li>
              <li>• Improve platform performance</li>
              <li>• Provide customer support</li>
              <li>• Send booking notifications</li>
            </ul>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <FaLock className="text-5xl text-red-500 mb-5" />

            <h2 className="text-2xl font-bold mb-4">
              Data Protection
            </h2>

            <p className="text-gray-700 leading-8">
              Your personal information is securely stored using
              industry-standard security practices. We implement secure
              authentication, encrypted communication, and controlled
              database access to protect your information from
              unauthorized access.
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <FaMapMarkedAlt className="text-5xl text-yellow-500 mb-5" />

            <h2 className="text-2xl font-bold mb-4">
              Location Services
            </h2>

            <p className="text-gray-700 leading-8">
              ChargeConnect may access your device location only with
              your permission to help you discover nearby charging
              stations and EV mechanics. Your live location is never
              shared without your consent.
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <FaCreditCard className="text-5xl text-purple-600 mb-5" />

            <h2 className="text-2xl font-bold mb-4">
              Payments
            </h2>

            <p className="text-gray-700 leading-8">
              Online payments are securely processed through trusted
              payment gateways. ChargeConnect does not store your debit
              card, credit card, or banking credentials on our servers.
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <FaUserCheck className="text-5xl text-green-500 mb-5" />

            <h2 className="text-2xl font-bold mb-4">
              Your Rights
            </h2>

            <ul className="space-y-3 text-gray-700">
              <li>• Access your information</li>
              <li>• Update profile details</li>
              <li>• Delete your account</li>
              <li>• Request correction of data</li>
              <li>• Control location permissions</li>
            </ul>

          </div>

        </div>

        {/* Third Party */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <h2 className="text-3xl font-bold text-green-600 mb-5">
            Third-Party Services
          </h2>

          <p className="text-gray-700 leading-8 text-lg">
            ChargeConnect may use trusted third-party services including
            Firebase Authentication, Cloud Firestore, Razorpay Payment
            Gateway, Google Maps, and WhatsApp services to provide a
            seamless user experience. These services maintain their own
            privacy policies.
          </p>

        </div>

        {/* Contact */}

        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl text-white shadow-xl p-8 mt-8">

          <div className="flex items-center gap-4">

            <FaEnvelope className="text-5xl" />

            <div>

              <h2 className="text-3xl font-bold">
                Contact Us
              </h2>

              <p className="mt-3 text-lg">
                If you have any questions regarding this Privacy Policy,
                please feel free to contact the ChargeConnect Support
                Team.
              </p>

              <p className="mt-4 font-semibold">
                📧 chargeconnectsupport@gmail.com
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}