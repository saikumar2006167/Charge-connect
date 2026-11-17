import {
  FaBolt,
  FaMapMarkedAlt,
  FaChargingStation,
  FaTools,
  FaRoute,
  FaBullseye,
  FaRocket,
} from "react-icons/fa";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-10">

        {/* Heading */}

        <h1 className="text-4xl font-bold text-green-600 mb-2">
          About ChargeConnect
        </h1>

        <p className="text-lg text-gray-500 mb-10">
          Powering Every EV Journey with Confidence
        </p>

        {/* About ChargeConnect */}

        <div className="mb-10">

          <h2 className="text-3xl font-bold text-green-600 flex items-center gap-3 mb-5">
            <FaChargingStation />
             ChargeConnect
          </h2>

          <p className="text-gray-700 leading-8 text-lg text-justify">
            ChargeConnect is an intelligent Electric Vehicle (EV) charging
            platform designed to make EV travel simple, reliable, and
            stress-free. The platform helps EV users easily locate nearby
            charging stations, check charger availability, reserve charging
            slots, and manage bookings through a single application.
          </p>

          <p className="text-gray-700 leading-8 text-lg mt-5 text-justify">
            ChargeConnect goes beyond charging by connecting users with EV
            mechanics and providing emergency roadside assistance whenever
            required. With features like QR-based booking confirmation,
            secure online payments, favourite charging stations, Google Maps
            navigation, and booking history, the platform provides a complete
            digital ecosystem for EV owners.
          </p>

          <p className="text-gray-700 leading-8 text-lg mt-5 text-justify">
            Our goal is to reduce range anxiety and make electric mobility
            more convenient by combining charging, maintenance,
            navigation, and support services into one easy-to-use platform.
          </p>

        </div>

        {/* Services */}

        <div className="mb-10">

          <h2 className="text-3xl font-bold text-green-600 flex items-center gap-3 mb-6">
            <FaTools />
            ChargeConnect Services
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="bg-green-50 rounded-2xl p-5">
              ✅ Find Nearby EV Charging Stations
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              ✅ Search Charging Stations by City
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              ✅ Real-Time Charger Availability
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              ✅ Advance Charging Slot Booking
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              ✅ Secure Online & Cash Payments
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              ✅ QR Code Based Booking Confirmation
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              ✅ Favourite Charging Stations
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              ✅ Booking History & User Profile
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              ✅ Contact Station Owner After Booking
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              ✅ Google Maps Navigation
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              ✅ EV Mechanics Discovery
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              ✅ Emergency Support (Portable Charging, Tow Vehicle,
              Technician Assistance, Flat Tyre & Breakdown Support)
            </div>

          </div>

        </div>

        {/* Vision */}

        <div className="mb-10">

          <h2 className="text-3xl font-bold text-green-600 flex items-center gap-3 mb-5">
            <FaBullseye />
            Our Vision
          </h2>

          <p className="text-gray-700 leading-8 text-lg text-justify">
            Our vision is to become India's most trusted EV mobility platform
            by providing a complete ecosystem for electric vehicle users. We
            aim to make EV charging faster, smarter, and more accessible while
            ensuring every EV owner has quick access to charging stations,
            maintenance services, and emergency roadside assistance.
           Our vision is to build a smarter, greener, and more connected future for electric mobility. We aspire to become India's most trusted EV mobility platform by creating a complete digital ecosystem that simplifies every aspect of electric vehicle ownership.

Our goal is to ensure that every EV user has quick and reliable access to charging stations, certified EV mechanics, emergency roadside assistance, and smart navigation services through a single, user-friendly platform. We believe that technology should eliminate range anxiety and make electric vehicle travel more convenient, efficient, and accessible for everyone.

ChargeConnect is committed to driving innovation by integrating intelligent booking systems, secure digital payments, real-time charger availability, location-based services, and advanced support solutions. As electric vehicle adoption continues to grow, we aim to continuously enhance our platform with AI-powered recommendations, IoT-enabled smart charging, predictive maintenance, and advanced route planning.

By promoting clean energy, reducing carbon emissions, and encouraging sustainable transportation, ChargeConnect envisions contributing towards a cleaner environment and a smarter future where electric mobility becomes the preferred choice for every traveler.
          </p>

        </div>

        {/* Future Scope */}

        <div className="mb-10">

          <h2 className="text-3xl font-bold text-green-600 flex items-center gap-3 mb-6">
            <FaRocket />
            Future Scope
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="bg-blue-50 rounded-2xl p-5">
              🚀 AI-Based Charging Station Recommendations
            </div>

            <div className="bg-blue-50 rounded-2xl p-5">
              🚀 Smart Route Planning with Charging Stops
            </div>

            <div className="bg-blue-50 rounded-2xl p-5">
              🚀 Live Charger Availability using IoT
            </div>

            <div className="bg-blue-50 rounded-2xl p-5">
              🚀 Mobile App for Android & iOS
            </div>

            <div className="bg-blue-50 rounded-2xl p-5">
              🚀 Wallet & Reward Points System
            </div>

            <div className="bg-blue-50 rounded-2xl p-5">
              🚀 Subscription Plans for Frequent EV Users
            </div>

            <div className="bg-blue-50 rounded-2xl p-5">
              🚀 Online Appointment Booking for EV Mechanics
            </div>

            <div className="bg-blue-50 rounded-2xl p-5">
              🚀 Live Tracking for Emergency Assistance
            </div>

          </div>

        </div>

        {/* Feature Cards */}

        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="bg-green-50 rounded-2xl p-6 text-center">

            <FaChargingStation className="mx-auto text-green-600 text-5xl mb-4" />

            <h2 className="text-xl font-bold">
              EV Charging Stations
            </h2>

            <p className="text-gray-600 mt-2">
              Discover nearby verified charging stations and book slots
              instantly.
            </p>

          </div>

          <div className="bg-blue-50 rounded-2xl p-6 text-center">

            <FaMapMarkedAlt className="mx-auto text-blue-600 text-5xl mb-4" />

            <h2 className="text-xl font-bold">
              Smart Navigation
            </h2>

            <p className="text-gray-600 mt-2">
              Navigate directly to charging stations and EV mechanics using
              Google Maps.
            </p>

          </div>

          <div className="bg-yellow-50 rounded-2xl p-6 text-center">

            <FaBolt className="mx-auto text-yellow-500 text-5xl mb-4" />

            <h2 className="text-xl font-bold">
              Complete EV Solution
            </h2>

            <p className="text-gray-600 mt-2">
              Charging, Mechanics, Booking History, Payments and Emergency
              Support in one platform.
            </p>

          </div>

        </div>

        {/* Version */}

        <div className="mt-10 border-t pt-6">

          <h2 className="text-2xl font-bold text-green-600">
            Version
          </h2>

          <p className="text-gray-600 mt-2">
            ChargeConnect v1.0.0
          </p>

        </div>

      </div>

    </div>
  );
}