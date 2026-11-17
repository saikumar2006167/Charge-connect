import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ChangeMapCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position, map]);

  return null;
}

export default function EVMap({ userLocation, stations, routeGeoJson, }) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[700px] rounded-2xl overflow-hidden shadow-xl bg-white">
      <MapContainer
        center={userLocation}
        zoom={13}
        className="w-full h-full"
      >
        <ChangeMapCenter position={userLocation} />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Current User Location */}
        <Marker position={userLocation}>
          <Popup>
            <b>📍 Your Current Location</b>
          </Popup>
        </Marker>
        {routeGeoJson && (
  <Polyline
    positions={routeGeoJson.features[0].geometry.coordinates.map(
      ([lng, lat]) => [lat, lng]
    )}
    pathOptions={{
      color: "#2563eb",
      weight: 6,
    }}
  />
)}

        {/* EV Stations */}
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
          >
            <Popup>
              <div className="space-y-2 min-w-[220px]">
                <h3 className="text-lg font-bold text-green-700">
                  {station.name}
                </h3>

                <p>📍 {station.address}</p>

                <p>🔌 Charger Type: {station.chargerType}</p>

                <p>⚡ Chargers: {station.chargers}</p>

                <p>
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

                <div className="flex gap-2 pt-2">
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
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}