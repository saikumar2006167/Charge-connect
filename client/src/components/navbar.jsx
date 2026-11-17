import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

function Navbar() {
 const [notificationCount, setNotificationCount] = useState(0);

const auth = getAuth();

useEffect(() => {
  const user = auth.currentUser;

  if (!user) return;

  const q = query(
    collection(db, "notifications"),
    where("uid", "==", user.uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    setNotificationCount(snapshot.size);
  });

  return () => unsubscribe();
}, []);

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="ChargeConnect Logo"
            className="w-12 h-12 rounded-full object-cover"
          />

          <h1 className="text-2xl font-bold text-white">
            Charge<span className="text-green-500">Connect</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="hover:text-green-400">
            Home
          </Link>

          <Link to="/stations" className="hover:text-green-400">
            Stations
          </Link>

          <Link
  to="/owner-login"
  className="hover:text-green-600 transition"
>
  Station Owner 
</Link>

          <Link
  to="/mechanics"
  className="hover:text-green-600"
>
  EV Mechanics
</Link>

<Link to="/admin-dashboard">
  Admin Dashboard
</Link>

          <Link to="/login" className="hover:text-green-400">
            Login
          </Link>

         
          <Link to="/profile" className="hover:text-green-400">
            Profile
          </Link>

          <Link
  to="/notifications"
  className="relative hover:text-green-400"
>
  <FaBell className="text-2xl" />

  {notificationCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
      {notificationCount}
    </span>
  )}
</Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;