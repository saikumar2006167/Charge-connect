import { useState } from "react";

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");

  return (
    <div className="flex justify-center gap-3 p-5">
      <input
        type="text"
        placeholder="Enter City Name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="border rounded-lg px-4 py-2 w-80"
      />

      <button
        onClick={() => onSearch(city)}
        className="bg-green-600 text-white px-5 py-2 rounded-lg"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;