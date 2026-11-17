import { FaLocationDot } from "react-icons/fa6";
import { FaRoute } from "react-icons/fa";

export default function RoutePlanner({
  from,
  to,
  searchFrom,
  searchTo,
  handleRoute,

  fromSuggestions,
  toSuggestions,

  setFrom,
  setTo,

  setFromCoords,
  setToCoords,

  setFromSuggestions,
  setToSuggestions,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">

      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Route Planner
      </h2>

      {/* FROM */}

      <div className="mb-5 relative">

        <label className="font-semibold block mb-2 text-gray-700">
          From
        </label>

        <div className="flex items-center border border-gray-300 rounded-xl px-3 bg-white">

          <FaLocationDot className="text-green-600 mr-2" />

          <input
            type="text"
            className="w-full p-3 outline-none bg-white text-black placeholder-gray-500"
            placeholder="Enter Starting Place"
            value={from}
            onChange={(e) => searchFrom(e.target.value)}
          />

        </div>

        {fromSuggestions?.length > 0 && (

          <div className="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-2xl">

            {fromSuggestions.map((item, index) => (

              <div
                key={index}
                className="px-4 py-3 text-black hover:bg-green-100 hover:text-green-700 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                onClick={() => {
                  setFrom(item.properties.label);
                  setFromCoords(item.geometry.coordinates);
                  setFromSuggestions([]);
                }}
              >
                {item.properties.label}
              </div>

            ))}

          </div>

        )}

      </div>

      {/* TO */}

      <div className="mb-6 relative">

        <label className="font-semibold block mb-2 text-gray-700">
          To
        </label>

        <div className="flex items-center border border-gray-300 rounded-xl px-3 bg-white">

          <FaLocationDot className="text-red-500 mr-2" />

          <input
            type="text"
            className="w-full p-3 outline-none bg-white text-black placeholder-gray-500"
            placeholder="Enter Destination"
            value={to}
            onChange={(e) => searchTo(e.target.value)}
          />

        </div>

        {toSuggestions?.length > 0 && (

          <div className="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-2xl">

            {toSuggestions.map((item, index) => (

              <div
                key={index}
                className="px-4 py-3 text-black hover:bg-green-100 hover:text-green-700 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                onClick={() => {
                  setTo(item.properties.label);
                  setToCoords(item.geometry.coordinates);
                  setToSuggestions([]);
                }}
              >
                {item.properties.label}
              </div>

            ))}

          </div>

        )}

      </div>

      <button
        onClick={handleRoute}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition"
      >
        <FaRoute />
        Find Route
      </button>

    </div>
  );
}