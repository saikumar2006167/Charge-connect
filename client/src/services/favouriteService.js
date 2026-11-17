import axios from "axios";

const API = "http://localhost:5000/favourites";

export const addFavourite = async (data) => {
  const res = await axios.post(API, data);
  return res.data;
};

export const getFavourites = async (email) => {
  const res = await axios.get(`${API}/${email}`);
  return res.data;
};

export const deleteFavourite = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};