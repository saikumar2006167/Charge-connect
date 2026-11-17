import { useEffect, useState } from "react";
import {getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import {
  getFavourites,
  deleteFavourite,
} from "../services/favouriteService";

export default function FavouriteStations() {
  const [favorites, setFavorites] = useState([]);

  const auth = getAuth();
  const navigate = useNavigate();

    async function loadFavorites() {
  try {
    const user = auth.currentUser;

    if (!user) return;

    const data = await getFavourites(user.email);


    console.log("Backend Favourites:", data);

    setFavorites(data);
  } catch (err) {
    console.error("Favourite Error:",err);
  }
}  

  useEffect(() => {
    loadFavorites();
  }, []);

async function removeFavourite(id) {
  const ok = window.confirm(
    "Remove from favourites?"
  );

  if (!ok) return;

  try {
    await deleteFavourite(id);

    setFavorites((prev) =>
      prev.filter((f) => f.id !== id)
    );

    alert("Removed Successfully ❤️");
  } catch (err) {
    console.log(err);
    alert("Failed to remove favourite");
  }
}

    return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-pink-600 mb-8">
          ❤️ Favourite Stations
        </h1>

        {favorites.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

            <FaHeart
              size={60}
              className="mx-auto text-pink-500 mb-4"
            />

            <h2 className="text-2xl font-bold">
              No Favourite Stations
            </h2>

            <p className="text-gray-500 mt-3">
              Add your favourite charging stations.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {favorites.map((station) => (

              <div
                key={station.id}
                className="bg-white rounded-2xl shadow-lg p-6"
              >

                <h2 className="text-xl font-bold text-green-700">
                  {station.name}
                </h2>

                <p className="mt-3">
                  📍 {station.address}
                </p>

                <p>
                  🏙️ {station.city}
                </p>

                <p>
                  🔌 {station.chargerType}
                </p>

                <p>
                  ⚡ Chargers : {station.chargers}
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

                <div className="flex gap-2 mt-5">

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

                <button
                  onClick={() =>
                    removeFavourite(station.id)
                  }
                  className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg"
                >
                  ❤️ Remove Favourite
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}