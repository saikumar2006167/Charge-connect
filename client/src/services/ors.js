import axios from "axios";

const API_KEY = import.meta.env.VITE_ORS_API_KEY;

console.log("API Key:", API_KEY);

const BASE_URL = "https://api.openrouteservice.org";

export async function searchPlace(text) {
  const res = await axios.get(
    `${BASE_URL}/geocode/search`,
    {
      params: {
        api_key: API_KEY,
        text,
        size: 5,
      },
    }
  );

  return res.data.features;
}

export async function getRoute(start, end) {
  const res = await axios.post(
    `${BASE_URL}/v2/directions/driving-car/geojson`,
    {
      coordinates: [start, end],
    },
    {
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}