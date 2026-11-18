import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import RoutePlanner from "./routeplanner";
import RouteStations from "./routestations";
import RouteStats from "./routestats";
import EVMap from "./evmap";

import { searchPlace, getRoute } from "../services/ors";
import * as turf from "@turf/turf";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapView() {
  const [stations, setStations] = useState([]);

  const [userLocation, setUserLocation] = useState([
    17.4375,
    78.4483,
  ]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [distance, setDistance] = useState("--");
  const [duration, setDuration] = useState("--");

  const [routeStations, setRouteStations] = useState([]);

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);

  const [routeGeoJson, setRouteGeoJson] = useState(null);

  useEffect(() => {
    loadStations();
    getCurrentLocation();
  }, []);

  async function loadStations() {
    try {
      const querySnapshot = await getDocs(collection(db, "stations"));

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStations(data);
    } catch (err) {
      console.log(err);
    }
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([
          pos.coords.latitude,
          pos.coords.longitude,
        ]);
      },
      (err) => console.log(err),
      {
        enableHighAccuracy: true,
      }
    );
  }

  async function searchFrom(text) {
    setFrom(text);

    if (text.length < 3) {
      setFromSuggestions([]);
      return;
    }

    try {
      const result = await searchPlace(text);
      setFromSuggestions(result);
    } catch (err) {
      console.log(err);
    }
  }

  async function searchTo(text) {
    setTo(text);

    if (text.length < 3) {
      setToSuggestions([]);
      return;
    }

    try {
      const result = await searchPlace(text);
      setToSuggestions(result);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleRoute() {
    if (!fromCoords || !toCoords) {
      alert("Select places from suggestions.");
      return;
    }

    console.log("From Coords:", fromCoords);
console.log("To Coords:", toCoords);

    try {
      const route = await getRoute(fromCoords, toCoords);

      setRouteGeoJson(route);

      const summary =
        route.features[0].properties.summary;

      setDistance(
        (summary.distance / 1000).toFixed(1) + " km"
      );

      setDuration(
        Math.round(summary.duration / 60) + " mins"
      );

      // Temporary
      const routePoints =
  route.features[0].geometry.coordinates;

// Create LineString from route
const line = turf.lineString(
  route.features[0].geometry.coordinates
);

// Create 5 km buffer around route
const buffer = turf.buffer(line, 5, {
  units: "kilometers",
});

// Filter stations inside buffer
const filtered = stations.filter((station) => {
  const point = turf.point([
    station.longitude,
    station.latitude,
  ]);

  return booleanPointInPolygon(point, buffer);
});

console.log("Stations on Route:", filtered);

setRouteStations(filtered);

setRouteStations(filtered);

    } catch (err) {
  console.error("Route Error:", err);

  if (err.response) {
    console.log(err.response.data);
  }

  alert("Unable to calculate route.");
}
  }
    return (
    <div className="bg-gray-100 px-6 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">

            <RoutePlanner
              from={from}
              to={to}
              setFrom={setFrom}
              setTo={setTo}
              handleRoute={handleRoute}
              searchFrom={searchFrom}
              searchTo={searchTo}
              fromSuggestions={fromSuggestions}
              toSuggestions={toSuggestions}
              setFromSuggestions={setFromSuggestions}
              setToSuggestions={setToSuggestions}
              setFromCoords={setFromCoords}
              setToCoords={setToCoords}
            />

            <RouteStats
              distance={distance}
              duration={duration}
              stops={routeStations.length}
            />

            <RouteStations
              stations={routeStations}
            />

          </div>
        </div>

        {/* Right Map */}
        <div className="lg:col-span-8">
          <EVMap
            userLocation={userLocation}
            stations={stations}
            routeGeoJson={routeGeoJson}
          />
        </div>

      </div>
    </div>
  );
}