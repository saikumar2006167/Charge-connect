import axios from "axios";

const API = "https://charge-connect.onrender.com/vehicles";

// Add Vehicle
export const addVehicle = async (data) => {
  console.log("Sending Data:", data);

  const res = await axios.post(API, data);

  return res.data;
};

// Get User Vehicles
export const getVehicles = async (uid) => {
  const res = await axios.get(`${API}/${uid}`);
  return res.data;
};

// Update Vehicle
export const updateVehicle = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
};

// Delete Vehicle
export const deleteVehicle = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};