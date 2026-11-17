import { useEffect, useState } from "react";
import { getMechanics } from "../services/mechanicService";

import {
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaTools,
  FaMapMarkedAlt,
} from "react-icons/fa";

export default function EVMechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [filteredMechanics, setFilteredMechanics] = useState([]);

  const [searchCity, setSearchCity] = useState("");
  const [searchService, setSearchService] = useState("");

  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    loadMechanics();
  }, []);

  useEffect(() => {
    filterMechanics();
  }, [
    mechanics,
    searchCity,
    searchService,
    onlyAvailable,
  ]);

  async function loadMechanics() {
    try {
      const data = await getMechanics();

      setMechanics(data);
      setFilteredMechanics(data);
    } catch (err) {
      console.log(err);
    }
  }
  function filterMechanics() {
  let data = [...mechanics];

  // Search by City
  if (searchCity.trim() !== "") {
    data = data.filter((m) =>
      m.city?.toLowerCase().includes(searchCity.toLowerCase())
    );
  }

  // Search by Service
  if (searchService.trim() !== "") {
    data = data.filter((m) =>
      m.services?.toLowerCase().includes(searchService.toLowerCase())
    );
  }

  // Available Only
  if (onlyAvailable) {
    data = data.filter((m) => m.available === true);
  }

  setFilteredMechanics(data);
}

// User Current Location
function getCurrentLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      alert("Current Location Detected ✅");
    },
    () => {
      alert("Unable to fetch your location");
    }
  );
}

// Distance Calculation (KM)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c).toFixed(1);
}
return (
  <div className="min-h-screen bg-gray-100 py-10">

    <div className="max-w-7xl mx-auto px-6">

      <h1 className="text-4xl font-bold text-green-700 mb-8 flex items-center gap-3">
        <FaTools />
        EV Mechanics
      </h1>

      {/* Search Section */}

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Search City */}

          <div className="relative">

            <FaSearch className="absolute left-3 top-4 text-gray-500" />

            <input
              type="text"
              placeholder="Search by City"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full border rounded-xl pl-10 pr-4 py-3"
            />

          </div>

          {/* Search Service */}

          <div className="relative">

            <FaFilter className="absolute left-3 top-4 text-gray-500" />

            <input
              type="text"
              placeholder="Battery / Motor / Tyre"
              value={searchService}
              onChange={(e) => setSearchService(e.target.value)}
              className="w-full border rounded-xl pl-10 pr-4 py-3"
            />

          </div>

          {/* Available Toggle */}

          <label className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-3 cursor-pointer">

            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) =>
                setOnlyAvailable(e.target.checked)
              }
            />

            Available Only

          </label>

          {/* Near Me */}

          <button
            onClick={getCurrentLocation}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 flex justify-center items-center gap-2"
          >
            <FaMapMarkedAlt />
            Near Me
          </button>

        </div>

      </div>

      {/* Mechanics Grid */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredMechanics.length === 0 ? (

          <div className="col-span-full bg-white rounded-2xl shadow-lg p-10 text-center">

            <h2 className="text-2xl font-bold">
              No Mechanics Found
            </h2>

            <p className="text-gray-500 mt-3">
              Try another city or service.
            </p>

          </div>

        ) : (

          filteredMechanics.map((m) => (

  <div
    key={m.id}
    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden"
  >

    {/* Image */}

    <img
      src={
        m.image ||
        "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=800"
      }
      alt={m.shopName}
      className="w-full h-52 object-cover"
    />

    <div className="p-6">

      <h2 className="text-2xl font-bold text-green-700">
        {m.shopName}
      </h2>

      <p className="mt-2 font-semibold">
        👨‍🔧 {m.name}
      </p>

      <p className="mt-2">
        📍 {m.address}
      </p>

      <p>
        🏙️ {m.city}
      </p>

      <p>
        ⭐ {m.rating} / 5
      </p>

      <p>
        💼 {m.experience}
      </p>

      <p className="mt-2">
        🔧 {m.services}
      </p>

      {userLocation && (
        <p className="mt-2 text-green-700 font-semibold">
          📏 Distance :
          {" "}
          {calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            m.latitude,
            m.longitude
          )}
          {" "}KM
        </p>
      )}

      <div className="mt-3">

        {m.available ? (

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
            🟢 Available
          </span>

        ) : (

          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
            🔴 Busy
          </span>

        )}

      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">

        <a
          href={`tel:${m.mobile}`}
          className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-center flex justify-center items-center gap-2"
        >
          <FaPhone />
          Call
        </a>

        <a
          href={`https://wa.me/91${m.mobile}`}
          target="_blank"
          rel="noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-center flex justify-center items-center gap-2"
        >
          <FaWhatsapp />
          WhatsApp
        </a>

      </div>

      <button
        onClick={() =>
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${m.latitude},${m.longitude}`
          )
        }
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
      >
        🗺️ Get Directions
      </button>

    </div>

  </div>

))
          

        )}

      </div>

    </div>

  </div>
);
}