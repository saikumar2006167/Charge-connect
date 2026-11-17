import { FaChargingStation, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function RouteStations({ stations = [] }) {
  const navigate = useNavigate();

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-lg p-5 flex flex-col">
      {/* Heading */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        ⚡ Stations On Route
      </h2>

      {/* Empty State */}
      {stations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center text-gray-500">
          <div>
            <p className="text-lg font-semibold">
              No Route Selected
            </p>

            <p className="text-sm mt-2">
              Search a route to view charging stations.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">

          {stations.map((station) => (
            <div
              key={station.id}
              className="bg-white border rounded-xl shadow-sm p-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between">

                <div>

                  <h3 className="text-lg font-bold text-green-700">
                    {station.name}
                  </h3>

                  <p className="flex items-center gap-2 text-gray-600 mt-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    {station.address}
                  </p>

                  <p className="mt-2">
                    🔌 Charger Type :
                    <b> {station.chargerType || "DC Fast"}</b>
                  </p>

                  <p>
                    ⚡ Chargers :
                    <b> {station.chargers}</b>
                  </p>

                  <p className="mt-2">
                    {station.available ? (
                      <span className="text-green-600 font-semibold">
                        ✅ Available
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        ❌ Busy
                      </span>
                    )}
                  </p>
                  <div className="flex gap-2 mt-4">

  <a
    href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex-1"
  >
    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
      Directions
    </button>
  </a>

  <button
    onClick={() =>
      navigate("/booking", {
        state: { station },
      })
    }
    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
  >
    Book Now
  </button>

</div>


                </div>

                <FaChargingStation
                  size={34}
                  className="text-green-600"
                />

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}