import axios from "axios";

const API = "https://charge-connect.onrender.com";

export const getStations = async () => {
  const res = await axios.get(`${API}/stations`);
  return res.data;
};