import { FaRoad, FaClock, FaChargingStation } from "react-icons/fa";

export default function RouteStats({
  distance = "--",
  duration = "--",
  stops = 0,
}) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">

      {/* Distance */}
      <div className="bg-green-50 rounded-2xl shadow-md p-4 text-center">
        <FaRoad className="text-green-600 text-3xl mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Distance</p>
        <h3 className="text-xl font-bold text-green-700">
          {distance}
        </h3>
      </div>

      {/* Duration */}
      <div className="bg-blue-50 rounded-2xl shadow-md p-4 text-center">
        <FaClock className="text-blue-600 text-3xl mx-auto mb-2" />
        <p className="text-gray-500 text-sm">ETA</p>
        <h3 className="text-xl font-bold text-blue-700">
          {duration}
        </h3>
      </div>

      {/* Charging Stops */}
      <div className="bg-yellow-50 rounded-2xl shadow-md p-4 text-center">
        <FaChargingStation className="text-yellow-600 text-3xl mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Stations</p>
        <h3 className="text-xl font-bold text-yellow-600">
          {stops}
        </h3>
      </div>

    </div>
  );
}