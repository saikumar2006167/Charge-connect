import axios from "axios";

const API = "https://charge-connect.onrender.com/emergency";

export async function requestEmergency(data) {
  const res = await axios.post(`${API}/request`, data);
  return res.data;
}