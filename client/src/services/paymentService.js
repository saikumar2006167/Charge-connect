import axios from "axios";

const API = "https://charge-connect.onrender.com/payment";

export async function createOrder(amount) {
  const res = await axios.post(`${API}/create-order`, {
    amount,
  });

  return res.data;
}

export async function verifyPayment(paymentData) {
  const res = await axios.post(
    `${API}/verify-payment`,
    paymentData
  );

  return res.data;
}