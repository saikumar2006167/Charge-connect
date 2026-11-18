import axios from "axios";

const API = "https://charge-connect.onrender.com/bookings";

export const addBooking = async (data) => {
  const res = await axios.post(API, data);
  return res.data;
};

export const getBookings = async (email) => {
  const res = await axios.get(`${API}/${email}`);
  return res.data;
};

export const deleteBooking = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};

export const getHistory = async (email) => {
  const res = await axios.get(`${API}/history/${email}`);
  return res.data;
};