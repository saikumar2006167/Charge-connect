import axios from "axios";

const API = "http://localhost:5000";

export const getStations = async () => {
  const res = await axios.get(`${API}/stations`);
  return res.data;
};