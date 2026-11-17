import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getBookings,
  deleteBooking,
} from "../services/bookingService";
import {
  FaChargingStation,
  FaCalendarAlt,
  FaClock,
  FaCar,
  FaPlug,
  FaMoneyBillWave,
} from "react-icons/fa";

import QRCode from "react-qr-code";
import { FaDownload } from "react-icons/fa";

import { toPng } from "html-to-image";
import { useRef } from "react";

import { requestEmergency } from "../services/emergencyService";

import {
  FaPhone,
  FaWhatsapp,
  FaExclamationTriangle,
} from "react-icons/fa";


export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const auth = getAuth();
  const qrRefs = useRef({});

  const [showEmergency, setShowEmergency] = useState(false);
const [selectedBooking, setSelectedBooking] = useState(null);
const [requestType, setRequestType] = useState("");
const [description, setDescription] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

async function loadBookings() {
  try {
    const user = auth.currentUser;

    if (!user) return;

    const data = await getBookings(user.email);

    setBookings(data);
  } catch (err) {
    console.error(err);
  }
}



async function cancelBooking(id) {
  const ok = window.confirm(
    "Are you sure you want to cancel this booking?"
  );

  if (!ok) return;

  try {
    await deleteBooking(id);

    setBookings((prev) =>
      prev.filter((b) => b.id !== id)
    );

    alert("Booking Cancelled Successfully");
  } catch (err) {
    console.error(err);
    alert("Unable to cancel booking.");
  }
}

async function downloadQR(id, stationName) {
  const node = qrRefs.current[id];

  if (!node) return;

  try {
    const dataUrl = await toPng(node);

    const link = document.createElement("a");

    link.download = `${stationName}-QR.png`;

    link.href = dataUrl;

    link.click();

  } catch (err) {
    console.log(err);
  }
}




function emergencyHelp(booking) {
  setSelectedBooking(booking);
  setShowEmergency(true);
}

// 👇 EE FUNCTION IKKADA PETTALI
async function submitEmergencyRequest() {

  console.log("Selected Booking:", selectedBooking);
  try {
    await requestEmergency({
      userId: selectedBooking.uid,
      userName: selectedBooking.userName,
      userEmail: selectedBooking.userEmail,
      userMobile: selectedBooking.userMobile,

      stationId: selectedBooking.stationId,
      stationName: selectedBooking.stationName,

      ownerName: selectedBooking.ownerName,
      ownerMobile: selectedBooking.ownerMobile,

      service: requestType,

      latitude: selectedBooking.latitude,
      longitude: selectedBooking.longitude,
    });

    alert("Emergency Request Sent Successfully ✅");

    setShowEmergency(false);
    setRequestType("");
    setDescription("");

  } catch (err) {
    console.log(err);
    alert("Unable to send request");
  }
}



  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-green-600 mb-8">
          ⚡ My Bookings
        </h1>

        {bookings.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

            <FaChargingStation
              size={60}
              className="mx-auto text-green-600 mb-4"
            />

            <h2 className="text-2xl font-bold">
              No Bookings Found
            </h2>

            <p className="text-gray-500 mt-3">
              Your booked charging sessions will appear here.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-6">
                    {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-center">

                <h2 className="text-2xl font-bold text-green-700">
                  {booking.stationName}
                </h2>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {booking.status || "Booked"}
                </span>

              </div>

              <div className="mt-5 space-y-3">

                <p className="flex items-center gap-3">
                  <FaCalendarAlt className="text-green-600" />
                  <span>
                    <b>Date:</b>{" "}
                    {booking.bookingDate || "--"}
                  </span>
                </p>

                <p className="flex items-center gap-3">
                  <FaClock className="text-blue-600" />
                  <span>
                    <b>Time:</b>{" "}
                    {booking.bookingSlot || "--"}
                  </span>
                </p>

                <p className="flex items-center gap-3">
                  <FaCar className="text-red-500" />
                  <span>
                    <b>Vehicle:</b>{" "}
                    {booking.vehicleNumber || "--"}
                  </span>
                </p>

                <p className="flex items-center gap-3">
                  <FaPlug className="text-yellow-500" />
                  <span>
                    <b>Connector:</b>{" "}
                    {booking.connector || "--"}
                  </span>
                </p>

                <p className="flex items-center gap-3">
                  ⏱
                  <span>
                    <b>Duration:</b>{" "}
                    {booking.duration || "--"} mins
                  </span>
                </p>

                <p className="flex items-center gap-3">
                  <FaMoneyBillWave className="text-green-600" />
                  <span>
                    <b>Estimated Cost:</b> ₹
                    {booking.estimatedPrice || 0}
                  </span>
                </p>

                <div className="mt-5 border-t pt-5">

  <h3 className="text-lg font-bold text-green-700 mb-3">
    Station Contact Details
  </h3>

  <p>
    <b>Owner Name :</b> {booking.ownerName}
  </p>

  <p>
    <b>Mobile :</b> {booking.ownerMobile}
  </p>

  <p>
    <b>Email :</b> {booking.ownerEmail}
  </p>

  <p>
    <b>Address :</b> {booking.address}
  </p>

</div>

              </div>

              {/* QR Code */}

              <div
  ref={(el) => (qrRefs.current[booking.id] = el)}
  className="mt-6 flex flex-col items-center bg-white p-4 rounded-xl"
>

  <QRCode
    size={170}
    value={JSON.stringify({
      bookingId: booking.id,
      station: booking.stationName,
      date: booking.bookingDate,
      time: booking.bookingSlot,
      vehicle: booking.vehicleNumber,
      email: booking.userEmail,
    })}
  />

  <p className="mt-3 text-sm font-semibold text-gray-600">
    Booking ID
  </p>

  <p className="font-bold text-green-700">
    {booking.id}
  </p>

</div>

              <button
                onClick={() => cancelBooking(booking.id)}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
              >
                Cancel Booking
              </button>

            <button
  onClick={() =>
    downloadQR(
      booking.id,
      booking.stationName
    )
  }
  className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2"
>
  <FaDownload />
  Download QR
</button>

<div className="grid grid-cols-2 gap-3 mt-4">

  <a
    href={`tel:${booking.ownerMobile}`}
    className="bg-green-600 text-white rounded-xl py-3 flex justify-center items-center gap-2"
  >
    <FaPhone />
    Call Owner
  </a>

  <a
    href={`https://wa.me/91${booking.ownerMobile}`}
    target="_blank"
    rel="noreferrer"
    className="bg-green-500 text-white rounded-xl py-3 flex justify-center items-center gap-2"
  >
    <FaWhatsapp />
    WhatsApp
  </a>

</div>

<button
  onClick={() => emergencyHelp(booking)}
  className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold"
>
  🆘 Emergency Help
</button>


            </div>
          ))}

          </div>

        )}

      </div>

      {showEmergency && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

    <div className="bg-white rounded-2xl p-6 w-[420px]">

      <h2 className="text-2xl font-bold text-red-600 mb-5">
        🚨 Emergency Assistance
      </h2>

      <select
        value={requestType}
        onChange={(e) => setRequestType(e.target.value)}
        className="w-full border rounded-xl p-3 mb-4"
      >
        <option value="">Select Emergency</option>
        <option>🔋 Portable Charging</option>
        <option>🚚 Tow Vehicle</option>
        <option>👨‍🔧 Technician Assistance</option>
        <option>🛞 Flat Tyre</option>
        <option>🔧 Vehicle Breakdown</option>
        <option>❓ Other</option>
      </select>

      <textarea
        rows="4"
        placeholder="Describe your problem..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded-xl p-3"
      />

      <div className="flex gap-3 mt-5">

        <button
          onClick={() => setShowEmergency(false)}
          className="flex-1 bg-gray-300 py-3 rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={submitEmergencyRequest}
          className="flex-1 bg-red-600 text-white py-3 rounded-xl"
        >
          Submit
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}