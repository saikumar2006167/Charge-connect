import axios from "axios";

const API = "http://localhost:5000/emergency";

export async function requestEmergency(data) {
  const res = await axios.post(`${API}/request`, data);
  return res.data;
}