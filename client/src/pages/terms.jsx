import {
  FaFileContract,
  FaUserCheck,
  FaIdCard,
  FaChargingStation,
  FaCreditCard,
  FaCalendarCheck,
  FaUndoAlt,
  FaMoneyBillWave,
  FaTools,
  FaExclamationTriangle,
  FaShieldAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-6xl mx-auto">

        {/* Hero Section */}

        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl shadow-xl text-white p-10">

          <h1 className="text-5xl font-bold">
            Terms & Conditions
          </h1>

          <p className="mt-4 text-lg">
            Please read these Terms & Conditions carefully before using
            ChargeConnect. By accessing or using our platform, you agree
            to comply with these terms.
          </p>

          <p className="mt-3 text-sm opacity-90">
            Last Updated : July 2026
          </p>

        </div>

        {/* Welcome */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <h2 className="text-3xl font-bold text-green-600 mb-5">
            Welcome to ChargeConnect
          </h2>

          <p className="text-gray-700 leading-8 text-lg text-justify">
            Welcome to ChargeConnect. These Terms & Conditions govern
            your access to and use of our platform, website, and mobile
            application. By creating an account, booking charging
            stations, using EV mechanic services, or accessing any
            ChargeConnect feature, you agree to these Terms &
            Conditions.
          </p>

          <p className="text-gray-700 leading-8 text-lg mt-5 text-justify">
            ChargeConnect provides EV charging station discovery,
            charging slot booking, EV mechanic discovery, digital
            payments, navigation assistance, and emergency support
            services. Users are expected to use these services
            responsibly and in accordance with applicable laws.
          </p>

        </div>

        {/* Eligibility */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <div className="flex items-center gap-4 mb-5">

            <FaIdCard className="text-5xl text-green-600" />

            <h2 className="text-3xl font-bold">
              Eligibility
            </h2>

          </div>

          <p className="text-gray-700 leading-8">
            To use ChargeConnect services, users must satisfy the
            following eligibility requirements:
          </p>

          <ul className="mt-5 space-y-3 text-gray-700">

            <li>✔ Must be at least 18 years of age.</li>

            <li>
              ✔ Must provide valid registration details.
            </li>

            <li>
              ✔ Must own or operate an electric vehicle.
            </li>

            <li>
              ✔ Must comply with all applicable laws and regulations.
            </li>

            <li>
              ✔ Must use genuine identity and payment information.
            </li>

          </ul>

        </div>

        {/* User Responsibilities */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <div className="flex items-center gap-4 mb-5">

            <FaUserCheck className="text-5xl text-blue-600" />

            <h2 className="text-3xl font-bold">
              User Responsibilities
            </h2>

          </div>

          <p className="text-gray-700 leading-8 mb-4">
            While using ChargeConnect, users agree to:
          </p>

          <ul className="space-y-3 text-gray-700">

            <li>
              ✔ Provide accurate personal information.
            </li>

            <li>
              ✔ Keep account credentials secure.
            </li>

            <li>
              ✔ Maintain updated vehicle information.
            </li>

            <li>
              ✔ Respect charging station rules.
            </li>

            <li>
              ✔ Arrive at the booked charging slot on time.
            </li>

            <li>
              ✔ Use the platform responsibly without fraudulent
              activities.
            </li>

          </ul>

        </div>

        {/* Charging Station Booking */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <div className="flex items-center gap-4 mb-5">

            <FaChargingStation className="text-5xl text-green-600" />

            <h2 className="text-3xl font-bold">
              Charging Station Booking Policy
            </h2>

          </div>

          <ul className="space-y-3 text-gray-700">

            <li>
              ✔ Charging slots are subject to availability.
            </li>

            <li>
              ✔ Bookings are confirmed only after successful payment or
              booking confirmation.
            </li>

            <li>
              ✔ Users must present their QR Code at the charging
              station.
            </li>

            <li>
              ✔ Late arrival may result in automatic cancellation of the
              booking.
            </li>

            <li>
              ✔ ChargeConnect reserves the right to cancel bookings in
              case of technical issues or station maintenance.
            </li>

          </ul>

        </div>

        {/* Payment Policy */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <div className="flex items-center gap-4 mb-5">

            <FaCreditCard className="text-5xl text-purple-600" />

            <h2 className="text-3xl font-bold">
              Payment Policy
            </h2>

          </div>

          <p className="text-gray-700 leading-8">
            ChargeConnect supports secure online payments through trusted
            payment gateways as well as cash payments where supported by
            charging station owners.
          </p>

          <ul className="mt-5 space-y-3 text-gray-700">

            <li>✔ Online payments are encrypted and secure.</li>

            <li>✔ Payment receipts are generated after booking.</li>

            <li>✔ Users must verify payment details before confirming.</li>

            <li>
              ✔ Failed transactions should be reported immediately.
            </li>

          </ul>

        </div>
                {/* Cancellation Policy */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <div className="flex items-center gap-4 mb-5">

            <FaCalendarCheck className="text-5xl text-red-500" />

            <h2 className="text-3xl font-bold">
              Cancellation Policy
            </h2>

          </div>

          <p className="text-gray-700 leading-8">
            Users may cancel their charging slot before the scheduled
            charging time through the My Bookings section.
          </p>

          <ul className="mt-5 space-y-3 text-gray-700">

            <li>
              ✔ Cancellation can be done before the booked charging slot.
            </li>

            <li>
              ✔ Cancellation charges may apply depending on the station policy.
            </li>

            <li>
              ✔ If the charging station cancels the booking due to maintenance,
              users will receive a full refund.
            </li>

            <li>
              ✔ Repeated unnecessary cancellations may result in temporary
              account restrictions.
            </li>

          </ul>

        </div>

        {/* Reschedule Policy */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <div className="flex items-center gap-4 mb-5">

            <FaUndoAlt className="text-5xl text-blue-600" />

            <h2 className="text-3xl font-bold">
              Reschedule Policy
            </h2>

          </div>

          <p className="text-gray-700 leading-8">
            Users can reschedule their booking if another charging slot
            is available at the selected charging station.
          </p>

          <ul className="mt-5 space-y-3 text-gray-700">

            <li>✔ Rescheduling depends on slot availability.</li>

            <li>✔ Updated booking confirmation will be generated.</li>

            <li>✔ Additional charges may apply if charging rates change.</li>

          </ul>

        </div>

        {/* Refund Policy */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <div className="flex items-center gap-4 mb-5">

            <FaMoneyBillWave className="text-5xl text-green-600" />

            <h2 className="text-3xl font-bold">
              Refund Policy
            </h2>

          </div>

          <p className="text-gray-700 leading-8">
            Refunds are processed only for eligible cancellations or
            failed charging sessions.
          </p>

          <ul className="mt-5 space-y-3 text-gray-700">

            <li>✔ Refunds are initiated after verification.</li>

            <li>✔ Refunds may take 3–7 business days.</li>

            <li>✔ Failed payment transactions are automatically reversed whenever applicable.</li>

            <li>✔ Convenience charges may not be refundable.</li>

          </ul>

        </div>

        {/* EV Mechanics */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <div className="flex items-center gap-4 mb-5">

            <FaTools className="text-5xl text-yellow-500" />

            <h2 className="text-3xl font-bold">
              EV Mechanic Services
            </h2>

          </div>

          <p className="text-gray-700 leading-8">
            ChargeConnect provides a platform to discover nearby EV
            mechanics. Mechanics listed on the platform are independent
            service providers.
          </p>

          <ul className="mt-5 space-y-3 text-gray-700">

            <li>✔ Repair charges are decided by the mechanic.</li>

            <li>✔ ChargeConnect is not responsible for repair quality.</li>

            <li>✔ Users should verify services before confirming.</li>

          </ul>

        </div>

        {/* Emergency Assistance */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <div className="flex items-center gap-4 mb-5">

            <FaExclamationTriangle className="text-5xl text-red-600" />

            <h2 className="text-3xl font-bold">
              Emergency Assistance
            </h2>

          </div>

          <p className="text-gray-700 leading-8">
            ChargeConnect provides emergency assistance request services
            including Portable Charging, Tow Vehicle, Technician
            Assistance, Flat Tyre Support and Vehicle Breakdown Support.
          </p>

          <p className="text-gray-700 leading-8 mt-4">
            Service availability depends on nearby service providers and
            station owners.
          </p>

        </div>

        {/* Privacy */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <div className="flex items-center gap-4 mb-5">

            <FaShieldAlt className="text-5xl text-green-600" />

            <h2 className="text-3xl font-bold">
              Privacy & Data Security
            </h2>

          </div>

          <p className="text-gray-700 leading-8">
            ChargeConnect securely stores user information and protects
            personal data using industry-standard security practices.
            User information is never sold to third parties without
            consent.
          </p>

        </div>

        {/* Prohibited Activities */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <h2 className="text-3xl font-bold text-red-600 mb-5">
            Prohibited Activities
          </h2>

          <ul className="space-y-3 text-gray-700">

            <li>🚫 Fake bookings</li>

            <li>🚫 Fraudulent payments</li>

            <li>🚫 Sharing another user's account</li>

            <li>🚫 Misusing charging stations</li>

            <li>🚫 Attempting unauthorized access</li>

            <li>🚫 Illegal activities using the platform</li>

          </ul>

        </div>

        {/* Limitation */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <h2 className="text-3xl font-bold text-green-600 mb-5">
            Limitation of Liability
          </h2>

          <p className="text-gray-700 leading-8">
            ChargeConnect acts as a technology platform connecting EV
            users with charging station owners and EV mechanics. We are
            not liable for delays, equipment failures, charging station
            downtime, third-party service quality, or any indirect
            damages arising from the use of the platform.
          </p>

        </div>

        {/* Changes */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <h2 className="text-3xl font-bold text-green-600 mb-5">
            Changes to Terms
          </h2>

          <p className="text-gray-700 leading-8">
            ChargeConnect reserves the right to modify these Terms &
            Conditions at any time. Continued use of the platform after
            updates indicates acceptance of the revised terms.
          </p>

        </div>

        {/* Contact */}

        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl shadow-xl text-white p-8 mt-8 mb-10">

          <div className="flex items-center gap-5">

            <FaEnvelope className="text-5xl" />

            <div>

              <h2 className="text-3xl font-bold">
                Contact Us
              </h2>

              <p className="mt-3 text-lg">
                If you have any questions regarding these Terms &
                Conditions, please contact the ChargeConnect Support Team.
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