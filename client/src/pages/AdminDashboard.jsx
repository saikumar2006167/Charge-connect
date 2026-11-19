import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Foodmanagement from "../components/Foodmanagement";
import EntertainmentManagement from "./EntertainmentManagement";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { db, storage, auth } from "../firebase";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mechanics, setMechanics] = useState([]);
  const [liveMechanicsCount, setLiveMechanicsCount] = useState(0);
  const [activeMechanicsCount, setActiveMechanicsCount] = useState(0);
  const [inactiveMechanicsCount, setInactiveMechanicsCount] = useState(0);
  const [editingMechanic, setEditingMechanic] = useState(null);
  const [showMechanicForm, setShowMechanicForm] = useState(false);
  const [mechanicPhotoFile, setMechanicPhotoFile] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  const [mechanicForm, setMechanicForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    location: "",
    rating: "",
    experience: "",
    status: "Active",
    photo: "",
  });

  // ================= FETCH DASHBOARD DATA =================
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://charge-connect.onrender.com/admin/dashboard"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Failed to load dashboard"
        );
      }

      setDashboardData(data);
    } catch (err) {
      console.error("Admin Dashboard API Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
 useEffect(() => {
  const mechanicsRef = collection(db, "mechanics");

  const unsubscribe = onSnapshot(mechanicsRef, (snapshot) => {
    const liveMechanics = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setMechanics(liveMechanics);

    setLiveMechanicsCount(liveMechanics.length);

    setActiveMechanicsCount(
      liveMechanics.filter(
        (mechanic) => mechanic.status === "Active"
      ).length
    );

    setInactiveMechanicsCount(
      liveMechanics.filter(
        (mechanic) => mechanic.status !== "Active"
      ).length
    );
  });

  return () => unsubscribe();
}, []);

  // ================= ADMIN LOGIN CHECK =================
  useEffect(() => {
    const adminLoggedIn =
      localStorage.getItem("adminLoggedIn");

    const adminEmail =
      localStorage.getItem("adminEmail");

    if (
      adminLoggedIn !== "true" ||
      adminEmail !== "chargeconnectsupport@gmail.com"
    ) {
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  // ================= MENU =================
  const menuItems = [
    { name: "Food Management", icon: "🍔" },
    { name: "Entertainment", icon: "🎮" },
    { name: "Dashboard", icon: "▦" },
    { name: "Station Owners", icon: "♙" },
    { name: "Charging Stations", icon: "⚡" },
    {  name: "EV Mechanics",  icon: "🔧"},
    { name: "Bookings", icon: "▣" },
    { name: "Payments", icon: "₹" },
    { name: "Reviews", icon: "★" },
    { name: "Reports", icon: "▤" },
    { name: "Emergency", icon: "🚨" },
  ];

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");

    navigate("/admin-login");
  };
  
  // ================= FORMAT OWNER VALUE =================
  const formatOwnerValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "N/A";
    }

    if (typeof value === "object") {
      if (value._seconds) {
        return new Date(
          value._seconds * 1000
        ).toLocaleString("en-IN");
      }

      return JSON.stringify(value);
    }

    return String(value);
  };

  // ================= APPROVE OWNER =================
  const handleApproveOwner = async (ownerId) => {
    try {
      const response = await fetch(
        `https://charge-connect.onrender.com/admin/station-owners/${ownerId}/approve`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Approval failed"
        );
      }

      alert("Station owner approved successfully!");

      await fetchDashboardData();
    } catch (error) {
      console.error(
        "Station Owner Approval Error:",
        error
      );

      alert(
        error.message ||
          "Failed to approve station owner"
      );
    }
  };
  

  // ================= SAVE / UPDATE MECHANIC =================
  const handleSaveMechanic = async (e) => {
    e.preventDefault();

    if (
      !mechanicForm.name.trim() ||
      !mechanicForm.email.trim() ||
      !mechanicForm.phone.trim() ||
      !mechanicForm.specialization.trim() ||
      !mechanicForm.location.trim() ||
      mechanicForm.rating === "" ||
      !String(mechanicForm.experience).trim()
    ) {
      alert("Please fill all mechanic details");
      return;
    }

    try {
      setPhotoUploading(true);

      let photoUrl = mechanicForm.photo || "";

      // Upload selected photo to Firebase Storage
      if (mechanicPhotoFile) {
        if (mechanicPhotoFile.size > 5 * 1024 * 1024) {
          throw new Error("Photo must be less than 5MB");
        }

        const safeFileName = mechanicPhotoFile.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );

        const storagePath = `mechanics/${Date.now()}-${safeFileName}`;
        const storageRef = ref(storage, storagePath);

        await uploadBytes(storageRef, mechanicPhotoFile);
        photoUrl = await getDownloadURL(storageRef);
      }

      const mechanicData = {
        name: mechanicForm.name.trim(),
        email: mechanicForm.email.trim(),
        phone: mechanicForm.phone.trim(),
        specialization: mechanicForm.specialization.trim(),
        location: mechanicForm.location.trim(),
        rating: Number(mechanicForm.rating),
        experience: String(mechanicForm.experience).trim(),
        status: mechanicForm.status || "Active",
        photo: photoUrl,
        updatedAt: new Date().toISOString(),
      };

      // UPDATE existing mechanic directly in Firestore
      if (editingMechanic?.id) {
        const mechanicRef = doc(
          db,
          "mechanics",
          editingMechanic.id
        );

        await updateDoc(mechanicRef, mechanicData);

        alert("Mechanic updated successfully!");
      } else {
        // ADD new mechanic directly in Firestore
        await addDoc(collection(db, "mechanics"), {
          ...mechanicData,
          createdAt: new Date().toISOString(),
        });

        alert("Mechanic added successfully!");
      }

      setShowMechanicForm(false);
      setEditingMechanic(null);
      setMechanicPhotoFile(null);

      setMechanicForm({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        location: "",
        rating: "",
        experience: "",
        status: "Active",
        photo: "",
      });

      await fetchDashboardData();
    } catch (err) {
      console.error("Save/Update Mechanic Error:", err);
      alert(err.message || "Failed to save mechanic");
    } finally {
      setPhotoUploading(false);
    }
  };

  // ================= OWNER NAME =================
  const getOwnerName = (owner) => {
    return (
      owner.ownerName ||
      owner.name ||
      owner.fullName ||
      owner.userName ||
      owner.email ||
      "Station Owner"
    );
  };

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ================= ERROR ================= */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg text-sm">
          {error}
        </div>
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-30">

        {/* LOGO */}
        <div className="h-20 px-6 flex items-center border-b border-gray-100">
          <div className="w-11 h-11 bg-green-700 rounded-xl flex items-center justify-center text-white text-xl shadow-sm">
            ⚡
          </div>

          <div className="ml-3">
            <h1 className="font-bold text-gray-900 text-lg">
              ChargeConnect
            </h1>

            <p className="text-xs text-gray-500">
              Admin Panel
            </p>
          </div>
        </div>

        {/* MENU */}
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-xs uppercase text-gray-400 font-semibold px-3 mb-3">
            Main Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() =>
                  setActiveMenu(item.name)
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeMenu === item.name
                    ? "bg-green-700 text-white shadow-sm"
                    : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <span className="w-5 text-center text-base">
                  {item.icon}
                </span>

                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* SIDEBAR BOTTOM */}
        <div className="p-4 border-t border-gray-100">

          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition"
          >
            ← Back to Website
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition"
          >
            ↪ Logout
          </button>

        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 md:ml-64">

        {/* ================= TOP NAVBAR ================= */}
        <header className="h-20 bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {activeMenu}
            </h2>

            <p className="text-sm text-gray-500 hidden sm:block">
              ChargeConnect Administration
            </p>
          </div>

          <div className="flex items-center gap-4">

            <button className="relative w-10 h-10 rounded-xl bg-gray-100 hover:bg-green-50 flex items-center justify-center transition">
              🔔
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-bold shadow-sm">
                A
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  Admin
                </p>

                <p className="text-xs text-gray-500">
                  Super Administrator
                </p>
              </div>

            </div>
          </div>

        </header>

        {/* ================= CONTENT ================= */}
        <div className="p-4 md:p-8">

          {/* ================================================= */}
          {/* FOOD MANAGEMENT */}
          {/* ================================================= */}

          {activeMenu === "Food Management" ? (

            <Foodmanagement />

          ) : activeMenu === "Entertainment" ? (

            <EntertainmentManagement />

          ) : activeMenu === "Station Owners" ? (

            /* ================================================= */
            /* STATION OWNERS */
            /* ================================================= */

            <div className="space-y-6">

              {/* HEADER */}
              <div>
                <p className="text-sm text-green-700 font-semibold mb-1">
                  OWNER MANAGEMENT
                </p>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Station Owner Approvals
                </h1>

                <p className="text-gray-500 mt-1">
                  Review station owner applications and approve registered charging stations.
                </p>
              </div>

              {/* SUMMARY */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Total Owners
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {dashboardData?.owners?.length || 0}
                  </h2>
                </div>

                <div className="bg-white rounded-2xl border border-yellow-100 p-5 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Pending Approvals
                  </p>

                  <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                    {dashboardData?.stats?.pendingOwners || 0}
                  </h2>
                </div>

                <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Approved Owners
                  </p>

                  <h2 className="text-3xl font-bold text-green-600 mt-2">
                    {dashboardData?.owners?.filter(
                      (owner) =>
                        owner.approved === true ||
                        owner.status === "Approved"
                    ).length || 0}
                  </h2>
                </div>

              </div>

              {/* OWNER LIST */}
              {!dashboardData?.owners?.length ? (

                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">

                  <div className="text-5xl mb-4">
                    ♙
                  </div>

                  <h2 className="text-xl font-bold text-gray-800">
                    No Station Owner Requests
                  </h2>

                  <p className="text-gray-500 mt-2">
                    No station owner submissions are available right now.
                  </p>

                </div>

              ) : (

                <div className="space-y-6">

                  {dashboardData.owners.map((owner) => {

                    const isApproved =
                      owner.approved === true ||
                      owner.status === "Approved";

                    return (

                      <div
                        key={owner.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                      >

                        {/* OWNER HEADER */}
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                          <div className="flex items-center gap-4">

                            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-2xl">
                              ♙
                            </div>

                            <div>

                              <h2 className="text-xl font-bold text-gray-900">
                                {getOwnerName(owner)}
                              </h2>

                              <p className="text-sm text-gray-500 mt-1">
                                {owner.email ||
                                  "Email not available"}
                              </p>

                            </div>

                          </div>

                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${
                              isApproved
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {isApproved
                              ? "✓ Approved"
                              : "⏳ Pending Approval"}
                          </span>

                        </div>

                        {/* DETAILS */}
                        <div className="p-6">

                          <div className="flex items-center justify-between mb-5">

                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                Submitted Details
                              </h3>

                              <p className="text-xs text-gray-500 mt-1">
                                Complete information submitted by the station owner
                              </p>
                            </div>

                            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-2 rounded-lg">
                              ID: {owner.id}
                            </span>

                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                            {Object.entries(owner)
                              .filter(
                                ([key]) =>
                                  key !== "id"
                              )
                              .map(([key, value]) => (

                                <div
                                  key={key}
                                  className="bg-gray-50 border border-gray-100 rounded-xl p-4"
                                >

                                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                    {key
                                      .replace(
                                        /([A-Z])/g,
                                        " $1"
                                      )
                                      .replace(
                                        /^./,
                                        (str) =>
                                          str.toUpperCase()
                                      )}
                                  </p>

                                  <p className="text-sm font-medium text-gray-900 break-words">
                                    {formatOwnerValue(value)}
                                  </p>

                                </div>

                              ))}

                          </div>

                        </div>

                        {/* APPROVAL FOOTER */}
                        <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">

                          {!isApproved ? (

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                              <div>
                                <p className="font-semibold text-gray-800">
                                  Action Required
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                  Review the submitted information before approving this owner.
                                </p>
                              </div>

                              <button
                                onClick={() =>
                                  handleApproveOwner(
                                    owner.id
                                  )
                                }
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition shadow-sm"
                              >
                                ✓ Approve Station Owner
                              </button>

                            </div>

                          ) : (

                            <div className="flex flex-col gap-2">

                              <p className="text-green-700 font-semibold">
                                ✓ This station owner has already been approved
                              </p>

                              {owner.approvedAt && (
                                <p className="text-sm text-gray-500">
                                  Approved on:{" "}
                                  {formatOwnerValue(
                                    owner.approvedAt
                                  )}
                                </p>
                              )}

                            </div>

                          )}

                        </div>

                      </div>

                    );
                  })}

                </div>

              )}

            </div>

          ) : activeMenu === "Charging Stations" ? (

            /* ================================================= */
            /* CHARGING STATIONS + LIVE ANALYTICS */
            /* ================================================= */

            <div className="space-y-7">

              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div>
                  <p className="text-sm text-green-700 font-semibold mb-1">
                    STATION MANAGEMENT
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Charging Stations
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Live station and charger analytics from Firestore.
                  </p>
                </div>

                <button
                  onClick={fetchDashboardData}
                  className="px-5 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold shadow-sm transition"
                >
                  ↻ Refresh Data
                </button>
              </div>

              {/* SUMMARY CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Stations</p>
                      <h2 className="text-3xl font-bold text-gray-900 mt-2">
                        {dashboardData?.stats?.totalStations || 0}
                      </h2>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-xl">
                      ⚡
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Available</p>
                      <h2 className="text-3xl font-bold text-green-600 mt-2">
                        {dashboardData?.stats?.availableStations || 0}
                      </h2>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-xl">
                      🟢
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Unavailable</p>
                      <h2 className="text-3xl font-bold text-red-600 mt-2">
                        {(dashboardData?.stats?.totalStations || 0) -
                          (dashboardData?.stats?.availableStations || 0)}
                      </h2>
                    </div>
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-xl">
                      🔴
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Chargers</p>
                      <h2 className="text-3xl font-bold text-blue-600 mt-2">
                        {dashboardData?.stations?.reduce(
                          (sum, station) =>
                            sum + Number(station.chargers || 0),
                          0
                        ) || 0}
                      </h2>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl">
                      🔌
                    </div>
                  </div>
                </div>

              </div>

              {/* GRAPH ROW */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* STATION AVAILABILITY GRAPH */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        Station Availability
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Available vs unavailable stations
                      </p>
                    </div>
                    <span className="text-2xl">📊</span>
                  </div>

                  {(() => {
                    const total = dashboardData?.stations?.length || 0;
                    const available =
                      dashboardData?.stations?.filter(
                        (station) => station.available !== false
                      ).length || 0;
                    const unavailable = total - available;
                    const availablePercent = total
                      ? (available / total) * 100
                      : 0;
                    const unavailablePercent = total
                      ? (unavailable / total) * 100
                      : 0;

                    return (
                      <div className="space-y-6">

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">
                              Available
                            </span>
                            <span className="text-sm font-bold text-green-600">
                              {available} ({Math.round(availablePercent)}%)
                            </span>
                          </div>
                          <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full transition-all duration-500"
                              style={{
                                width: `${availablePercent}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">
                              Unavailable
                            </span>
                            <span className="text-sm font-bold text-red-600">
                              {unavailable} ({Math.round(unavailablePercent)}%)
                            </span>
                          </div>
                          <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500 rounded-full transition-all duration-500"
                              style={{
                                width: `${unavailablePercent}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                          <span>Total stations</span>
                          <span className="font-semibold text-gray-800">
                            {total}
                          </span>
                        </div>

                      </div>
                    );
                  })()}
                </section>

                {/* TOTAL CHARGERS GRAPH */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        Charger Distribution
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Chargers installed at each station
                      </p>
                    </div>
                    <span className="text-2xl">🔌</span>
                  </div>

                  {(() => {
                    const stationList = dashboardData?.stations || [];
                    const maxChargers = Math.max(
                      ...stationList.map((station) =>
                        Number(station.chargers || 0)
                      ),
                      1
                    );

                    return stationList.length ? (
                      <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                        {stationList.map((station) => {
                          const chargers = Number(station.chargers || 0);
                          const percentage =
                            (chargers / maxChargers) * 100;

                          return (
                            <div key={station.id}>
                              <div className="flex items-center justify-between gap-3 mb-2">
                                <span className="text-sm font-semibold text-gray-700 truncate">
                                  {station.name ||
                                    station.stationName ||
                                    "Charging Station"}
                                </span>
                                <span className="text-sm font-bold text-blue-600 whitespace-nowrap">
                                  {chargers}
                                </span>
                              </div>

                              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-gray-500 text-sm">
                        No charging station data found.
                      </div>
                    );
                  })()}
                </section>

              </div>

              {/* STATION-WISE ANALYTICS TABLE */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      Station-wise Details
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Live information received from Firestore
                    </p>
                  </div>

                  <span className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-semibold w-fit">
                    {dashboardData?.stations?.length || 0} Stations
                  </span>
                </div>

                {!dashboardData?.stations?.length ? (
                  <div className="p-10 text-center text-gray-500">
                    No charging stations found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                            Station
                          </th>
                          <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                            Location
                          </th>
                          <th className="text-center px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                            Chargers
                          </th>
                          <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                            Connector
                          </th>
                          <th className="text-center px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {dashboardData.stations.map((station) => (
                          <tr
                            key={station.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                  ⚡
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {station.name ||
                                      station.stationName ||
                                      "Charging Station"}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1 break-all">
                                    ID: {station.id}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <p className="text-sm text-gray-700">
                                {station.address ||
                                  station.location ||
                                  "N/A"}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {station.city || ""}
                                {station.district
                                  ? ` • ${station.district}`
                                  : ""}
                              </p>
                            </td>

                            <td className="px-6 py-5 text-center">
                              <span className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">
                                🔌 {Number(station.chargers || 0)}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <span className="text-sm text-gray-700">
                                {station.connectorType || "N/A"}
                              </span>
                            </td>

                            <td className="px-6 py-5 text-center">
                              <span
                                className={`inline-flex px-3 py-2 rounded-full text-xs font-semibold ${
                                  station.available === false
                                    ? "bg-red-50 text-red-600"
                                    : "bg-green-50 text-green-600"
                                }`}
                              >
                                {station.available === false
                                  ? "● Unavailable"
                                  : "● Available"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </section>

            </div>
            ) : activeMenu === "EV Mechanics" ? (

  <div className="space-y-6">

    {/* HEADER */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <p className="text-sm text-green-700 font-semibold mb-1">
          MECHANIC MANAGEMENT
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          EV Mechanics
        </h1>

        <p className="text-gray-500 mt-1">
          Manage EV mechanics and their service details.
        </p>
      </div>

      <button
        onClick={() => {
          setEditingMechanic(null);
          setMechanicPhotoFile(null);
          setMechanicForm({
            name: "",
            email: "",
            phone: "",
            specialization: "",
            location: "",
            rating: "",
            experience: "",
            status: "Active",
            photo: "",
          });
          setShowMechanicForm(true);
        }}
        className="px-5 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold shadow-sm transition"
      >
        + Add Mechanic
      </button>
    </div>

    {/* SUMMARY */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Total Mechanics
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-2">
       {liveMechanicsCount}
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Active Mechanics
        </p>

        <h2 className="text-3xl font-bold text-green-600 mt-2">
          {activeMechanicsCount}
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Inactive Mechanics
        </p>

        <h2 className="text-3xl font-bold text-red-600 mt-2">
        {inactiveMechanicsCount}
        </h2>
      </div>

    </div>

    {/* MECHANIC TABLE */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">
          Mechanic List
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          EV mechanics registered in ChargeConnect
        </p>
      </div>

      {!mechanics?.length ? (

        <div className="p-12 text-center">

          <div className="text-5xl mb-4">
            🔧
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            No Mechanics Found
          </h2>

          <p className="text-gray-500 mt-2">
            Add your first EV mechanic to get started.
          </p>

        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Mechanic
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Phone
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Specialization
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Location
                </th>

                <th className="text-center px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Rating
                </th>

                <th className="text-center px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Experience
                </th>

                <th className="text-center px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>

                <th className="text-center px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {mechanics.map((mechanic) => (

                <tr
                  key={mechanic.id}
                  className="hover:bg-gray-50 transition"
                >

                  {/* NAME + EMAIL */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                        🔧
                      </div>

                      <div>

                        <p className="font-semibold text-gray-900">
                          {mechanic.name || "Unnamed Mechanic"}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {mechanic.email || "No email"}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* PHONE */}
                  <td className="px-6 py-5 text-sm text-gray-700">
                    {mechanic.phone || "N/A"}
                  </td>

                  {/* SPECIALIZATION */}
                  <td className="px-6 py-5">

                    <span className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                      {mechanic.specialization || "General EV"}
                    </span>

                  </td>

                  {/* LOCATION */}
                  <td className="px-6 py-5 text-sm text-gray-700">
                    📍 {mechanic.location || "N/A"}
                  </td>

                  {/* RATING */}
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-semibold text-gray-800">
                      ⭐ {mechanic.rating ?? "0"}/5
                    </span>
                  </td>

                  {/* EXPERIENCE */}
                  <td className="px-6 py-5 text-center text-sm text-gray-700">
                    {mechanic.experience || "N/A"}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5 text-center">

                    <span
                      className={`inline-flex px-3 py-2 rounded-full text-xs font-semibold ${
                        mechanic.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      ● {mechanic.status || "Inactive"}
                    </span>

                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5">

                    <div className="flex items-center justify-center gap-2">

                      <button
                        onClick={() => {
                          setEditingMechanic(mechanic);
                          setMechanicPhotoFile(null);

                          setMechanicForm({
                            name: mechanic.name || "",
                            email: mechanic.email || "",
                            phone: mechanic.phone || "",
                            specialization:
                              mechanic.specialization || "",
                            location: mechanic.location || "",
                            rating: mechanic.rating ?? "",
                            experience: mechanic.experience || "",
                            status: mechanic.status || "Active",
                            photo: mechanic.photo || "",
                          });

                          setShowMechanicForm(true);
                        }}
                        className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={async () => {

                          if (
                            !window.confirm(
                              `Remove ${mechanic.name || "this mechanic"}?`
                            )
                          ) {
                            return;
                          }

                          try {

                            const response = await fetch(
                              `https://charge-connect.https://charge-connect.onrender.com/admin/mechanics/${mechanic.id}`,
                              {
                                method: "DELETE",
                              }
                            );

                            const result =
                              await response.json();

                            if (
                              !response.ok ||
                              !result.success
                            ) {
                              throw new Error(
                                result.message ||
                                  "Failed to delete mechanic"
                              );
                            }

                            alert(
                              "Mechanic removed successfully!"
                            );

                            await fetchDashboardData();

                          } catch (err) {

                            console.error(
                              "Delete Mechanic Error:",
                              err
                            );

                            alert(err.message);

                          }

                        }}
                        className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
                </div>


          ) : activeMenu === "Bookings" ? (

            /* ================================================= */
            /* BOOKINGS */
            /* ================================================= */

            <div className="space-y-7">

              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <p className="text-sm text-blue-600 font-semibold mb-1">
                    BOOKING MANAGEMENT
                  </p>

                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Booking Analytics
                  </h1>

                  <p className="text-gray-500 mt-1">
                    Monitor bookings, booking capacity and platform usage.
                  </p>
                </div>

                <button
                  onClick={fetchDashboardData}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
                >
                  🔄 Refresh
                </button>

              </div>


              {/* CALCULATIONS */}
              {(() => {

                const bookings =
                  dashboardData?.bookings || [];

                const stations =
                  dashboardData?.stations || [];

                const totalBookings =
                  bookings.length;

                const confirmedBookings =
                  bookings.filter((booking) =>
                    ["Booked", "Confirmed", "Completed"]
                      .includes(
                        String(
                          booking.status || ""
                        )
                      )
                  ).length;

                const pendingBookings =
                  bookings.filter((booking) =>
                    String(
                      booking.status || ""
                    ).toLowerCase() === "pending"
                  ).length;

                const cancelledBookings =
                  bookings.filter((booking) =>
                    ["cancelled", "canceled"]
                      .includes(
                        String(
                          booking.status || ""
                        ).toLowerCase()
                      )
                  ).length;

                const approvedStations =
                  stations.filter(
                    (station) =>
                      station.approvalStatus ===
                      "Approved"
                  );

                const totalChargers =
                  approvedStations.reduce(
                    (total, station) =>
                      total +
                      Number(
                        station.chargers || 0
                      ),
                    0
                  );

                /*
                 * Booking page currently has
                 * 9 selectable time slots.
                 *
                 * Therefore:
                 * chargers × 9 = possible bookings/day
                 */

                const possibleBookingsPerDay =
                  totalChargers * 9;

                const bookingUtilization =
                  possibleBookingsPerDay > 0
                    ? Math.min(
                        Math.round(
                          (totalBookings /
                            possibleBookingsPerDay) *
                            100
                        ),
                        100
                      )
                    : 0;


                // TODAY
                const today =
                  new Date().toLocaleDateString(
                    "en-IN"
                  );

                const todayBookings =
                  bookings.filter((booking) => {

                    if (!booking.bookingDate) {
                      return false;
                    }

                    const bookingDate =
                      new Date(
                        booking.bookingDate
                      ).toLocaleDateString(
                        "en-IN"
                      );

                    return bookingDate === today;

                  }).length;


                // LAST 7 DAYS
                const last7Days =
                  Array.from(
                    { length: 7 },
                    (_, index) => {

                      const date =
                        new Date();

                      date.setDate(
                        date.getDate() -
                          (6 - index)
                      );

                      return date;
                    }
                  );


                const dailyBookings =
                  last7Days.map((date) => {

                    const dateString =
                      date.toLocaleDateString(
                        "en-IN"
                      );

                    const count =
                      bookings.filter(
                        (booking) => {

                          if (
                            !booking.bookingDate
                          ) {
                            return false;
                          }

                          return (
                            new Date(
                              booking.bookingDate
                            ).toLocaleDateString(
                              "en-IN"
                            ) === dateString
                          );
                        }
                      ).length;

                    return {
                      label: date.toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                        }
                      ),
                      count,
                    };

                  });


                const maxGraphValue =
                  Math.max(
                    ...dailyBookings.map(
                      (item) => item.count
                    ),
                    1
                  );


                return (
                  <>

                    {/* SUMMARY CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                      {/* TOTAL */}
                      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                          <div>
                            <p className="text-sm text-gray-500">
                              Total Bookings
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 mt-2">
                              {totalBookings}
                            </h2>
                          </div>

                          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                            📅
                          </div>

                        </div>

                        <p className="text-xs text-blue-600 font-semibold mt-4">
                          All bookings
                        </p>

                      </div>


                      {/* TODAY */}
                      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                          <div>
                            <p className="text-sm text-gray-500">
                              Today's Bookings
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 mt-2">
                              {todayBookings}
                            </h2>
                          </div>

                          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                            📈
                          </div>

                        </div>

                        <p className="text-xs text-green-600 font-semibold mt-4">
                          Bookings today
                        </p>

                      </div>


                      {/* CONFIRMED */}
                      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                          <div>
                            <p className="text-sm text-gray-500">
                              Successful
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 mt-2">
                              {confirmedBookings}
                            </h2>
                          </div>

                          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">
                            ✅
                          </div>

                        </div>

                        <p className="text-xs text-emerald-600 font-semibold mt-4">
                          Booked / confirmed / completed
                        </p>

                      </div>


                      {/* POTENTIAL */}
                      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                          <div>
                            <p className="text-sm text-gray-500">
                              Daily Capacity
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 mt-2">
                              {possibleBookingsPerDay}
                            </h2>
                          </div>

                          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-xl">
                            ⚡
                          </div>

                        </div>

                        <p className="text-xs text-purple-600 font-semibold mt-4">
                          Possible bookings / day
                        </p>

                      </div>

                    </div>


                    {/* CAPACITY + STATUS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                      {/* CAPACITY */}
                      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                        <div className="flex items-center justify-between">

                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              Booking Capacity
                            </h3>

                            <p className="text-xs text-gray-500 mt-1">
                              Current usage vs possible capacity
                            </p>
                          </div>

                          <span className="text-2xl">
                            📊
                          </span>

                        </div>


                        <div className="mt-6">

                          <div className="flex justify-between mb-2">

                            <span className="text-sm text-gray-500">
                              Current bookings
                            </span>

                            <span className="text-sm font-bold text-gray-900">
                              {totalBookings} /{" "}
                              {possibleBookingsPerDay}
                            </span>

                          </div>

                          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">

                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-500"
                              style={{
                                width: `${bookingUtilization}%`,
                              }}
                            />

                          </div>

                          <div className="flex justify-between mt-3">

                            <span className="text-xs text-gray-500">
                              Utilization
                            </span>

                            <span className="text-sm font-bold text-blue-600">
                              {bookingUtilization}%
                            </span>

                          </div>

                        </div>


                        <div className="grid grid-cols-2 gap-4 mt-6">

                          <div className="bg-blue-50 rounded-xl p-4">

                            <p className="text-xs text-blue-600">
                              Total Chargers
                            </p>

                            <p className="text-2xl font-bold text-blue-900 mt-1">
                              {totalChargers}
                            </p>

                          </div>

                          <div className="bg-green-50 rounded-xl p-4">

                            <p className="text-xs text-green-600">
                              Possible / Day
                            </p>

                            <p className="text-2xl font-bold text-green-900 mt-1">
                              {possibleBookingsPerDay}
                            </p>

                          </div>

                        </div>

                      </section>


                      {/* STATUS */}
                      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                        <div className="flex items-center justify-between mb-6">

                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              Booking Status
                            </h3>

                            <p className="text-xs text-gray-500 mt-1">
                              Current booking distribution
                            </p>
                          </div>

                          <span className="text-2xl">
                            📋
                          </span>

                        </div>


                        <div className="space-y-5">

                          <div>

                            <div className="flex justify-between text-sm mb-2">

                              <span className="text-gray-600">
                                Successful
                              </span>

                              <span className="font-bold text-green-600">
                                {confirmedBookings}
                              </span>

                            </div>

                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">

                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{
                                  width: `${
                                    totalBookings
                                      ? (confirmedBookings /
                                          totalBookings) *
                                        100
                                      : 0
                                  }%`,
                                }}
                              />

                            </div>

                          </div>


                          <div>

                            <div className="flex justify-between text-sm mb-2">

                              <span className="text-gray-600">
                                Pending
                              </span>

                              <span className="font-bold text-orange-600">
                                {pendingBookings}
                              </span>

                            </div>

                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">

                              <div
                                className="h-full bg-orange-500 rounded-full"
                                style={{
                                  width: `${
                                    totalBookings
                                      ? (pendingBookings /
                                          totalBookings) *
                                        100
                                      : 0
                                  }%`,
                                }}
                              />

                            </div>

                          </div>


                          <div>

                            <div className="flex justify-between text-sm mb-2">

                              <span className="text-gray-600">
                                Cancelled
                              </span>

                              <span className="font-bold text-red-600">
                                {cancelledBookings}
                              </span>

                            </div>

                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">

                              <div
                                className="h-full bg-red-500 rounded-full"
                                style={{
                                  width: `${
                                    totalBookings
                                      ? (cancelledBookings /
                                          totalBookings) *
                                        100
                                      : 0
                                  }%`,
                                }}
                              />

                            </div>

                          </div>

                        </div>

                      </section>

                    </div>


                    {/* 7 DAY GRAPH */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                      <div className="flex items-center justify-between mb-8">

                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            Booking Trend
                          </h3>

                          <p className="text-xs text-gray-500 mt-1">
                            Bookings during the last 7 days
                          </p>
                        </div>

                        <span className="text-2xl">
                          📈
                        </span>

                      </div>


                      <div className="h-64 flex items-end justify-between gap-3 md:gap-6 border-b border-gray-100 px-2">

                        {dailyBookings.map(
                          (item, index) => {

                            const height =
                              Math.max(
                                (item.count /
                                  maxGraphValue) *
                                  85,
                                item.count > 0
                                  ? 8
                                  : 2
                              );

                            return (
                              <div
                                key={index}
                                className="flex-1 h-full flex flex-col justify-end items-center"
                              >

                                <div className="mb-2 text-xs font-bold text-blue-600">
                                  {item.count}
                                </div>

                                <div
                                  className="w-full max-w-12 bg-blue-500 rounded-t-xl transition-all duration-500"
                                  style={{
                                    height: `${height}%`,
                                  }}
                                />

                                <p className="text-xs text-gray-500 mt-3">
                                  {item.label}
                                </p>

                              </div>
                            );

                          }
                        )}

                      </div>

                    </section>


                    {/* ALL BOOKINGS TABLE */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                      <div className="p-6 border-b border-gray-100">

                        <div className="flex items-center justify-between">

                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              All Bookings
                            </h3>

                            <p className="text-xs text-gray-500 mt-1">
                              Complete booking records from Firestore
                            </p>
                          </div>

                          <span className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                            {totalBookings} Bookings
                          </span>

                        </div>

                      </div>


                      {bookings.length === 0 ? (

                        <div className="p-12 text-center text-gray-500">
                          No bookings found.
                        </div>

                      ) : (

                        <div className="overflow-x-auto">

                          <table className="w-full">

                            <thead className="bg-gray-50">

                              <tr>

                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                                  Customer
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                                  Station
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                                  Date
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                                  Slot
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                                  Amount
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                                  Status
                                </th>

                              </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                              {bookings.map(
                                (booking) => (

                                  <tr
                                    key={booking.id}
                                    className="hover:bg-gray-50 transition"
                                  >

                                    <td className="px-6 py-4">

                                      <p className="font-semibold text-gray-900 text-sm">
                                        {booking.userName ||
                                          booking.userEmail ||
                                          "Customer"}
                                      </p>

                                      <p className="text-xs text-gray-400">
                                        {booking.userEmail ||
                                          "No email"}
                                      </p>

                                    </td>


                                    <td className="px-6 py-4">

                                      <p className="text-sm font-medium text-gray-800">
                                        {booking.stationName ||
                                          "Charging Station"}
                                      </p>

                                      <p className="text-xs text-gray-400">
                                        {booking.address ||
                                          "No address"}
                                      </p>

                                    </td>


                                    <td className="px-6 py-4 text-sm text-gray-600">
                                      {booking.bookingDate ||
                                        "N/A"}
                                    </td>


                                    <td className="px-6 py-4 text-sm text-gray-600">
                                      {booking.bookingSlot ||
                                        "N/A"}
                                    </td>


                                    <td className="px-6 py-4">

                                      <span className="font-bold text-gray-900">
                                        ₹
                                        {Number(
                                          booking.estimatedPrice ||
                                            0
                                        ).toLocaleString(
                                          "en-IN"
                                        )}
                                      </span>

                                    </td>


                                    <td className="px-6 py-4">

                                      <span
                                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                          booking.status ===
                                          "Completed"
                                            ? "bg-green-50 text-green-600"
                                            : booking.status ===
                                                "Cancelled" ||
                                              booking.status ===
                                                "Canceled"
                                            ? "bg-red-50 text-red-600"
                                            : booking.status ===
                                                "Pending"
                                            ? "bg-orange-50 text-orange-600"
                                            : "bg-blue-50 text-blue-600"
                                        }`}
                                      >
                                        {booking.status ||
                                          "Booked"}
                                      </span>

                                    </td>

                                  </tr>

                                )
                              )}

                            </tbody>

                          </table>

                        </div>

                      )}

                    </section>

                  </>
                );

              })()}

            </div>
          ) : activeMenu === "Payments" ? (

  /* ========================================================= */
  /* PAYMENTS & FINANCIAL ANALYTICS */
  /* ========================================================= */

  <div className="space-y-7">

    {(() => {

      const bookings = dashboardData?.bookings || [];
      const expenses = dashboardData?.expenses || [];

      /* ========================= */
      /* DATE HELPER */
      /* ========================= */

      const getBookingDate = (booking) => {
        try {
          if (!booking.createdAt) return null;

          if (booking.createdAt?.toDate) {
            return booking.createdAt.toDate();
          }

          if (booking.createdAt?.seconds) {
            return new Date(
              booking.createdAt.seconds * 1000
            );
          }

          const parsed = new Date(booking.createdAt);

          return isNaN(parsed.getTime()) ? null : parsed;

        } catch {
          return null;
        }
      };

      /* ========================= */
      /* SUCCESSFUL PAYMENTS */
      /* ========================= */

      const successfulBookings = bookings.filter((booking) => {

        const status = String(
          booking.paymentStatus || ""
        ).toLowerCase();

        return (
          status === "paid" ||
          status === "success" ||
          status === "successful" ||
          status === "completed"
        );

      });

      /* ========================= */
      /* REVENUE */
      /* ========================= */

      const getRevenue = (booking) => {

        return Number(
          booking.estimatedPrice ||
          booking.finalTotal ||
          booking.chargingPrice ||
          0
        );

      };

      const totalRevenue =
        successfulBookings.reduce(
          (sum, booking) =>
            sum + getRevenue(booking),
          0
        );

      /* ========================= */
      /* TODAY */
      /* ========================= */

      const today = new Date();

      const todayRevenue =
        successfulBookings
          .filter((booking) => {

            const date = getBookingDate(booking);

            if (!date) return false;

            return (
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            );

          })
          .reduce(
            (sum, booking) =>
              sum + getRevenue(booking),
            0
          );

      /* ========================= */
      /* MONTH REVENUE */
      /* ========================= */

      const currentMonthRevenue =
        successfulBookings
          .filter((booking) => {

            const date = getBookingDate(booking);

            if (!date) return false;

            return (
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            );

          })
          .reduce(
            (sum, booking) =>
              sum + getRevenue(booking),
            0
          );

      /* ========================= */
      /* ONLINE / CASH */
      /* ========================= */

      const onlinePayments =
        successfulBookings.filter((booking) =>
          String(
            booking.paymentMethod || ""
          ).toLowerCase() === "online"
        );

      const cashPayments =
        successfulBookings.filter((booking) =>
          String(
            booking.paymentMethod || ""
          ).toLowerCase() === "cash"
        );

      const onlineRevenue =
        onlinePayments.reduce(
          (sum, booking) =>
            sum + getRevenue(booking),
          0
        );

      const cashRevenue =
        cashPayments.reduce(
          (sum, booking) =>
            sum + getRevenue(booking),
          0
        );

      /* ========================= */
      /* EXPENSES */
      /* ========================= */

      const totalExpenses =
        expenses.reduce(
          (sum, expense) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        );

      const profit =
        totalRevenue - totalExpenses;

      /* ========================= */
      /* PAYMENT COUNT */
      /* ========================= */

      const pendingPayments =
        bookings.filter((booking) => {

          const status =
            String(
              booking.paymentStatus || ""
            ).toLowerCase();

          return (
            status === "" ||
            status === "pending"
          );

        });

      const failedPayments =
        bookings.filter((booking) => {

          const status =
            String(
              booking.paymentStatus || ""
            ).toLowerCase();

          return (
            status === "failed" ||
            status === "cancelled" ||
            status === "canceled"
          );

        });

      /* ========================= */
      /* DAILY REVENUE - LAST 7 DAYS */
      /* ========================= */

      const dailyRevenue = [];

      for (let i = 6; i >= 0; i--) {

        const date = new Date();

        date.setDate(
          today.getDate() - i
        );

        const revenue =
          successfulBookings
            .filter((booking) => {

              const bookingDate =
                getBookingDate(booking);

              if (!bookingDate)
                return false;

              return (
                bookingDate.getDate() ===
                  date.getDate() &&
                bookingDate.getMonth() ===
                  date.getMonth() &&
                bookingDate.getFullYear() ===
                  date.getFullYear()
              );

            })
            .reduce(
              (sum, booking) =>
                sum + getRevenue(booking),
              0
            );

        dailyRevenue.push({
          label: date.toLocaleDateString(
            "en-IN",
            {
              weekday: "short"
            }
          ),
          revenue
        });

      }

      /* ========================= */
      /* MONTHLY REVENUE - YEAR */
      /* ========================= */

      const monthlyRevenue = [];

      for (let month = 0; month < 12; month++) {

        const revenue =
          successfulBookings
            .filter((booking) => {

              const bookingDate =
                getBookingDate(booking);

              if (!bookingDate)
                return false;

              return (
                bookingDate.getMonth() ===
                  month &&
                bookingDate.getFullYear() ===
                  today.getFullYear()
              );

            })
            .reduce(
              (sum, booking) =>
                sum + getRevenue(booking),
              0
            );

        monthlyRevenue.push({
          label: new Date(
            today.getFullYear(),
            month,
            1
          ).toLocaleDateString(
            "en-IN",
            {
              month: "short"
            }
          ),
          revenue
        });

      }

      /* ========================= */
      /* GRAPH MAX */
      /* ========================= */

      const dailyMax =
        Math.max(
          ...dailyRevenue.map(
            (item) => item.revenue
          ),
          1
        );

      const monthlyMax =
        Math.max(
          ...monthlyRevenue.map(
            (item) => item.revenue
          ),
          1
        );

      return (

        <>

          {/* ===================================== */}
          {/* HEADER */}
          {/* ===================================== */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h1 className="text-3xl font-bold">
                Payments & Financial Analytics
              </h1>

              <p className="text-gray-500 mt-1">
                Monitor revenue, payments, expenses and business performance.
              </p>

            </div>

            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl font-semibold">
              Live Financial Data
            </div>

          </div>


          {/* ===================================== */}
          {/* TOP CARDS */}
          {/* ===================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* TOTAL REVENUE */}

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">

              <p className="text-gray-500">
                Total Revenue
              </p>

              <h2 className="text-3xl font-bold text-green-600 mt-2">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                From successful payments
              </p>

            </div>


            {/* TODAY */}

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">

              <p className="text-gray-500">
                Today's Revenue
              </p>

              <h2 className="text-3xl font-bold text-blue-600 mt-2">
                ₹{todayRevenue.toLocaleString("en-IN")}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Today's successful bookings
              </p>

            </div>


            {/* MONTH */}

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500">

              <p className="text-gray-500">
                Monthly Revenue
              </p>

              <h2 className="text-3xl font-bold text-purple-600 mt-2">
                ₹{currentMonthRevenue.toLocaleString("en-IN")}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Current month
              </p>

            </div>


            {/* PROFIT */}

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500">

              <p className="text-gray-500">
                Net Profit
              </p>

              <h2
                className={`text-3xl font-bold mt-2 ${
                  profit >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ₹{profit.toLocaleString("en-IN")}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Revenue − Expenses
              </p>

            </div>

          </div>


          {/* ===================================== */}
          {/* PAYMENT SUMMARY */}
          {/* ===================================== */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

            <div className="bg-white rounded-2xl shadow p-5">

              <p className="text-gray-500">
                Successful
              </p>

              <h2 className="text-2xl font-bold text-green-600 mt-2">
                {successfulBookings.length}
              </h2>

            </div>


            <div className="bg-white rounded-2xl shadow p-5">

              <p className="text-gray-500">
                Pending
              </p>

              <h2 className="text-2xl font-bold text-orange-500 mt-2">
                {pendingPayments.length}
              </h2>

            </div>


            <div className="bg-white rounded-2xl shadow p-5">

              <p className="text-gray-500">
                Failed / Cancelled
              </p>

              <h2 className="text-2xl font-bold text-red-500 mt-2">
                {failedPayments.length}
              </h2>

            </div>


            <div className="bg-white rounded-2xl shadow p-5">

              <p className="text-gray-500">
                Average Transaction
              </p>

              <h2 className="text-2xl font-bold text-blue-600 mt-2">

                ₹
                {successfulBookings.length
                  ? Math.round(
                      totalRevenue /
                        successfulBookings.length
                    ).toLocaleString("en-IN")
                  : 0}

              </h2>

            </div>

          </div>


          {/* ===================================== */}
          {/* DAILY REVENUE GRAPH */}
          {/* ===================================== */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="flex justify-between items-center mb-6">

              <div>

                <h2 className="text-xl font-bold">
                  Daily Revenue
                </h2>

                <p className="text-sm text-gray-500">
                  Last 7 days
                </p>

              </div>

              <span className="text-green-600 font-semibold">
                ₹
                {dailyRevenue
                  .reduce(
                    (sum, item) =>
                      sum + item.revenue,
                    0
                  )
                  .toLocaleString("en-IN")}
              </span>

            </div>


            <div className="flex items-end gap-4 h-64">

              {dailyRevenue.map(
                (item, index) => {

                  const height =
                    item.revenue > 0
                      ? Math.max(
                          (item.revenue /
                            dailyMax) *
                            100,
                          5
                        )
                      : 3;

                  return (

                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center justify-end h-full"
                    >

                      <span className="text-xs font-semibold mb-2">

                        ₹
                        {item.revenue.toLocaleString(
                          "en-IN"
                        )}

                      </span>

                      <div
                        className="w-full max-w-[55px] bg-green-500 rounded-t-lg transition-all duration-500 hover:bg-green-600"
                        style={{
                          height: `${height}%`
                        }}
                      />

                      <span className="text-xs text-gray-500 mt-2">
                        {item.label}
                      </span>

                    </div>

                  );

                }
              )}

            </div>

          </div>


          {/* ===================================== */}
          {/* MONTHLY REVENUE GRAPH */}
          {/* ===================================== */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="flex justify-between items-center mb-6">

              <div>

                <h2 className="text-xl font-bold">
                  Monthly Revenue
                </h2>

                <p className="text-sm text-gray-500">
                  {today.getFullYear()} revenue performance
                </p>

              </div>

              <span className="text-purple-600 font-semibold">
                ₹
                {monthlyRevenue
                  .reduce(
                    (sum, item) =>
                      sum + item.revenue,
                    0
                  )
                  .toLocaleString("en-IN")}
              </span>

            </div>


            <div className="flex items-end gap-2 md:gap-4 h-64">

              {monthlyRevenue.map(
                (item, index) => {

                  const height =
                    item.revenue > 0
                      ? Math.max(
                          (item.revenue /
                            monthlyMax) *
                            100,
                          5
                        )
                      : 3;

                  return (

                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center justify-end h-full"
                    >

                      <span className="text-[10px] md:text-xs font-semibold mb-2">

                        ₹
                        {item.revenue > 999
                          ? `${(
                              item.revenue /
                              1000
                            ).toFixed(1)}K`
                          : item.revenue}

                      </span>

                      <div
                        className="w-full bg-purple-500 rounded-t-lg transition-all duration-500 hover:bg-purple-600"
                        style={{
                          height: `${height}%`
                        }}
                      />

                      <span className="text-xs text-gray-500 mt-2">
                        {item.label}
                      </span>

                    </div>

                  );

                }
              )}

            </div>

          </div>


          {/* ===================================== */}
          {/* PROFIT / LOSS */}
          {/* ===================================== */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


            {/* PROFIT LOSS CARD */}

            <div className="bg-white rounded-2xl shadow-md p-6">

              <h2 className="text-xl font-bold mb-6">
                Profit & Loss
              </h2>

              <div className="space-y-5">

                <div className="flex justify-between items-center">

                  <span className="text-gray-600">
                    Total Revenue
                  </span>

                  <span className="font-bold text-green-600">
                    + ₹
                    {totalRevenue.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>


                <div className="flex justify-between items-center">

                  <span className="text-gray-600">
                    Total Expenses
                  </span>

                  <span className="font-bold text-red-600">
                    − ₹
                    {totalExpenses.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>


                <div className="border-t pt-5 flex justify-between items-center">

                  <span className="font-bold text-lg">
                    Net Profit / Loss
                  </span>

                  <span
                    className={`font-bold text-xl ${
                      profit >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ₹
                    {profit.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              </div>

            </div>


            {/* PAYMENT METHOD */}

            <div className="bg-white rounded-2xl shadow-md p-6">

              <h2 className="text-xl font-bold mb-6">
                Payment Method Analysis
              </h2>


              <div className="space-y-6">

                <div>

                  <div className="flex justify-between mb-2">

                    <span>
                      Online Payments
                    </span>

                    <span className="font-semibold">
                      ₹
                      {onlineRevenue.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">

                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{
                        width: `${
                          totalRevenue
                            ? (onlineRevenue /
                                totalRevenue) *
                              100
                            : 0
                        }%`
                      }}
                    />

                  </div>

                </div>


                <div>

                  <div className="flex justify-between mb-2">

                    <span>
                      Cash Payments
                    </span>

                    <span className="font-semibold">
                      ₹
                      {cashRevenue.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">

                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{
                        width: `${
                          totalRevenue
                            ? (cashRevenue /
                                totalRevenue) *
                              100
                            : 0
                        }%`
                      }}
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ===================================== */}
          {/* TRANSACTIONS TABLE */}
          {/* ===================================== */}

          <div className="bg-white rounded-2xl shadow-md overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-xl font-bold">
                Payment Transactions
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                All booking payment records
              </p>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="p-4 text-left">
                      Booking
                    </th>

                    <th className="p-4 text-left">
                      Customer
                    </th>

                    <th className="p-4 text-left">
                      Station
                    </th>

                    <th className="p-4 text-left">
                      Method
                    </th>

                    <th className="p-4 text-left">
                      Amount
                    </th>

                    <th className="p-4 text-left">
                      Status
                    </th>

                    <th className="p-4 text-left">
                      Date
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {bookings.length === 0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="p-10 text-center text-gray-500"
                      >
                        No payment transactions found.
                      </td>

                    </tr>

                  ) : (

                    bookings.map(
                      (booking) => (

                        <tr
                          key={booking.id}
                          className="border-t hover:bg-gray-50"
                        >

                          <td className="p-4 font-semibold">
                            #{booking.id?.slice(-6)}
                          </td>

                          <td className="p-4">

                            {booking.userName ||
                              booking.userEmail ||
                              "Unknown"}

                          </td>

                          <td className="p-4">

                            {booking.stationName ||
                              "Unknown Station"}

                          </td>

                          <td className="p-4 capitalize">

                            {booking.paymentMethod ||
                              "Online"}

                          </td>

                          <td className="p-4 font-bold">

                            ₹
                            {getRevenue(
                              booking
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </td>

                          <td className="p-4">

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                [
                                  "paid",
                                  "success",
                                  "successful",
                                  "completed"
                                ].includes(
                                  String(
                                    booking.paymentStatus ||
                                      ""
                                  ).toLowerCase()
                                )
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >

                              {booking.paymentStatus ||
                                "Pending"}

                            </span>

                          </td>

                          <td className="p-4 text-sm text-gray-500">

                            {getBookingDate(
                              booking
                            )
                              ? getBookingDate(
                                  booking
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : booking.createdAt ||
                                "-"}

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </>

      );

    })()}

  </div>
  ) : activeMenu === "Reviews" ? (

  /* ================================================= */
  /* REVIEWS */
  /* ================================================= */

  <div className="space-y-7">

    {(() => {

      const reviews = dashboardData?.reviews || [];

      const totalReviews = reviews.length;

      const averageRating =
        totalReviews > 0
          ? (
              reviews.reduce(
                (sum, review) =>
                  sum + Number(
                    review.rating || 0
                  ),
                0
              ) / totalReviews
            ).toFixed(1)
          : "0.0";

      const fiveStar = reviews.filter(
        (review) =>
          Number(review.rating) === 5
      ).length;

      const fourStar = reviews.filter(
        (review) =>
          Number(review.rating) === 4
      ).length;

      const threeStar = reviews.filter(
        (review) =>
          Number(review.rating) === 3
      ).length;

      const twoStar = reviews.filter(
        (review) =>
          Number(review.rating) === 2
      ).length;

      const oneStar = reviews.filter(
        (review) =>
          Number(review.rating) === 1
      ).length;

      return (
        <>

          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                Customer Reviews
              </h1>

              <p className="text-gray-500 mt-1">
                Monitor customer feedback and station ratings.
              </p>

            </div>

            <button
              onClick={fetchDashboardData}
              className="px-5 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold"
            >
              🔄 Refresh Reviews
            </button>

          </div>


          {/* SUMMARY CARDS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <div className="bg-white rounded-2xl shadow-sm border p-6">

              <p className="text-gray-500 text-sm">
                Total Reviews
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {totalReviews}
              </h2>

            </div>


            <div className="bg-white rounded-2xl shadow-sm border p-6">

              <p className="text-gray-500 text-sm">
                Average Rating
              </p>

              <h2 className="text-3xl font-bold text-yellow-500 mt-2">
                ⭐ {averageRating}
              </h2>

            </div>


            <div className="bg-white rounded-2xl shadow-sm border p-6">

              <p className="text-gray-500 text-sm">
                5 Star Reviews
              </p>

              <h2 className="text-3xl font-bold text-green-600 mt-2">
                {fiveStar}
              </h2>

            </div>


            <div className="bg-white rounded-2xl shadow-sm border p-6">

              <p className="text-gray-500 text-sm">
                Positive Reviews
              </p>

              <h2 className="text-3xl font-bold text-blue-600 mt-2">
                {fiveStar + fourStar}
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                4 and 5 star
              </p>

            </div>

          </div>


          {/* RATING DISTRIBUTION */}

          <div className="bg-white rounded-2xl shadow-sm border p-6">

            <h2 className="text-xl font-bold mb-6">
              Rating Distribution
            </h2>

            {[
              {
                rating: 5,
                count: fiveStar,
                color: "bg-green-500",
              },
              {
                rating: 4,
                count: fourStar,
                color: "bg-lime-500",
              },
              {
                rating: 3,
                count: threeStar,
                color: "bg-yellow-500",
              },
              {
                rating: 2,
                count: twoStar,
                color: "bg-orange-500",
              },
              {
                rating: 1,
                count: oneStar,
                color: "bg-red-500",
              },
            ].map((item) => {

              const percentage =
                totalReviews
                  ? (item.count /
                      totalReviews) *
                    100
                  : 0;

              return (

                <div
                  key={item.rating}
                  className="mb-4"
                >

                  <div className="flex items-center gap-3 mb-1">

                    <span className="w-12 text-sm font-semibold">
                      {item.rating} ⭐
                    </span>

                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">

                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                    <span className="w-10 text-right text-sm font-semibold">
                      {item.count}
                    </span>

                  </div>

                </div>

              );

            })}

          </div>


          {/* REVIEWS TABLE */}

          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-xl font-bold">
                All Customer Reviews
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Reviews stored in Firestore
              </p>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="p-4 text-left">
                      Customer
                    </th>

                    <th className="p-4 text-left">
                      Station
                    </th>

                    <th className="p-4 text-left">
                      Rating
                    </th>

                    <th className="p-4 text-left">
                      Review
                    </th>

                    <th className="p-4 text-left">
                      Date
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {reviews.length === 0 ? (

                    <tr>

                      <td
                        colSpan="5"
                        className="p-10 text-center text-gray-500"
                      >
                        No reviews found.
                      </td>

                    </tr>

                  ) : (

                    reviews.map((review) => (

                      <tr
                        key={review.id}
                        className="border-t hover:bg-gray-50"
                      >

                        <td className="p-4">

                          <p className="font-semibold">
                            {review.userName ||
                              review.userEmail ||
                              "Customer"}
                          </p>

                          {review.userEmail && (
                            <p className="text-xs text-gray-400">
                              {review.userEmail}
                            </p>
                          )}

                        </td>


                        <td className="p-4">

                          {review.stationName ||
                            review.station ||
                            "Charging Station"}

                        </td>


                        <td className="p-4">

                          <span className="font-semibold text-yellow-500">
                            {"⭐".repeat(
                              Math.min(
                                5,
                                Math.max(
                                  0,
                                  Number(
                                    review.rating || 0
                                  )
                                )
                              )
                            )}
                          </span>

                          <span className="ml-2 text-sm text-gray-500">
                            {review.rating || 0}/5
                          </span>

                        </td>


                        <td className="p-4 max-w-md">

                          <p className="text-gray-700">
                            {review.comment ||
                              review.review ||
                              review.message ||
                              "No comment"}
                          </p>

                        </td>


                        <td className="p-4 text-sm text-gray-500">

                          {review.createdAt
                            ? review.createdAt?.seconds
                              ? new Date(
                                  review.createdAt.seconds *
                                    1000
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : String(
                                  review.createdAt
                                )
                            : "-"}

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </>
      );

    })()}

  </div>
  ) : activeMenu === "Reports" ? (
  <div className="space-y-7">

    {(() => {
      const bookings = dashboardData?.bookings || [];
      const stations = dashboardData?.stations || [];
      const users = dashboardData?.users || [];
      const reviews = dashboardData?.reviews || [];
      const foods = dashboardData?.foods || [];
      const entertainment = dashboardData?.entertainment || [];

      // -----------------------------
      // BASIC REPORT DATA
      // -----------------------------

      const totalBookings = bookings.length;

      const totalStations = stations.length;

      const approvedStations = stations.filter(
        (station) => station.approvalStatus === "Approved"
      ).length;

      const totalUsers = users.length;

      const totalChargers = stations.reduce(
        (sum, station) => sum + Number(station.chargers || 0),
        0
      );

      // -----------------------------
      // REVENUE
      // -----------------------------

      const getBookingAmount = (booking) =>
        Number(
          booking.estimatedPrice ||
          booking.finalTotal ||
          booking.chargingPrice ||
          0
        );

      const paidBookings = bookings.filter((booking) => {
        const paymentStatus = String(
          booking.paymentStatus || ""
        ).toLowerCase();

        return [
          "paid",
          "success",
          "successful",
          "completed",
        ].includes(paymentStatus);
      });

      const totalRevenue = paidBookings.reduce(
        (sum, booking) => sum + getBookingAmount(booking),
        0
      );

      // -----------------------------
      // BOOKING STATUS
      // -----------------------------

      const confirmedBookings = bookings.filter((booking) => {
        const status = String(
          booking.status || ""
        ).toLowerCase();

        return [
          "booked",
          "confirmed",
          "completed",
        ].includes(status);
      }).length;

      const pendingBookings = bookings.filter(
        (booking) =>
          String(booking.status || "").toLowerCase() ===
          "pending"
      ).length;

      const cancelledBookings = bookings.filter((booking) => {
        const status = String(
          booking.status || ""
        ).toLowerCase();

        return (
          status === "cancelled" ||
          status === "canceled"
        );
      }).length;

      // -----------------------------
      // REVIEWS
      // -----------------------------

      const totalReviews = reviews.length;

      const averageRating =
        totalReviews > 0
          ? (
              reviews.reduce(
                (sum, review) =>
                  sum + Number(review.rating || 0),
                0
              ) / totalReviews
            ).toFixed(1)
          : "0.0";

      // -----------------------------
      // FOOD REPORT
      // -----------------------------

      let foodOrders = 0;
      let foodRevenue = 0;

      bookings.forEach((booking) => {
        const items = booking.foodItems || [];

        items.forEach((item) => {
          const quantity = Number(item.quantity || 0);
          const total =
            Number(item.total || 0) ||
            Number(item.price || 0) * quantity;

          foodOrders += quantity;
          foodRevenue += total;
        });
      });

      // -----------------------------
      // ENTERTAINMENT REPORT
      // -----------------------------

      let entertainmentOrders = 0;
      let entertainmentRevenue = 0;

      bookings.forEach((booking) => {
        const items =
          booking.entertainmentItems || [];

        items.forEach((item) => {
          const quantity = Number(item.quantity || 1);

          const total =
            Number(item.total || 0) ||
            Number(item.price || 0) * quantity;

          entertainmentOrders += quantity;
          entertainmentRevenue += total;
        });
      });

      // -----------------------------
      // ONLINE / CASH
      // -----------------------------

      const onlinePayments = paidBookings.filter(
        (booking) =>
          String(
            booking.paymentMethod || ""
          ).toLowerCase() === "online"
      ).length;

      const cashPayments = paidBookings.filter(
        (booking) =>
          String(
            booking.paymentMethod || ""
          ).toLowerCase() === "cash"
      ).length;

      // -----------------------------
      // BOOKING UTILIZATION
      // -----------------------------

      const bookingSuccessRate =
        totalBookings > 0
          ? ((confirmedBookings / totalBookings) * 100).toFixed(1)
          : "0.0";

      // -----------------------------
      // REPORT CARDS
      // -----------------------------

      const reportCards = [
        {
          title: "Total Bookings",
          value: totalBookings,
          icon: "📅",
        },
        {
          title: "Total Revenue",
          value: `₹${totalRevenue.toLocaleString("en-IN")}`,
          icon: "💰",
        },
        {
          title: "Charging Stations",
          value: totalStations,
          icon: "⚡",
        },
        {
          title: "Total Users",
          value: totalUsers,
          icon: "👥",
        },
        {
          title: "Total Chargers",
          value: totalChargers,
          icon: "🔌",
        },
        {
          title: "Average Rating",
          value: `${averageRating} ⭐`,
          icon: "⭐",
        },
        {
          title: "Food Orders",
          value: foodOrders,
          icon: "🍔",
        },
        {
          title: "Entertainment Uses",
          value: entertainmentOrders,
          icon: "🎮",
        },
      ];

      return (
        <>
          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Reports & Analytics
              </h1>

              <p className="text-gray-500 mt-1">
                Complete system performance report
                from Firestore data
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-gray-800"
            >
              🖨️ Print Report
            </button>

          </div>

          {/* SUMMARY CARDS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {reportCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-5 border"
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-gray-500 text-sm">
                      {card.title}
                    </p>

                    <h2 className="text-2xl font-bold mt-2 text-gray-800">
                      {card.value}
                    </h2>
                  </div>

                  <div className="text-3xl">
                    {card.icon}
                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* BOOKING REPORT */}

          <div className="grid lg:grid-cols-2 gap-6">

            <div className="bg-white rounded-2xl shadow-md border p-6">

              <h2 className="text-xl font-bold mb-5">
                📊 Booking Performance
              </h2>

              <div className="space-y-5">

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Confirmed / Completed</span>
                    <span className="font-bold">
                      {confirmedBookings}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Number(bookingSuccessRate)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Pending</span>
                    <span className="font-bold">
                      {pendingBookings}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full"
                      style={{
                        width:
                          totalBookings > 0
                            ? `${(pendingBookings / totalBookings) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Cancelled</span>
                    <span className="font-bold">
                      {cancelledBookings}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full"
                      style={{
                        width:
                          totalBookings > 0
                            ? `${(cancelledBookings / totalBookings) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* STATION REPORT */}

            <div className="bg-white rounded-2xl shadow-md border p-6">

              <h2 className="text-xl font-bold mb-5">
                ⚡ Charging Station Report
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                  <span>Total Stations</span>
                  <strong>{totalStations}</strong>
                </div>

                <div className="flex justify-between p-4 bg-green-50 rounded-xl">
                  <span>Approved Stations</span>
                  <strong className="text-green-600">
                    {approvedStations}
                  </strong>
                </div>

                <div className="flex justify-between p-4 bg-blue-50 rounded-xl">
                  <span>Total Chargers</span>
                  <strong className="text-blue-600">
                    {totalChargers}
                  </strong>
                </div>

                <div className="flex justify-between p-4 bg-yellow-50 rounded-xl">
                  <span>Pending Stations</span>
                  <strong className="text-yellow-600">
                    {Math.max(
                      0,
                      totalStations - approvedStations
                    )}
                  </strong>
                </div>

              </div>

            </div>

          </div>

          {/* REVENUE + PAYMENTS */}

          <div className="grid lg:grid-cols-2 gap-6">

            <div className="bg-white rounded-2xl shadow-md border p-6">

              <h2 className="text-xl font-bold mb-5">
                💰 Revenue Report
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between p-4 bg-green-50 rounded-xl">
                  <span>Total Revenue</span>

                  <strong className="text-green-600 text-xl">
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="flex justify-between p-4 bg-blue-50 rounded-xl">
                  <span>Paid Transactions</span>
                  <strong>
                    {paidBookings.length}
                  </strong>
                </div>

                <div className="flex justify-between p-4 bg-purple-50 rounded-xl">
                  <span>Online Payments</span>
                  <strong>
                    {onlinePayments}
                  </strong>
                </div>

                <div className="flex justify-between p-4 bg-orange-50 rounded-xl">
                  <span>Cash Payments</span>
                  <strong>
                    {cashPayments}
                  </strong>
                </div>

              </div>

            </div>

            {/* CUSTOMER EXPERIENCE */}

            <div className="bg-white rounded-2xl shadow-md border p-6">

              <h2 className="text-xl font-bold mb-5">
                ⭐ Customer Experience
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between p-4 bg-yellow-50 rounded-xl">
                  <span>Total Reviews</span>
                  <strong>
                    {totalReviews}
                  </strong>
                </div>

                <div className="flex justify-between p-4 bg-green-50 rounded-xl">
                  <span>Average Rating</span>
                  <strong className="text-green-600">
                    {averageRating} ⭐
                  </strong>
                </div>

                <div className="flex justify-between p-4 bg-blue-50 rounded-xl">
                  <span>Booking Success Rate</span>
                  <strong className="text-blue-600">
                    {bookingSuccessRate}%
                  </strong>
                </div>

              </div>

            </div>

          </div>

          {/* FOOD + ENTERTAINMENT */}

          <div className="grid lg:grid-cols-2 gap-6">

            <div className="bg-white rounded-2xl shadow-md border p-6">

              <h2 className="text-xl font-bold mb-5">
                🍔 Food Service Report
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between p-4 bg-orange-50 rounded-xl">
                  <span>Available Food Items</span>
                  <strong>
                    {foods.filter(
                      (food) => food.available !== false
                    ).length}
                  </strong>
                </div>

                <div className="flex justify-between p-4 bg-blue-50 rounded-xl">
                  <span>Food Orders / Quantity</span>
                  <strong>
                    {foodOrders}
                  </strong>
                </div>

                <div className="flex justify-between p-4 bg-green-50 rounded-xl">
                  <span>Food Revenue</span>
                  <strong className="text-green-600">
                    ₹{foodRevenue.toLocaleString("en-IN")}
                  </strong>
                </div>

              </div>

            </div>

            <div className="bg-white rounded-2xl shadow-md border p-6">

              <h2 className="text-xl font-bold mb-5">
                🎮 Entertainment Report
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between p-4 bg-purple-50 rounded-xl">
                  <span>Available Services</span>
                  <strong>
                    {entertainment.filter(
                      (item) => item.available !== false
                    ).length}
                  </strong>
                </div>

                <div className="flex justify-between p-4 bg-blue-50 rounded-xl">
                  <span>Entertainment Uses</span>
                  <strong>
                    {entertainmentOrders}
                  </strong>
                </div>

                <div className="flex justify-between p-4 bg-green-50 rounded-xl">
                  <span>Entertainment Revenue</span>
                  <strong className="text-green-600">
                    ₹
                    {entertainmentRevenue.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

              </div>

            </div>

          </div>

          {/* STATION-WISE REPORT */}

          <div className="bg-white rounded-2xl shadow-md border overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-xl font-bold">
                ⚡ Station-wise Report
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Charging station performance from Firestore
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="p-4 text-left">
                      Station
                    </th>

                    <th className="p-4 text-left">
                      Location
                    </th>

                    <th className="p-4 text-left">
                      Chargers
                    </th>

                    <th className="p-4 text-left">
                      Status
                    </th>

                    <th className="p-4 text-left">
                      Approval
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {stations.length === 0 ? (

                    <tr>
                      <td
                        colSpan="5"
                        className="p-8 text-center text-gray-500"
                      >
                        No station data available.
                      </td>
                    </tr>

                  ) : (

                    stations.map((station) => (

                      <tr
                        key={station.id}
                        className="border-t hover:bg-gray-50"
                      >

                        <td className="p-4 font-semibold">
                          {station.stationName ||
                            station.name ||
                            "Unnamed Station"}
                        </td>

                        <td className="p-4 text-gray-600">
                          {station.city ||
                            station.address ||
                            "—"}
                        </td>

                        <td className="p-4">
                          {station.chargers || 0}
                        </td>

                        <td className="p-4">

                          {station.available === true ? (

                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                              Available
                            </span>

                          ) : (

                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                              Unavailable
                            </span>

                          )}

                        </td>

                        <td className="p-4">

                          {station.approvalStatus ===
                          "Approved" ? (

                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                              Approved
                            </span>

                          ) : (

                            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                              Pending
                            </span>

                          )}

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </>
      );
    })()}

  </div>
  ) : activeMenu === "Emergency" ? (
  <div className="space-y-7">

    {(() => {
      const emergencyRequests =
        dashboardData?.emergencyRequests || [];

      const totalRequests = emergencyRequests.length;

      const pendingRequests = emergencyRequests.filter(
        (request) =>
          String(request.status || "").toLowerCase() ===
          "pending"
      ).length;

      const acceptedRequests = emergencyRequests.filter(
        (request) =>
          String(request.status || "").toLowerCase() ===
          "accepted"
      ).length;

      const completedRequests = emergencyRequests.filter(
        (request) =>
          String(request.status || "").toLowerCase() ===
          "completed"
      ).length;

      const updateStatus = async (id, status) => {
        try {
          const response = await fetch(
            `https://charge-connect.onrender.com/emergency/requests/${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status }),
            }
          );

          const data = await response.json();

          if (!data.success) {
            throw new Error(
              data.message || "Status update failed"
            );
          }

          alert("Emergency status updated successfully");

          fetchDashboardData();

        } catch (error) {
          console.error(
            "Emergency Status Error:",
            error
          );

          alert("Unable to update emergency status");
        }
      };

      return (
        <>
          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                🚨 Emergency Management
              </h1>

              <p className="text-gray-500 mt-1">
                Manage customer emergency requests
              </p>
            </div>

            <button
              onClick={fetchDashboardData}
              className="bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-gray-800"
            >
              🔄 Refresh
            </button>

          </div>


          {/* SUMMARY CARDS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <div className="bg-white border rounded-2xl shadow-md p-5">
              <p className="text-gray-500">
                Total Requests
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {totalRequests}
              </h2>
            </div>


            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-md p-5">
              <p className="text-yellow-700">
                Pending
              </p>

              <h2 className="text-3xl font-bold mt-2 text-yellow-700">
                {pendingRequests}
              </h2>
            </div>


            <div className="bg-blue-50 border border-blue-200 rounded-2xl shadow-md p-5">
              <p className="text-blue-700">
                Accepted
              </p>

              <h2 className="text-3xl font-bold mt-2 text-blue-700">
                {acceptedRequests}
              </h2>
            </div>


            <div className="bg-green-50 border border-green-200 rounded-2xl shadow-md p-5">
              <p className="text-green-700">
                Completed
              </p>

              <h2 className="text-3xl font-bold mt-2 text-green-700">
                {completedRequests}
              </h2>
            </div>

          </div>


          {/* EMERGENCY REQUESTS */}

          <div className="bg-white border rounded-2xl shadow-md overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-xl font-bold">
                Emergency Requests
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Customer emergency requests received from the application
              </p>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="p-4 text-left">
                      Customer
                    </th>

                    <th className="p-4 text-left">
                      Mobile
                    </th>

                    <th className="p-4 text-left">
                      Station
                    </th>

                    <th className="p-4 text-left">
                      Service
                    </th>

                    <th className="p-4 text-left">
                      Location
                    </th>

                    <th className="p-4 text-left">
                      Status
                    </th>

                    <th className="p-4 text-left">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {emergencyRequests.length === 0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="p-10 text-center text-gray-500"
                      >
                        🚨 No emergency requests found.
                      </td>

                    </tr>

                  ) : (

                    emergencyRequests.map((request) => (

                      <tr
                        key={request.id}
                        className="border-t hover:bg-gray-50"
                      >

                        {/* CUSTOMER */}

                        <td className="p-4">

                          <p className="font-semibold">
                            {request.userName ||
                              "Unknown User"}
                          </p>

                          <p className="text-xs text-gray-500">
                            {request.userEmail || "—"}
                          </p>

                        </td>


                        {/* MOBILE */}

                        <td className="p-4">
                          {request.userMobile || "—"}
                        </td>


                        {/* STATION */}

                        <td className="p-4">

                          <p className="font-medium">
                            {request.stationName ||
                              "—"}
                          </p>

                          <p className="text-xs text-gray-500">
                            Owner:{" "}
                            {request.ownerName || "—"}
                          </p>

                        </td>


                        {/* SERVICE */}

                        <td className="p-4">

                          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                            {request.service ||
                              "Emergency"}
                          </span>

                        </td>


                        {/* LOCATION */}

                        <td className="p-4">

                          {request.latitude &&
                          request.longitude ? (

                            <a
                              href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              📍 View Location
                            </a>

                          ) : (
                            <span className="text-gray-500">
                              Not available
                            </span>
                          )}

                        </td>


                        {/* STATUS */}

                        <td className="p-4">

                          {String(
                            request.status || ""
                          ).toLowerCase() ===
                          "pending" ? (

                            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                              Pending
                            </span>

                          ) : String(
                              request.status || ""
                            ).toLowerCase() ===
                            "accepted" ? (

                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                              Accepted
                            </span>

                          ) : String(
                              request.status || ""
                            ).toLowerCase() ===
                            "completed" ? (

                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                              Completed
                            </span>

                          ) : (

                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                              {request.status ||
                                "Unknown"}
                            </span>

                          )}

                        </td>


                        {/* ACTION */}

                        <td className="p-4">

                          <select
                            value={
                              request.status ||
                              "Pending"
                            }
                            onChange={(e) =>
                              updateStatus(
                                request.id,
                                e.target.value
                              )
                            }
                            className="border rounded-lg px-3 py-2 text-sm"
                          >

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Accepted">
                              Accepted
                            </option>

                            <option value="Completed">
                              Completed
                            </option>

                            <option value="Cancelled">
                              Cancelled
                            </option>

                          </select>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </>
      );
    })()}

  </div>

  
) : activeMenu !== "Dashboard" ? (


          

            /* ================================================= */
            /* OTHER MENU */
            /* ================================================= */

            <div className="bg-white rounded-2xl border border-gray-100 p-8 min-h-[500px] flex flex-col items-center justify-center text-center">
 

              <h1 className="text-2xl font-bold text-gray-900">
                {activeMenu}
              </h1>

              <p className="text-gray-500 mt-2 max-w-md">
                This section is ready to be connected with your ChargeConnect backend and Firestore data.
              </p>

              <div className="mt-6 px-5 py-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
                Coming Next
              </div>

            </div>

          ) : (

            /* ================================================= */
            /* DASHBOARD */
            /* ================================================= */

            <div className="space-y-7">

              {/* WELCOME */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                <div>

                  <p className="text-sm text-green-700 font-semibold mb-1">
                    ADMIN OVERVIEW
                  </p>

                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Welcome back, Admin 👋
                  </h1>

                  <p className="text-gray-500 mt-1">
                    Here's what's happening across ChargeConnect today.
                  </p>

                </div>

                <button
                  onClick={() =>
                    setActiveMenu("Reports")
                  }
                  className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl text-sm font-semibold transition shadow-sm"
                >
                  📊 View Reports
                </button>

              </div>

              {/* MAIN STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                {/* USERS */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm text-gray-500">
                        Total Users
                      </p>

                      <h2 className="text-3xl font-bold text-gray-900 mt-2">
                        {dashboardData?.stats?.totalUsers || 0}
                      </h2>
                    </div>

                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl">
                      👥
                    </div>

                  </div>

                  <p className="text-xs text-gray-400 mt-4">
                    Registered users
                  </p>

                </div>

                {/* STATIONS */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm text-gray-500">
                        Charging Stations
                      </p>

                      <h2 className="text-3xl font-bold text-gray-900 mt-2">
                        {dashboardData?.stats?.totalStations || 0}
                      </h2>
                    </div>

                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-xl">
                      ⚡
                    </div>

                  </div>

                  <p className="text-xs text-green-600 font-semibold mt-4">
                    {dashboardData?.stats?.availableStations || 0} Active stations
                  </p>

                </div>

                {/* BOOKINGS */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm text-gray-500">
                        Total Bookings
                      </p>

                      <h2 className="text-3xl font-bold text-gray-900 mt-2">
                        {dashboardData?.stats?.totalBookings || 0}
                      </h2>
                    </div>

                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-xl">
                      📅
                    </div>

                  </div>

                  <p className="text-xs text-purple-600 font-semibold mt-4">
                    All bookings
                  </p>

                </div>

                {/* REVENUE */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm text-gray-500">
                        Total Revenue
                      </p>

                      <h2 className="text-3xl font-bold text-gray-900 mt-2">
                        ₹
                        {Number(
                          dashboardData?.stats?.totalRevenue || 0
                        ).toLocaleString("en-IN")}
                      </h2>
                    </div>

                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-xl">
                      ₹
                    </div>

                  </div>

                  <p className="text-xs text-orange-600 font-semibold mt-4">
                    Booking revenue
                  </p>

                </div>

              </div>

              {/* SECOND STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                {/* AVAILABLE CHARGERS */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                      🔋
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Available Chargers
                      </p>

                      <h3 className="text-2xl font-bold text-gray-900">
                        {dashboardData?.stats?.availableChargers || 0}
                      </h3>
                    </div>

                  </div>

                  <p className="text-xs text-green-600 font-semibold mt-4">
                    Chargers available at active stations
                  </p>

                </div>

                {/* PENDING */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
                      ⏳
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Pending Approvals
                      </p>

                      <h3 className="text-2xl font-bold text-gray-900">
                        {dashboardData?.stats?.pendingOwners || 0}
                      </h3>
                    </div>

                  </div>

                  <button
                    onClick={() =>
                      setActiveMenu("Station Owners")
                    }
                    className="text-xs text-orange-600 font-semibold mt-4 hover:underline"
                  >
                    Review station owners →
                  </button>

                </div>

                {/* ACTIVE CHARGERS */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                      🔌
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Active Chargers
                      </p>

                      <h3 className="text-2xl font-bold text-gray-900">
                        {dashboardData?.stats?.availableChargers || 0}
                      </h3>
                    </div>

                  </div>

                  <p className="text-xs text-blue-600 font-semibold mt-4">
                    {dashboardData
                      ? `${dashboardData.stats.availableChargers} chargers currently in operation`
                      : "Loading..."}
                  </p>

                </div>

              </div>

              {/* RECENT BOOKINGS + STATIONS */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* BOOKINGS */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">

                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">

                    <div>
                      <h3 className="font-bold text-gray-900">
                        Recent Bookings
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Latest charging bookings
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setActiveMenu("Bookings")
                      }
                      className="text-sm text-green-700 font-semibold hover:underline"
                    >
                      View All
                    </button>

                  </div>

                  <div className="divide-y divide-gray-100">

                    {loading ? (

                      <p className="p-5 text-gray-500">
                        Loading bookings...
                      </p>

                    ) : dashboardData?.bookings?.length > 0 ? (

                      dashboardData.bookings
                        .slice(0, 4)
                        .map((booking) => (

                          <div
                            key={booking.id}
                            className="p-5 flex items-center justify-between gap-4"
                          >

                            <div className="flex items-center gap-3 min-w-0">

                              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-lg flex-shrink-0">
                                ⚡
                              </div>

                              <div className="min-w-0">

                                <p className="font-semibold text-gray-900 text-sm">
                                  {booking.userName ||
                                    booking.userEmail ||
                                    "Customer"}
                                </p>

                                <p className="text-xs text-gray-500 truncate">
                                  {booking.stationName ||
                                    "Charging Station"}
                                </p>

                                <p className="text-xs text-gray-400">
                                  {booking.bookingDate ||
                                    "N/A"}
                                </p>

                              </div>

                            </div>

                            <div className="text-right flex-shrink-0">

                              <p className="font-bold text-gray-900 text-sm">
                                ₹
                                {Number(
                                  booking.estimatedPrice || 0
                                ).toLocaleString("en-IN")}
                              </p>

                              <span
                                className={`text-xs font-medium ${
                                  booking.status ===
                                  "Completed"
                                    ? "text-green-600"
                                    : booking.status ===
                                        "Confirmed" ||
                                      booking.status ===
                                        "Booked"
                                    ? "text-blue-600"
                                    : "text-orange-600"
                                }`}
                              >
                                {booking.status ||
                                  "Booked"}
                              </span>

                            </div>

                          </div>

                        ))

                    ) : (

                      <p className="p-5 text-gray-500">
                        No bookings found.
                      </p>

                    )}

                  </div>

                </section>

                {/* STATION STATUS */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">

                  <div className="p-5 border-b border-gray-100">

                    <h3 className="font-bold text-gray-900">
                      Charging Station Status
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Current station activity
                    </p>

                  </div>

                  <div className="divide-y divide-gray-100">

                    {dashboardData?.stations?.length > 0 ? (

                      dashboardData.stations
                        .slice(0, 4)
                        .map((station) => (

                          <div
                            key={station.id}
                            className="p-5"
                          >

                            <div className="flex items-center justify-between">

                              <div>

                                <p className="font-semibold text-gray-900 text-sm">
                                  {station.name ||
                                    station.stationName ||
                                    "Charging Station"}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  {station.address ||
                                    station.location ||
                                    "Location not available"}
                                </p>

                              </div>

                              <span
                                className={`px-3 py-2 rounded-full text-xs font-semibold ${
                                  station.available ===
                                  false
                                    ? "bg-red-50 text-red-600"
                                    : "bg-green-50 text-green-600"
                                }`}
                              >
                                {station.available ===
                                false
                                  ? "Offline"
                                  : "Online"}
                              </span>

                            </div>

                            <div className="mt-3">

                              <div className="flex justify-between text-xs">

                                <span className="text-gray-500">
                                  Chargers
                                </span>

                                <span className="font-semibold text-gray-700">
                                  {Number(
                                    station.chargers || 0
                                  )}
                                </span>

                              </div>

                              <div className="w-full h-2 bg-gray-100 rounded-full mt-2">

                                <div
                                  className="h-2 bg-green-500 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      Number(
                                        station.chargers ||
                                          0
                                      ) * 10,
                                      100
                                    )}%`,
                                  }}
                                />

                              </div>

                            </div>

                          </div>

                        ))

                    ) : (

                      <p className="p-5 text-gray-500">
                        No charging stations found.
                      </p>

                    )}

                  </div>

                </section>

              </div>

              {/* PLATFORM STATUS */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Platform Status
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Current ChargeConnect system overview
                    </p>
                  </div>

                  <span className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-full w-fit">

                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>

                    All Systems Operational

                  </span>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                  <div className="border border-gray-100 rounded-xl p-4">

                    <div className="flex justify-between">

                      <p className="text-sm text-gray-500">
                        Active Stations
                      </p>

                      <span className="text-green-600">
                        ●
                      </span>

                    </div>

                    <p className="text-2xl font-bold mt-2">
                      {dashboardData?.stats?.activeStations || 0}
                    </p>

                  </div>

                  <div className="border border-gray-100 rounded-xl p-4">

                    <div className="flex justify-between">

                      <p className="text-sm text-gray-500">
                        Available Chargers
                      </p>

                      <span className="text-green-600">
                        ●
                      </span>

                    </div>

                    <p className="text-2xl font-bold mt-2">
                      {dashboardData?.stats?.availableChargers || 0}
                    </p>

                  </div>

                  <div className="border border-gray-100 rounded-xl p-4">

                    <div className="flex justify-between">

                      <p className="text-sm text-gray-500">
                        Occupied Chargers
                      </p>

                      <span className="text-orange-500">
                        ●
                      </span>

                    </div>

                    <p className="text-2xl font-bold mt-2">
                      {dashboardData?.stats?.occupiedChargers || 0}
                    </p>

                  </div>

                </div>

              </section>

              {/* QUICK ACTIONS */}
              <section>

                <div className="mb-4">

                  <h3 className="font-bold text-gray-900">
                    Quick Actions
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Quickly access important admin sections
                  </p>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                  {/* FOOD */}
                  <button
                    onClick={() =>
                      setActiveMenu(
                        "Food Management"
                      )
                    }
                    className="bg-white border border-gray-100 rounded-2xl p-5 text-left hover:border-orange-300 hover:bg-orange-50 transition shadow-sm"
                  >

                    <div className="w-11 h-11 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center mb-3 text-xl">
                      🍔
                    </div>

                    <p className="font-semibold text-gray-900 text-sm">
                      Manage Food
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Add or edit food items
                    </p>

                  </button>

                  {/* STATIONS */}
                  <button
                    onClick={() =>
                      setActiveMenu(
                        "Charging Stations"
                      )
                    }
                    className="bg-white border border-gray-100 rounded-2xl p-5 text-left hover:border-green-300 hover:bg-green-50 transition shadow-sm"
                  >

                    <div className="w-11 h-11 bg-green-100 text-green-700 rounded-xl flex items-center justify-center mb-3 text-xl">
                      ⚡
                    </div>

                    <p className="font-semibold text-gray-900 text-sm">
                      Manage Stations
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      View charging stations
                    </p>

                  </button>

                  {/* BOOKINGS */}
                  <button
                    onClick={() =>
                      setActiveMenu("Bookings")
                    }
                    className="bg-white border border-gray-100 rounded-2xl p-5 text-left hover:border-blue-300 hover:bg-blue-50 transition shadow-sm"
                  >

                    <div className="w-11 h-11 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-3 text-xl">
                      📅
                    </div>

                    <p className="font-semibold text-gray-900 text-sm">
                      Bookings
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      View all bookings
                    </p>

                  </button>

                  {/* USERS */}
                  <button
                    onClick={() =>
                      setActiveMenu("Users")
                    }
                    className="bg-white border border-gray-100 rounded-2xl p-5 text-left hover:border-purple-300 hover:bg-purple-50 transition shadow-sm"
                  >

                    <div className="w-11 h-11 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center mb-3 text-xl">
                      👥
                    </div>

                    <p className="font-semibold text-gray-900 text-sm">
                      Manage Users
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      View registered users
                    </p>

                  </button>

                </div>

              </section>

            </div>

          )}

          {/* ==================== MECHANIC FORM MODAL ==================== */}
          {showMechanicForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingMechanic ? "Edit EV Mechanic" : "Add EV Mechanic"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {editingMechanic
                        ? "Update mechanic information"
                        : "Add a new EV mechanic"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMechanicForm(false);
                      setEditingMechanic(null);
                    }}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSaveMechanic} className="p-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mechanic Name</label>
                      <input
                        type="text"
                        value={mechanicForm.name}
                        onChange={(e) => setMechanicForm({ ...mechanicForm, name: e.target.value })}
                        placeholder="Enter mechanic name"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={mechanicForm.email}
                        onChange={(e) => setMechanicForm({ ...mechanicForm, email: e.target.value })}
                        placeholder="Enter email"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={mechanicForm.phone}
                        onChange={(e) => setMechanicForm({ ...mechanicForm, phone: e.target.value })}
                        placeholder="Enter phone number"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                      <input
                        type="text"
                        value={mechanicForm.specialization}
                        onChange={(e) => setMechanicForm({ ...mechanicForm, specialization: e.target.value })}
                        placeholder="e.g. EV Battery Specialist"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={mechanicForm.location}
                        onChange={(e) => setMechanicForm({ ...mechanicForm, location: e.target.value })}
                        placeholder="e.g. Hyderabad"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={mechanicForm.rating}
                        onChange={(e) => setMechanicForm({ ...mechanicForm, rating: e.target.value })}
                        placeholder="e.g. 4.8"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                      <input
                        type="text"
                        value={mechanicForm.experience}
                        onChange={(e) => setMechanicForm({ ...mechanicForm, experience: e.target.value })}
                        placeholder="e.g. 6 Years"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                      <select
                        value={mechanicForm.status}
                        onChange={(e) => setMechanicForm({ ...mechanicForm, status: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mechanic Photo</label>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          if (file.size > 5 * 1024 * 1024) {
                            alert("Photo must be less than 5MB");
                            e.target.value = "";
                            return;
                          }

                          setMechanicPhotoFile(file);
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      />

                      <p className="text-xs text-gray-500 mt-2">
                        Select JPG, JPEG, PNG or WEBP. Maximum size: 5MB.
                      </p>
                    </div>

                  </div>

                  {mechanicPhotoFile ? (
                    <div className="mt-5 flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                      <img
                        src={URL.createObjectURL(mechanicPhotoFile)}
                        alt="New mechanic preview"
                        className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">New Photo Selected</p>
                        <p className="text-xs text-gray-500 break-all">
                          {mechanicPhotoFile.name}
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                          This photo will be uploaded when you save.
                        </p>
                      </div>
                    </div>
                  ) : mechanicForm.photo ? (
                    <div className="mt-5 flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <img
                        src={mechanicForm.photo}
                        alt="Current mechanic"
                        className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">Current Photo</p>
                        <p className="text-xs text-gray-500">
                          Choose a new file above to replace this photo.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3">Mechanic Details Preview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Rating</p>
                        <p className="font-semibold text-gray-900">⭐ {mechanicForm.rating || "0.0"}/5</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="font-semibold text-gray-900">{mechanicForm.experience || "0 Years"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className={`font-semibold ${mechanicForm.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                          ● {mechanicForm.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-semibold text-gray-900">📍 {mechanicForm.location || "Not added"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMechanicForm(false);
                        setEditingMechanic(null);
                      }}
                      className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={photoUploading}
                      className={`px-6 py-3 text-white rounded-xl font-semibold shadow-sm transition ${
                        photoUploading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-700 hover:bg-green-800"
                      }`}
                    >
                      {photoUploading
                        ? "Saving..."
                        : editingMechanic
                        ? "Update Mechanic"
                        : "Add Mechanic"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}