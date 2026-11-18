import axios from "axios";

const API = "https://charge-connect.onrender.com/auth";

export async function sendOTP(email) {
  const res = await axios.post(`${API}/send-otp`, {
    email,
  });

  return res.data;
}

export async function verifyOTP(email, otp) {
  const res = await axios.post(`${API}/verify-otp`, {
    email,
    otp,
  });

  return res.data;
}