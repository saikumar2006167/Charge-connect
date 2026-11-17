import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  FaUserCircle,
  FaBolt,
  FaHeart,
  FaCar,
  FaGift,
  FaBook,
  FaHistory,
  FaBell,
  FaCog,
  FaQuestionCircle,
  FaChevronRight,
  FaSignOutAlt,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { FaWallet } from "react-icons/fa";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();

  const user = auth.currentUser;

  const [bookingCount, setBookingCount] = useState(0);
const [favouriteCount, setFavouriteCount] = useState(0);
const [vehicleCount, setVehicleCount] = useState(0);
const [rewardPoints, setRewardPoints] = useState(0);
const [paymentCount, setPaymentCount] = useState(0);
const [userData, setUserData] = useState(null);

async function loadUserProfile() {
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      setUserData(userDoc.data());
    }
  } catch (err) {
    console.log(err);
  }
}

useEffect(() => {
  if (user) {
    loadCounts();
    loadUserProfile();
  }
}, [user]);

const loadCounts = async () => {
  try {
    // Bookings
const bookingSnapshot = await getDocs(
  query(
    collection(db, "bookings"),
    where("uid", "==", user.uid)
  )
);

setBookingCount(bookingSnapshot.size);


    const paymentSnapshot = await getDocs(
  query(
    collection(db, "bookings"),
    where("uid", "==", user.uid),
    where("paymentStatus", "==", "Paid")
  )
);

setPaymentCount(paymentSnapshot.size);
    // Favourites
   const favouriteSnapshot = await getDocs(
  query(
    collection(db, "favorites"),
    where("uid", "==", user.uid)
  )
);

setFavouriteCount(favouriteSnapshot.size);



    // Vehicles
    const vehicleSnapshot = await getDocs(
      query(
        collection(db, "vehicles"),
        where("uid", "==", user.uid)
      )
    );

    setVehicleCount(vehicleSnapshot.size);

    // Reward Points
    setRewardPoints(bookingSnapshot.size * 10);

  } catch (err) {
    console.log(err);
  }
};

  const logout = async () => {
    try {
      await signOut(auth);
      alert("Logged out Successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Logout Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">

      <div className="max-w-5xl mx-auto">

        {/* Profile Header */}

        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl shadow-xl p-8 text-white">

          <div className="flex flex-col md:flex-row items-center gap-6">

            <FaUserCircle
              size={110}
              className="bg-white rounded-full text-green-600 p-2"
            />

            <div className="flex-1">

             <h1 className="text-4xl font-bold">
  {userData?.fullName || "ChargeConnect User"}
</h1>

<p className="mt-2 text-lg">
  {userData?.email}
</p>

<p className="mt-1 opacity-90">
  📞 {userData?.mobile}
</p>

              <p className="mt-2 opacity-90">
                UID : {user?.uid}
              </p>

            </div>

            <button
  onClick={() => navigate("/edit-profile")}
  className="bg-white text-green-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100"
>
  Edit Profile
</button>

          </div>

        </div>

        {/* Dashboard Cards */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-8">

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <FaBolt className="mx-auto text-green-600" size={34} />
            <h2 className="text-3xl font-bold mt-3">{bookingCount}</h2>
            <p className="text-gray-500">Bookings</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <FaHeart className="mx-auto text-red-500" size={34} />
            <h2 className="text-3xl font-bold mt-3">{favouriteCount}</h2>
            <p className="text-gray-500">Favorites</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <FaCar className="mx-auto text-blue-600" size={34} />
            <h2 className="text-3xl font-bold mt-3">{vehicleCount}</h2>
            <p className="text-gray-500">Vehicles</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <FaGift className="mx-auto text-yellow-500" size={34} />
            <h2 className="text-3xl font-bold mt-3">{rewardPoints}</h2>
            <p className="text-gray-500">Reward Points</p>
          </div>

        </div>

        {/* Menu */}

        <div className="bg-white rounded-3xl shadow-xl mt-8 overflow-hidden">
          <button
            onClick={() => navigate("/my-bookings")}
            className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 border-b"
          >
            <div className="flex items-center gap-4">
              <FaBook className="text-green-600 text-xl" />
              <span className="font-medium">My Bookings</span>
            </div>
            <FaChevronRight />
          </button>

          <button
            onClick={() => navigate("/history")}
            className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 border-b"
          >
            <div className="flex items-center gap-4">
              <FaHistory className="text-blue-600 text-xl" />
              <span className="font-medium">Booking History</span>
            </div>
            <FaChevronRight />
          </button>

        <button
  onClick={() => navigate("/favourites")}
  className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 border-b"
>
  <div className="flex items-center gap-4">
    <FaHeart className="text-pink-600 text-xl" />
    <span className="font-medium">
      Favourite Stations
    </span>
  </div>

  <FaChevronRight />
</button>

          <button
          onClick={() => navigate("/my-vehicles")}
            className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 border-b"
          >
            <div className="flex items-center gap-4">
              <FaCar className="text-purple-600 text-xl" />
              <span className="font-medium">My Vehicles</span>
            </div>
            <FaChevronRight />
          </button>

          <button
  onClick={() => navigate("/payment-history")}
  className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 border-b"
>
  <div className="flex items-center gap-4">
    <FaWallet className="text-green-600 text-xl" />
    <div className="text-left">
      <span className="font-medium block">
        Payment History
      </span>
      <span className="text-sm text-gray-500">
        {paymentCount} Successful Payments
      </span>
    </div>
  </div>

  <FaChevronRight />
</button> 
  

          <button
            onClick={() => navigate("/notifications")}
            className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 border-b"
          >
            <div className="flex items-center gap-4">
              <FaBell className="text-yellow-500 text-xl" />
              <span className="font-medium">Notifications</span>
            </div>
            <FaChevronRight />
          </button>

          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 border-b"
          >
            <div className="flex items-center gap-4">
              <FaCog className="text-gray-600 text-xl" />
              <span className="font-medium">Settings</span>
            </div>
            <FaChevronRight />
          </button>

          <button
  onClick={() => navigate("/contact")}
  className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 border-b"
>
  <div className="flex items-center gap-4">
    <FaQuestionCircle className="text-indigo-600 text-xl" />
    <span className="font-medium">
      Help & Support
    </span>
  </div>

  <FaChevronRight />
</button>
        </div>

        <button
          onClick={logout}
          className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl flex justify-center items-center gap-3 text-lg font-semibold shadow-lg"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </div>
  );
}