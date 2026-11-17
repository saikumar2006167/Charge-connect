import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getHistory } from "../services/bookingService";

import {
  FaHistory,
  FaCalendarAlt,
  FaClock,
  FaCar,
  FaPlug,
  FaMoneyBillWave,
} from "react-icons/fa";
export default function History() {
  const [history, setHistory] = useState([]);

  const auth = getAuth();

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
  try {
    const user = auth.currentUser;

    if (!user) return;

    const data = await getHistory(user.email);

    setHistory(data);
  } catch (err) {
    console.error(err);
  }
}
    return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-green-600 mb-8 flex items-center gap-3">
          <FaHistory />
          Booking History
        </h1>

        {history.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

            <FaHistory
              size={60}
              className="mx-auto text-green-600 mb-4"
            />

            <h2 className="text-2xl font-bold">
              No Booking History Available
            </h2>

            <p className="text-gray-500 mt-3">
              Your cancelled or completed bookings will appear here.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-6">

            {history.map((booking) => (

              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
              >

                <div className="flex justify-between items-center">

                  <h2 className="text-2xl font-bold text-green-700">
                    {booking.stationName}
                  </h2>

                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {booking.status || "Cancelled"}
                  </span>

                </div>

                <div className="mt-5 space-y-3">

                  <p className="flex items-center gap-3">
                    <FaCalendarAlt className="text-green-600" />
                    <span>
                      <b>Date :</b>{" "}
                      {booking.bookingDate || "--"}
                    </span>
                  </p>

                  <p className="flex items-center gap-3">
                    <FaClock className="text-blue-600" />
                    <span>
                      <b>Time :</b>{" "}
                      {booking.bookingSlot || "--"}
                    </span>
                  </p>

                  <p className="flex items-center gap-3">
                    <FaCar className="text-red-500" />
                    <span>
                      <b>Vehicle :</b>{" "}
                      {booking.vehicleNumber || "--"}
                    </span>
                  </p>

                  <p className="flex items-center gap-3">
                    <FaPlug className="text-yellow-500" />
                    <span>
                      <b>Connector :</b>{" "}
                      {booking.connector || "--"}
                    </span>
                  </p>

                  <p className="flex items-center gap-3">
                    ⏱
                    <span>
                      <b>Duration :</b>{" "}
                      {booking.duration || "--"} mins
                    </span>
                  </p>

                  <p className="flex items-center gap-3">
                    <FaMoneyBillWave className="text-green-600" />
                    <span>
                      <b>Estimated Cost :</b> ₹
                      {booking.estimatedPrice || 0}
                    </span>
                  </p>

                  <p className="text-sm text-gray-500">
                    Cancelled At :{" "}
                    {booking.cancelledAt || "--"}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}