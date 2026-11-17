const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./config/chargeconnect-8e36f-firebase-adminsdk-fbsvc-5f33d8a999.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

module.exports = db;
