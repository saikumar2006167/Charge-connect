import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUserEdit,
  FaSave,
} from "react-icons/fa";

export default function EditProfile() {
  const navigate = useNavigate();

  const auth = getAuth();

  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);

        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();

          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setMobile(data.mobile || "");
          setEmail(data.email || "");
        }
      } catch (err) {
        console.log(err);
        alert("Unable to load profile");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  async function saveProfile() {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login again.");
      return;
    }

    if (!firstName.trim()) {
      alert("Enter First Name");
      return;
    }

    if (!lastName.trim()) {
      alert("Enter Last Name");
      return;
    }

    if (mobile.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        mobile,
      });

      alert("Profile Updated Successfully ✅");

      navigate("/profile");
    } catch (err) {
      console.log(err);
      alert("Unable to update profile");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">

      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <div className="flex items-center gap-4 mb-8">

          <button
            onClick={() => navigate("/profile")}
            className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200"
          >
            <FaArrowLeft />
          </button>

          <h1 className="text-3xl font-bold text-green-600 flex items-center gap-3">
            <FaUserEdit />
            Edit Profile
          </h1>

        </div>

        <label className="font-semibold">
          First Name
        </label>

        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full border rounded-xl p-3 mt-2 mb-5"
        />

        <label className="font-semibold">
          Last Name
        </label>

        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full border rounded-xl p-3 mt-2 mb-5"
        />

        <label className="font-semibold">
          Mobile Number
        </label>

        <input
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full border rounded-xl p-3 mt-2 mb-5"
        />

        <label className="font-semibold">
          Email
        </label>

        <input
          type="email"
          value={email}
          disabled
          className="w-full border rounded-xl p-3 mt-2 mb-8 bg-gray-100"
        />

        <button
          onClick={saveProfile}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl flex justify-center items-center gap-3 text-lg font-semibold"
        >
          <FaSave />
          Save Changes
        </button>

      </div>

    </div>
  );
}