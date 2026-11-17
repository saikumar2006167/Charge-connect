import { useEffect, useState } from "react";
import { addFavourite } from "../services/favouriteService";
import { getStations } from "../services/stationService";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { FaHeart } from "react-icons/fa";

export default function Stations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const auth = getAuth();

  // ============================
  // LOAD APPROVED STATIONS
useEffect(() => {
  const loadStations = async () => {
    try {
      setLoading(true);

      const data = await getStations();

      console.log("🔥 STATIONS FROM BACKEND:", data);

      // IMPORTANT:
      // Existing + new stations sab show karo
      setStations(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("❌ Stations Loading Error:", error);
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  loadStations();
}, []);  // ====

  // ============================
  // ADD FAVOURITE
  // ============================
  async function handleAddFavourite(station) {
    console.log("Favourite clicked");

    try {
      const user = auth.currentUser;

      if (!user) {
        alert("Please login first.");
        return;
      }

      const payload = {
        uid: user.uid,
        userEmail: user.email,
        userName: user.displayName || "",

        stationId: station.id,
        name: station.name,
        address: station.address,
        city: station.city,

        chargerType:
          station.chargerType ||
          station.chargertype ||
          station.connectorType ||
          station.ChargerType ||
          station.chargerstype,

        chargers: station.chargers,
        available: station.available,

        latitude: station.latitude,
        longitude: station.longitude,

        ownerId: station.ownerId || "",
        ownerName: station.ownerName || "",
        ownerEmail: station.ownerEmail || "",
        ownerMobile: station.ownerMobile || "",

        createdAt: new Date().toLocaleString(),
      };

      console.log("Favourite Payload:", payload);

      const response = await addFavourite(payload);

      console.log("Favourite Response:", response);

      alert("❤️ Added to favourites");
    } catch (error) {
      console.error("Add Favourite Error:", error);
      alert(error.message || "Failed to add favourite");
    }
  }

  // ============================
  // LOADING
  // ============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow text-center">
          <div className="text-4xl mb-3">⚡</div>

          <h2 className="text-xl font-bold">
            Loading Charging Stations...
          </h2>

          <p className="text-gray-500 mt-2">
            Finding approved EV charging stations.
          </p>
        </div>
      </div>
    );
  }

  // ============================
  // UI
  // ============================
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            EV Charging Stations
          </h1>

          <p className="text-gray-500 mt-2">
            Book from approved and currently available charging stations.
          </p>
        </div>

        {/* NO STATIONS */}
        {stations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <div className="text-5xl mb-4">
              ⚡
            </div>

            <h2 className="text-2xl font-bold text-gray-700">
              No Approved Stations Available
            </h2>

            <p className="text-gray-500 mt-2">
              Approved charging stations will appear here once they are
              activated by the administrator.
            </p>

          </div>
        ) : (

          /* STATION CARDS */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {stations.map((station) => (

              <div
                key={station.id}
                className="bg-white border rounded-2xl shadow-md p-5 hover:shadow-xl transition"
              >

                {/* STATION NAME */}
                <h2 className="text-xl font-bold text-gray-800">
                  {station.name || station.stationName}
                </h2>

                {/* ADDRESS */}
                <p className="text-gray-600 mt-2">
                  📍 {station.address || "Address not available"}
                </p>

                {/* CITY */}
                <p className="mt-1">
                  🏙️ City:{" "}
                  {station.city || "Not available"}
                </p>

                {/* OWNER */}
                {station.ownerName && (
                  <p className="mt-1 text-sm text-gray-600">
                    👤 Owner: {station.ownerName}
                  </p>
                )}

                {/* CHARGER */}
                <p className="mt-2">
                  🔌 Charger:{" "}
                  {station.chargertype ||
                    station.chargerType ||
                    station.connectorType ||
                    "Not specified"}
                </p>

                {/* CHARGERS */}
                <p className="mt-1">
                  ⚡ Chargers:{" "}
                  {station.chargers || "Available"}
                </p>

                {/* PRICE */}
                {station.price !== undefined && (
                  <p className="mt-1 font-semibold text-green-700">
                    💰 ₹{station.price}
                  </p>
                )}

                {/* APPROVAL STATUS */}
                <p className="mt-2 text-sm">
                  Approval:{" "}
                  <span className="text-green-600 font-semibold">
                    ✓ Approved
                  </span>
                </p>

                {/* AVAILABLE STATUS */}
                <p className="mt-1">
                  Status:{" "}
                  <span className="text-green-600 font-semibold">
                    🟢 Available
                  </span>
                </p>

                {/* FAVOURITE */}
                <button
                  onClick={() =>
                    handleAddFavourite(station)
                  }
                  className="mt-5 w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg flex justify-center items-center gap-2 transition"
                >
                  <FaHeart />
                  Favourite
                </button>

                {/* BOOK */}
                <button
                  onClick={() =>
                    navigate("/booking", {
                      state: {
                        station: {
                          ...station,
                          name:
                            station.name ||
                            station.stationName,
                          connectorType:
                            station.connectorType ||
                            station.chargertype ||
                            station.chargerType,
                        },
                      },
                    })
                  }
                  className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  ⚡ Book Now
                </button>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
}