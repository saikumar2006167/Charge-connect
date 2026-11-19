import { useState } from "react";
import { FaAmbulance, FaFireExtinguisher } from "react-icons/fa";
import { FaLocationDot, FaTruckMedical } from "react-icons/fa6";

export default function Emergency() {
  const [service, setService] = useState("Tow Vehicle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Location is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          reject(
            new Error(
              "Unable to get your location. Please allow location permission."
            )
          );
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Please enter your emergency message.");
      return;
    }

    try {
      setLoading(true);

      const location = await getCurrentLocation();

      const requestData = {
        userId: localStorage.getItem("userId") || "",
        userName: localStorage.getItem("userName") || "ChargeConnect User",
        userEmail: localStorage.getItem("userEmail") || "",
        userMobile: localStorage.getItem("userMobile") || "",

        stationId: localStorage.getItem("stationId") || "",
        stationName: localStorage.getItem("stationName") || "",

        ownerName: localStorage.getItem("ownerName") || "",
        ownerMobile: localStorage.getItem("ownerMobile") || "",

        service: service,

        latitude: location.latitude,
        longitude: location.longitude,

        message: message.trim(),
      };

      const response = await fetch(
        "https://charge-connect.onrender.com/emergency/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Emergency request submitted successfully.");

        setMessage("");
        setService("Tow Vehicle");
      } else {
        alert(data.message || "Unable to submit emergency request.");
      }
    } catch (error) {
      console.error("Emergency Request Error:", error);
      alert("Unable to send request. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const callFire = () => {
    const ok = window.confirm("Call Fire Department (101)?");

    if (ok) {
      window.location.href = "tel:101";
    }
  };

  const callAmbulance = () => {
    const ok = window.confirm("Call Ambulance (108)?");

    if (ok) {
      window.location.href = "tel:108";
    }
  };

  return (
    <div className="min-h-screen bg-red-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">

          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🚨</div>

            <h1 className="text-3xl md:text-4xl font-bold text-red-600">
              Emergency Assistance
            </h1>

            <p className="text-gray-600 mt-3">
              Request emergency assistance when you need immediate help.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Service */}
            <label className="block font-semibold text-gray-700 mb-2">
              Emergency Service
            </label>

            <div className="relative mb-6">

              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-gray-700 bg-white outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="Tow Vehicle">
                  🚚 Tow Vehicle
                </option>

                <option value="EV Mechanic">
                  🔧 EV Mechanic
                </option>

                <option value="Fire Department">
                  🚒 Fire Department
                </option>

                <option value="Ambulance">
                  🚑 Ambulance
                </option>
              </select>

            </div>

            {/* Message */}
            <label className="block font-semibold text-gray-700 mb-2">
              Describe Your Emergency
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what happened and what help you need..."
              rows="5"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 resize-none outline-none focus:ring-2 focus:ring-red-400 mb-6"
            />

            {/* Location */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex gap-3">
              <FaLocationDot className="text-red-600 text-xl mt-1" />

              <div>
                <p className="font-semibold text-red-700">
                  Current Location
                </p>

                <p className="text-sm text-gray-600">
                  Your current GPS location will be shared with the emergency
                  request.
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-semibold text-lg transition"
            >
              {loading ? "Sending Request..." : "Submit Emergency Request"}
            </button>

          </form>

          {/* Quick Calls */}
          <div className="border-t mt-8 pt-8">

            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Quick Emergency Calls
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <button
                onClick={callFire}
                className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl flex justify-center items-center gap-3 font-semibold"
              >
                <FaFireExtinguisher />
                Call Fire Department (101)
              </button>

              <button
                onClick={callAmbulance}
                className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl flex justify-center items-center gap-3 font-semibold"
              >
                <FaAmbulance />
                Call Ambulance (108)
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}