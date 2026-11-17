import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCoejjdxqsWIUDZfVEuFfvJJjiWYcfRfq8",
  authDomain: "chargeconnect-8e36f.firebaseapp.com",
  projectId: "chargeconnect-8e36f",
  storageBucket: "chargeconnect-8e36f.firebasestorage.app",
  messagingSenderId: "937543293340",
  appId: "1:937543293340:web:b3f2ba6179ce8c23e69059",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);