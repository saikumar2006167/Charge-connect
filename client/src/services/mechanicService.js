import axios from "axios";

const API = "https://charge-connect.onrender.com/mechanics";

export async function getMechanics() {
  const res = await axios.get(API);
  return res.data;
}