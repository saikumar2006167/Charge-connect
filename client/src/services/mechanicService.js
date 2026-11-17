import axios from "axios";

const API = "http://localhost:5000/mechanics";

export async function getMechanics() {
  const res = await axios.get(API);
  return res.data;
}