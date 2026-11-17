import { useEffect, useMemo, useState } from "react";

import {
  FaChargingStation,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUsers,
  FaChartLine,
  FaCog,
  FaStar,
  FaSignOutAlt,
  FaBars,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBolt,
  FaQrcode,
  FaSearch,
  FaSave,
  FaTimes,
  FaUser,
  FaAmbulance,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

import { db } from "../firebase";

import { Html5QrcodeScanner } from "html5-qrcode";


// ======================================================
// OWNER DASHBOARD
// ======================================================

export default function OwnerDashboard() {
  const navigate = useNavigate();

  // ====================================================
  // MENU
  // ====================================================

  const [menuOpen, setMenuOpen] = useState(false);

  const [activeSection, setActiveSection] =
    useState("dashboard");

  // ====================================================
  // OWNER
  // ====================================================

  const [owner, setOwner] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ====================================================
  // BOOKINGS
  // ====================================================

  const [bookings, setBookings] = useState([]);

  // ====================================================
  // CHARGERS
  // ====================================================

  const [chargerStatus, setChargerStatus] =
    useState([]);

  // ====================================================
  // QR SCANNER
  // ====================================================

  const [scannedBooking, setScannedBooking] =
    useState(null);

  const [scanError, setScanError] =
    useState("");

  const [isScanning, setIsScanning] =
    useState(false);

  // ====================================================
  // SEARCH
  // ====================================================

  const [searchTerm, setSearchTerm] =
    useState("");

  // ====================================================
  // SETTINGS
  // ====================================================

  const [settings, setSettings] =
    useState({
      ownerName: "",
      mobile: "",
      stationName: "",
      address: "",
      city: "",
      state: "",
      openingTime: "",
      closingTime: "",
    });

    const [emergencyRequests,setEmergencyRequests] = useState([]);
    const [emergencyLoading,setEmergencyLoading] = useState(true);

  const [savingSettings, setSavingSettings] =
    useState(false);

  // ====================================================
  // LOGGED OWNER EMAIL
  // ====================================================

  const ownerEmail =
    localStorage.getItem("ownerEmail") ||
    localStorage.getItem("owner_email");

  // ====================================================
  // LOAD OWNER - REALTIME
  // ====================================================

  useEffect(() => {
    if (!ownerEmail) {
      setError(
        "Owner session not found. Please login again."
      );

      setLoading(false);

      return;
    }

    const ownersRef =
      collection(db, "stationOwners");

    const q = query(
      ownersRef,
      where("email", "==", ownerEmail)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const ownerDoc =
            snapshot.docs[0];

          const ownerData = {
            id: ownerDoc.id,
            ...ownerDoc.data(),
          };

          setOwner(ownerData);

          // --------------------------------------------
          // SETTINGS
          // --------------------------------------------

          setSettings({
            ownerName:
              ownerData.ownerName || "",

            mobile:
              ownerData.ownerMobile ||
              ownerData.mobile ||
              "",

            stationName:
              ownerData.stationName || "",

            address:
              ownerData.address || "",

            city:
              ownerData.city || "",

            state:
              ownerData.state || "",

            openingTime:
              ownerData.openingTime || "",

            closingTime:
              ownerData.closingTime || "",
          });

          // --------------------------------------------
          // CHARGERS
          // --------------------------------------------

          const chargerCount =
            Number(ownerData.chargers || 0);

          setChargerStatus(
            (previous) => {
              return Array.from(
                {
                  length: chargerCount,
                },
                (_, index) => ({
                  id: index + 1,

                  status:
                    previous[index]?.status ||
                    "Available",

                  connector:
                    previous[index]?.connector ||
                    ownerData.connectorType ||
                    "CCS2",

                  speed:
                    previous[index]?.speed ||
                    ownerData.chargingSpeed ||
                    "60 kW",
                })
              );
            }
          );
        } else {
          setOwner(null);

          setError(
            "Owner account not found."
          );
        }

        setLoading(false);
      },
      (err) => {
        console.error(
          "Owner realtime error:",
          err
        );

        setError(
          "Unable to load owner information."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ownerEmail]);

  // ====================================================
  // LOAD BOOKINGS - REALTIME
  // ====================================================

  useEffect(() => {
    if (!ownerEmail) return;

    const bookingsRef =
      collection(db, "bookings");

    const q = query(
      bookingsRef,
      where("ownerEmail", "==", ownerEmail)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const bookingData =
          snapshot.docs.map(
            (item) => ({
              id: item.id,
              ...item.data(),
            })
          );

        // Latest first
        bookingData.sort(
          (a, b) => {
            const dateA =
              a.createdAt?.toDate?.() ||
              new Date(
                a.createdAt || 0
              );

            const dateB =
              b.createdAt?.toDate?.() ||
              new Date(
                b.createdAt || 0
              );

            return dateB - dateA;
          }
        );

        setBookings(
          bookingData
        );
      },
      (err) => {
        console.error(
          "Booking realtime error:",
          err
        );

        setError(
          "Unable to load bookings."
        );
      }
    );

    return () => unsubscribe();
  }, [ownerEmail]);

  useEffect(() => {
  if (!ownerEmail) {
    setEmergencyLoading(false);
    return;
  }

  const emergencyRef = collection(db, "emergencyRequests");

  const q = query(
    emergencyRef,
    where("ownerEmail", "==", ownerEmail)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const requests = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      requests.sort((a, b) => {
        const getTime = (value) => {
          if (!value) return 0;

          if (value?.toDate) {
            return value.toDate().getTime();
          }

          if (value?.seconds) {
            return value.seconds * 1000;
          }

          const parsed = new Date(value).getTime();

          return Number.isNaN(parsed) ? 0 : parsed;
        };

        return (
          getTime(b.createdAt) -
          getTime(a.createdAt)
        );
      });

      setEmergencyRequests(requests);
      setEmergencyLoading(false);
    },
    (error) => {
      console.error(
        "Emergency realtime error:",
        error
      );

      setEmergencyLoading(false);
    }
  );

  return () => unsubscribe();
}, [ownerEmail]);

  // ====================================================
  // TODAY
  // ====================================================

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  // ====================================================
  // TODAY BOOKINGS
  // ====================================================

  const todayBookings =
    useMemo(() => {
      return bookings.filter(
        (booking) =>
          booking.bookingDate ===
            today ||
          booking.date === today
      );
    }, [bookings, today]);

  // ====================================================
  // REVENUE
  // ====================================================

  const todayRevenue =
    useMemo(() => {
      return todayBookings
        .filter(
          (booking) =>
            booking.status !==
            "Cancelled"
        )
        .reduce(
          (total, booking) =>
            total +
            Number(
              booking.estimatedPrice ||
                booking.amount ||
                booking.totalAmount ||
                booking.price ||
                0
            ),
          0
        );
    }, [todayBookings]);

  const totalRevenue =
    useMemo(() => {
      return bookings
        .filter(
          (booking) =>
            booking.status !==
            "Cancelled"
        )
        .reduce(
          (total, booking) =>
            total +
            Number(
              booking.estimatedPrice ||
                booking.amount ||
                booking.totalAmount ||
                booking.price ||
                0
            ),
          0
        );
    }, [bookings]);

  // ====================================================
  // BOOKING STATISTICS
  // ====================================================

  const pendingBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
          "Pending" ||
        !booking.status
    );

  const approvedBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "Approved"
    );

  const bookedBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "Booked"
    );

  const checkedInBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "Checked-in"
    );

  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "Cancelled"
    );

  // ====================================================
  // CHARGER STATISTICS
  // ====================================================

  const availableChargers =
    chargerStatus.filter(
      (charger) =>
        charger.status ===
        "Available"
    ).length;

  const occupiedChargers =
    chargerStatus.filter(
      (charger) =>
        charger.status ===
        "Occupied"
    ).length;

    const pendingEmergencyRequests =
  emergencyRequests.filter(
    (request) =>
      request.status === "Pending" ||
      !request.status
  );

  // ====================================================
  // APPROVE BOOKING
  // ====================================================

  const handleApprove =
    async (bookingId) => {
      try {
        await updateDoc(
          doc(
            db,
            "bookings",
            bookingId
          ),
          {
            status: "Approved",
            ownerActionAt:
              new Date(),
          }
        );
      } catch (err) {
        console.error(
          "Approve error:",
          err
        );

        alert(
          "Unable to approve booking."
        );
      }
    };

  // ====================================================
  // REJECT BOOKING
  // ====================================================

  const handleReject =
    async (bookingId) => {
      const confirmReject =
        window.confirm(
          "Are you sure you want to reject this booking?"
        );

      if (!confirmReject)
        return;

      try {
        await updateDoc(
          doc(
            db,
            "bookings",
            bookingId
          ),
          {
            status: "Cancelled",
            ownerActionAt:
              new Date(),
          }
        );
      } catch (err) {
        console.error(
          "Reject error:",
          err
        );

        alert(
          "Unable to reject booking."
        );
      }
    };

    const updateEmergencyStatus = async (
requestId,
status
) => {
try {
await updateDoc(
doc(db, "emergencyRequests", requestId),
{
status,
updatedAt: serverTimestamp(),
}
);
} catch (error) {
console.error(
"Emergency status update error:",
error
);

alert("Unable to update emergency request.");

}
};

  // ====================================================
  // CHARGER STATUS
  // ====================================================

  const toggleChargerStatus =
    (chargerId) => {
      setChargerStatus(
        (previous) =>
          previous.map(
            (charger) => {
              if (
                charger.id !==
                chargerId
              ) {
                return charger;
              }

              return {
                ...charger,

                status:
                  charger.status ===
                  "Available"
                    ? "Occupied"
                    : "Available",
              };
            }
          )
      );
    };

  // ====================================================
  // QR SCANNER START
  // ====================================================

  const startQRScanner =
    () => {
      setScannedBooking(
        null
      );

      setScanError("");

      setIsScanning(true);

      setTimeout(() => {
        const scanner =
          new Html5QrcodeScanner(
            "owner-qr-reader",
            {
              fps: 10,

              qrbox: {
                width: 250,
                height: 250,
              },

              rememberLastUsedCamera:
                true,
            },
            false
          );

        scanner.render(
          async (
            decodedText
          ) => {
            try {
              let qrData;

              try {
                qrData =
                  JSON.parse(
                    decodedText
                  );
              } catch {
                throw new Error(
                  "Invalid ChargeConnect QR code."
                );
              }

              if (
                !qrData.bookingId
              ) {
                throw new Error(
                  "Booking ID not found in QR."
                );
              }

              // ------------------------------------------
              // GET BOOKING
              // ------------------------------------------

              const bookingRef =
                doc(
                  db,
                  "bookings",
                  qrData.bookingId
                );

              const bookingSnap =
                await getDoc(
                  bookingRef
                );

              if (
                !bookingSnap.exists()
              ) {
                throw new Error(
                  "Booking not found."
                );
              }

              const booking = {
                id: bookingSnap.id,
                ...bookingSnap.data(),
              };

              // ------------------------------------------
              // OWNER VALIDATION
              // ------------------------------------------

              if (
                booking.ownerEmail &&
                ownerEmail &&
                booking.ownerEmail.toLowerCase() !==
                  ownerEmail.toLowerCase()
              ) {
                throw new Error(
                  "This booking belongs to another station."
                );
              }

              // ------------------------------------------
              // ALREADY CHECKED IN
              // ------------------------------------------

              if (
                booking.status ===
                "Checked-in"
              ) {
                setScannedBooking(
                  booking
                );

                setScanError(
                  "This booking is already checked-in."
                );

                scanner.clear();

                setIsScanning(
                  false
                );

                return;
              }

              setScannedBooking(
                booking
              );

              setScanError("");

              await scanner.clear();

              setIsScanning(
                false
              );
            } catch (err) {
              console.error(
                "QR Scan Error:",
                err
              );

              setScanError(
                err.message ||
                  "Unable to verify QR."
              );
            }
          },

          () => {
            // Scanner continuously checks.
          }
        );
      }, 300);
    };

  // ====================================================
  // STOP SCANNER
  // ====================================================

  const stopQRScanner =
    () => {
      setIsScanning(
        false
      );

      setScanError("");
    };

  // ====================================================
  // VERIFY / CHECK-IN
  // ====================================================

  const verifyBooking =
    async () => {
      if (
        !scannedBooking
      ) {
        return;
      }

      if (
        scannedBooking.status ===
        "Cancelled"
      ) {
        alert(
          "Cancelled booking cannot be checked-in."
        );

        return;
      }

      try {
        await updateDoc(
          doc(
            db,
            "bookings",
            scannedBooking.id
          ),
          {
            status:
              "Checked-in",

            checkedIn:
              true,

            checkedInAt:
              new Date().toISOString(),

            ownerActionAt:
              new Date(),
          }
        );

        setScannedBooking(
          (previous) => ({
            ...previous,

            status:
              "Checked-in",

            checkedIn: true,
          })
        );

        alert(
          "Booking verified successfully!"
        );
      } catch (err) {
        console.error(
          "Check-in error:",
          err
        );

        alert(
          "Unable to verify booking."
        );
      }
    };

  // ====================================================
  // SAVE SETTINGS
  // ====================================================

  const handleSaveSettings =
    async () => {
      if (!owner?.id) {
        return;
      }

      try {
        setSavingSettings(
          true
        );

        await updateDoc(
          doc(
            db,
            "stationOwners",
            owner.id
          ),
          {
            ownerName:
              settings.ownerName,

            ownerMobile:
              settings.mobile,

            stationName:
              settings.stationName,

            address:
              settings.address,

            city:
              settings.city,

            state:
              settings.state,

            openingTime:
              settings.openingTime,

            closingTime:
              settings.closingTime,

            updatedAt:
              new Date(),
          }
        );

        alert(
          "Settings updated successfully!"
        );
      } catch (err) {
        console.error(
          "Settings error:",
          err
        );

        alert(
          "Unable to update settings."
        );
      } finally {
        setSavingSettings(
          false
        );
      }
    };

  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout =
    () => {
      localStorage.removeItem(
        "ownerEmail"
      );

      localStorage.removeItem(
        "owner_email"
      );

      localStorage.removeItem(
        "ownerId"
      );

      navigate(
        "/owner-login"
      );
    };

  // ====================================================
  // FILTER BOOKINGS
  // ====================================================

  const filteredBookings =
    bookings.filter(
      (booking) => {
        const search =
          searchTerm
            .toLowerCase()
            .trim();

        if (!search) {
          return true;
        }

        return (
          String(
            booking.userName ||
              ""
          )
            .toLowerCase()
            .includes(search) ||

          String(
            booking.userEmail ||
              ""
          )
            .toLowerCase()
            .includes(search) ||

          String(
            booking.vehicleNumber ||
              ""
          )
            .toLowerCase()
            .includes(search) ||

          String(
            booking.stationName ||
              ""
          )
            .toLowerCase()
            .includes(search)
        );
      }
    );

  // ====================================================
  // UNIQUE CUSTOMERS
  // ====================================================

  const customers =
    useMemo(() => {
      const map =
        new Map();

      bookings.forEach(
        (booking) => {
          const key =
            booking.userEmail ||
            booking.uid ||
            booking.userName;

          if (!key) return;

          if (
            !map.has(key)
          ) {
            map.set(key, {
              name:
                booking.userName ||
                "Customer",

              email:
                booking.userEmail ||
                "--",

              bookings: 0,

              totalSpent: 0,
            });
          }

          const customer =
            map.get(key);

          customer.bookings += 1;

          if (
            booking.status !==
            "Cancelled"
          ) {
            customer.totalSpent +=
              Number(
                booking.estimatedPrice ||
                  booking.amount ||
                  booking.totalAmount ||
                  0
              );
          }
        }
      );

      return Array.from(
        map.values()
      );
    }, [bookings]);

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="text-center">

          <FaChargingStation
            className="text-green-600 mx-auto animate-pulse"
            size={55}
          />

          <p className="mt-4 text-gray-600 font-medium">
            Loading Owner Dashboard...
          </p>

        </div>

      </div>
    );
  }

  // ====================================================
  // OWNER NOT FOUND
  // ====================================================

  if (!owner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">

          <FaTimesCircle
            className="text-red-500 mx-auto"
            size={55}
          />

          <h2 className="text-2xl font-bold mt-5">
            Owner Account Not Found
          </h2>

          <p className="text-gray-500 mt-3">
            Please login again to
            access your Station
            Owner Dashboard.
          </p>

          <button
            onClick={() =>
              navigate(
                "/owner-login"
              )
            }
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Go to Owner Login
          </button>

        </div>

      </div>
    );
  }

  // ====================================================
  // SIDEBAR ITEM
  // ====================================================

  const SidebarItem = ({
    icon,
    label,
    section,
  }) => (
    <li
      onClick={() => {
        setActiveSection(
          section
        );

        setMenuOpen(false);

        if (
          section !==
          "scan"
        ) {
          setScannedBooking(
            null
          );

          setScanError("");
        }
      }}
      className={`
        flex items-center gap-3
        px-4 py-3 rounded-xl
        cursor-pointer transition
        ${
          activeSection ===
          section
            ? "bg-white text-green-700 font-bold"
            : "hover:bg-green-600 text-white"
        }
      `}
    >
      {icon}
      {label}
    </li>
  );

  // ====================================================
  // MAIN DASHBOARD
  // ====================================================

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`
          bg-green-700
          text-white
          w-72
          p-6
          fixed
          md:relative
          h-full
          min-h-screen
          z-50
          transition-all
          duration-300
          ${
            menuOpen
              ? "left-0"
              : "-left-80"
          }
          md:left-0
        `}
      >

        <h1 className="text-3xl font-bold mb-2">
          ChargeConnect
        </h1>

        <p className="text-green-200 text-sm mb-8">
          Station Owner Portal
        </p>

        <ul className="space-y-2">

          <SidebarItem
            icon={
              <FaChartLine />
            }
            label="Dashboard"
            section="dashboard"
          />

          <SidebarItem
            icon={
              <FaCalendarAlt />
            }
            label="Bookings"
            section="bookings"
          />

          <SidebarItem
            icon={
              <FaChargingStation />
            }
            label="Chargers"
            section="chargers"
          />

          <SidebarItem
            icon={
              <FaMoneyBillWave />
            }
            label="Revenue"
            section="revenue"
          />

          <SidebarItem
            icon={
              <FaUsers />
            }
            label="Customers"
            section="customers"
          />

          <SidebarItem
            icon={
              <FaStar />
            }
            label="Reviews"
            section="reviews"
          />

          <SidebarItem
            icon={
              <FaQrcode />
            }
            label="Scan Booking"
            section="scan"
          />

        <SidebarItem
  icon={
    <FaAmbulance />
  }
  label="Emergency"
  section="emergency"
/>

          <SidebarItem
            icon={
              <FaCog />
            }
            label="Settings"
            section="settings"
          />

          <li
            onClick={
              handleLogout
            }
            className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-red-600 transition"
          >
            <FaSignOutAlt />
            Logout
          </li>

        </ul>

      </aside>

      {/* ==================================================
          MAIN AREA
      ================================================== */}

      <main className="flex-1 min-w-0">

        {/* ==================================================
            TOP BAR
        ================================================== */}

        <div className="bg-white shadow p-5 flex justify-between items-center sticky top-0 z-40">

          <div className="flex items-center gap-4">

            <button
              className="md:hidden"
              onClick={() =>
                setMenuOpen(
                  !menuOpen
                )
              }
            >
              <FaBars
                size={22}
              />
            </button>

            <div>

              <h2 className="text-2xl md:text-3xl font-bold text-green-700">
                {activeSection ===
                "dashboard"
                  ? "Station Owner Dashboard"
                  : activeSection ===
                    "bookings"
                  ? "Bookings"
                  : activeSection ===
                    "chargers"
                  ? "Chargers"
                  : activeSection ===
                    "revenue"
                  ? "Revenue"
                  : activeSection ===
                    "customers"
                  ? "Customers"
                  : activeSection ===
                    "reviews"
                  ? "Reviews"
                  : activeSection ===
                    "scan"
                  ? "Scan Booking QR"
                  : "Settings"}
              </h2>

              <p className="text-gray-500">
                Welcome back,{" "}
                {owner.ownerName ||
                  "Station Owner"}
                !
              </p>

            </div>

          </div>

          <div className="hidden md:block text-right">

            <h3 className="font-bold">
              {owner.stationName ||
                "Charging Station"}
            </h3>

            <p className="text-gray-500 text-sm">
              {owner.city || ""}
              {owner.city &&
              owner.state
                ? ", "
                : ""}
              {owner.state ||
                ""}
            </p>

          </div>

        </div>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="p-5 md:p-8">

          {error && (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          {/* ==================================================
              DASHBOARD
          ================================================== */}

          {activeSection ===
            "dashboard" && (
            <>

              {/* STATION STATUS */}

              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                  <div>

                    <p className="text-gray-500 text-sm">
                      Registered Station
                    </p>

                    <h2 className="text-2xl font-bold text-green-700 mt-1">
                      {owner.stationName ||
                        "Charging Station"}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {owner.address ||
                        ""}
                    </p>

                  </div>

                  <span
                    className={`
                      px-5 py-2 rounded-full
                      font-semibold
                      ${
                        owner.status ===
                        "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >
                    {owner.status ||
                      "Pending Verification"}
                  </span>

                </div>

              </div>

              {/* STATISTICS */}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <StatCard
                  title="Today's Bookings"
                  value={
                    todayBookings.length
                  }
                  icon={
                    <FaCalendarAlt
                      className="text-green-600"
                      size={40}
                    />
                  }
                />

                <StatCard
                  title="Today's Revenue"
                  value={`₹${todayRevenue.toLocaleString(
                    "en-IN"
                  )}`}
                  icon={
                    <FaMoneyBillWave
                      className="text-blue-600"
                      size={40}
                    />
                  }
                />

                <StatCard
                  title="Available Chargers"
                  value={
                    availableChargers
                  }
                  icon={
                    <FaChargingStation
                      className="text-green-600"
                      size={40}
                    />
                  }
                />

                <StatCard
                  title="Occupied Chargers"
                  value={
                    occupiedChargers
                  }
                  icon={
                    <FaBolt
                      className="text-red-500"
                      size={40}
                    />
                  }
                />

              </div>

              {/* BOOKING SUMMARY */}

              <div className="grid md:grid-cols-4 gap-6 mt-8">

                <SummaryCard
                  title="Pending"
                  value={
                    pendingBookings.length
                  }
                  className="bg-yellow-50 text-yellow-700"
                />

                <SummaryCard
                  title="Booked"
                  value={
                    bookedBookings.length
                  }
                  className="bg-blue-50 text-blue-700"
                />

                <SummaryCard
                  title="Checked-in"
                  value={
                    checkedInBookings.length
                  }
                  className="bg-green-50 text-green-700"
                />

                <SummaryCard
                  title="Cancelled"
                  value={
                    cancelledBookings.length
                  }
                  className="bg-red-50 text-red-700"
                />

              </div>

              {/* RECENT BOOKINGS */}

              <div className="bg-white rounded-2xl shadow-lg mt-8 p-6">

                <div className="flex justify-between items-center mb-6">

                  <div>

                    <h2 className="text-2xl font-bold text-green-700">
                      Recent Booking Requests
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                      Updates automatically from Firestore
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setActiveSection(
                        "bookings"
                      )
                    }
                    className="text-green-700 font-semibold"
                  >
                    View All
                  </button>

                </div>

                {bookings.length ===
                0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No bookings yet.
                  </p>
                ) : (
                  <div className="space-y-4">

                    {bookings
                      .slice(0, 5)
                      .map(
                        (
                          booking
                        ) => (
                          <BookingRow
                            key={
                              booking.id
                            }
                            booking={
                              booking
                            }
                            onApprove={
                              handleApprove
                            }
                            onReject={
                              handleReject
                            }
                          />
                        )
                      )}

                  </div>
                )}

              </div>

            </>
          )}

          {/* ==================================================
              BOOKINGS
          ================================================== */}

          {activeSection ===
            "bookings" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">

              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-green-700">
                    All Booking Requests
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Realtime booking updates
                  </p>

                </div>

                <div className="relative">

                  <FaSearch className="absolute left-3 top-3 text-gray-400" />

                  <input
                    value={
                      searchTerm
                    }
                    onChange={(
                      e
                    ) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    placeholder="Search customer, email, vehicle..."
                    className="border rounded-xl py-2 pl-10 pr-4 w-full md:w-80"
                  />

                </div>

              </div>

              {filteredBookings.length ===
              0 ? (
                <div className="text-center py-12 text-gray-500">
                  No bookings found.
                </div>
              ) : (
                <div className="space-y-4">

                  {filteredBookings.map(
                    (
                      booking
                    ) => (
                      <BookingRow
                        key={
                          booking.id
                        }
                        booking={
                          booking
                        }
                        onApprove={
                          handleApprove
                        }
                        onReject={
                          handleReject
                        }
                      />
                    )
                  )}

                </div>
              )}

            </div>
          )}

          {/* ==================================================
              CHARGERS
          ================================================== */}

          {activeSection ===
            "chargers" && (
            <div>

              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

                <h2 className="text-2xl font-bold text-green-700">
                  Charger Management
                </h2>

                <p className="text-gray-500 mt-1">
                  Manage charger availability at your station.
                </p>

              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {chargerStatus.length ===
                0 ? (
                  <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500 md:col-span-3">
                    No chargers registered.
                  </div>
                ) : (
                  chargerStatus.map(
                    (
                      charger
                    ) => (
                      <div
                        key={
                          charger.id
                        }
                        className="bg-white rounded-2xl shadow-lg p-6"
                      >

                        <div className="flex justify-between">

                          <div>

                            <div className="flex items-center gap-3">

                              <FaChargingStation
                                className="text-green-600"
                                size={30}
                              />

                              <h3 className="text-xl font-bold">
                                Charger{" "}
                                {
                                  charger.id
                                }
                              </h3>

                            </div>

                            <p className="text-gray-500 mt-3">
                              Connector:{" "}
                              {
                                charger.connector
                              }
                            </p>

                            <p className="text-gray-500">
                              Speed:{" "}
                              {
                                charger.speed
                              }
                            </p>

                          </div>

                          <span
                            className={`px-3 py-1 h-fit rounded-full text-sm font-bold ${
                              charger.status ===
                              "Available"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {
                              charger.status
                            }
                          </span>

                        </div>

                        <button
                          onClick={() =>
                            toggleChargerStatus(
                              charger.id
                            )
                          }
                          className={`w-full mt-5 py-3 rounded-xl font-bold text-white ${
                            charger.status ===
                            "Available"
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {charger.status ===
                          "Available"
                            ? "Mark Occupied"
                            : "Mark Available"}
                        </button>

                      </div>
                    )
                  )
                )}

              </div>

            </div>
          )}

          {/* ==================================================
              REVENUE
          ================================================== */}

          {activeSection ===
            "revenue" && (
            <div className="space-y-6">

              <div className="grid md:grid-cols-3 gap-6">

                <RevenueCard
                  title="Total Revenue"
                  value={totalRevenue}
                  icon={
                    <FaMoneyBillWave />
                  }
                />

                <RevenueCard
                  title="Today's Revenue"
                  value={todayRevenue}
                  icon={
                    <FaCalendarAlt />
                  }
                />

                <RevenueCard
                  title="Paid Bookings"
                  value={
                    bookings.filter(
                      (booking) =>
                        booking.paymentStatus ===
                        "Paid"
                    ).length
                  }
                  icon={
                    <FaCheckCircle />
                  }
                />

              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-2xl font-bold text-green-700 mb-6">
                  Revenue Transactions
                </h2>

                {bookings.length ===
                0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No transactions.
                  </p>
                ) : (
                  <div className="overflow-x-auto">

                    <table className="w-full">

                      <thead>

                        <tr className="border-b">

                          <th className="text-left p-3">
                            Customer
                          </th>

                          <th className="text-left p-3">
                            Date
                          </th>

                          <th className="text-left p-3">
                            Payment
                          </th>

                          <th className="text-left p-3">
                            Status
                          </th>

                          <th className="text-right p-3">
                            Amount
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {bookings.map(
                          (
                            booking
                          ) => (
                            <tr
                              key={
                                booking.id
                              }
                              className="border-b"
                            >

                              <td className="p-3">
                                {
                                  booking.userName
                                }
                              </td>

                              <td className="p-3">
                                {
                                  booking.bookingDate
                                }
                              </td>

                              <td className="p-3">
                                {
                                  booking.paymentStatus ||
                                  booking.paymentMethod ||
                                  "--"
                                }
                              </td>

                              <td className="p-3">
                                {
                                  booking.status ||
                                  "Booked"
                                }
                              </td>

                              <td className="p-3 text-right font-bold text-green-700">
                                ₹
                                {Number(
                                  booking.estimatedPrice ||
                                    booking.amount ||
                                    booking.totalAmount ||
                                    0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>
                )}

              </div>

            </div>
          )}

          {/* ==================================================
              CUSTOMERS
          ================================================== */}

          {activeSection ===
            "customers" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">

              <div className="mb-6">

                <h2 className="text-2xl font-bold text-green-700">
                  Customers
                </h2>

                <p className="text-gray-500">
                  Customers who booked your station.
                </p>

              </div>

              {customers.length ===
              0 ? (
                <div className="text-center py-12 text-gray-500">
                  No customers yet.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                  {customers.map(
                    (
                      customer,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="border rounded-2xl p-5 hover:shadow-md transition"
                      >

                        <div className="flex items-center gap-4">

                          <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                            <FaUser />
                          </div>

                          <div>

                            <h3 className="font-bold text-lg">
                              {
                                customer.name
                              }
                            </h3>

                            <p className="text-sm text-gray-500 break-all">
                              {
                                customer.email
                              }
                            </p>

                          </div>

                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">

                          <div className="bg-gray-50 rounded-xl p-3">

                            <p className="text-xs text-gray-500">
                              Bookings
                            </p>

                            <p className="font-bold text-green-700">
                              {
                                customer.bookings
                              }
                            </p>

                          </div>

                          <div className="bg-gray-50 rounded-xl p-3">

                            <p className="text-xs text-gray-500">
                              Spent
                            </p>

                            <p className="font-bold text-blue-700">
                              ₹
                              {customer.totalSpent.toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          )}

          {/* ==================================================
              REVIEWS
          ================================================== */}

          {activeSection ===
            "reviews" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h2 className="text-2xl font-bold text-green-700">
                Customer Reviews
              </h2>

              <p className="text-gray-500 mt-1 mb-6">
                Review information from customer bookings.
              </p>

              <div className="grid md:grid-cols-2 gap-5">

                {bookings.filter(
                  (booking) =>
                    booking.rating ||
                    booking.review ||
                    booking.reviewText
                ).length ===
                0 ? (
                  <div className="md:col-span-2 text-center py-12">

                    <FaStar
                      size={50}
                      className="mx-auto text-yellow-400 mb-4"
                    />

                    <h3 className="text-xl font-bold">
                      No Reviews Yet
                    </h3>

                    <p className="text-gray-500 mt-2">
                      Customer reviews will appear here.
                    </p>

                  </div>
                ) : (
                  bookings
                    .filter(
                      (booking) =>
                        booking.rating ||
                        booking.review ||
                        booking.reviewText
                    )
                    .map(
                      (
                        booking
                      ) => (
                        <div
                          key={
                            booking.id
                          }
                          className="border rounded-2xl p-5"
                        >

                          <div className="flex justify-between">

                            <h3 className="font-bold">
                              {
                                booking.userName
                              }
                            </h3>

                            <div className="text-yellow-500">
                              {"★".repeat(
                                Number(
                                  booking.rating ||
                                    5
                                )
                              )}
                            </div>

                          </div>

                          <p className="text-gray-600 mt-3">
                            {booking.review ||
                              booking.reviewText ||
                              "No review text"}
                          </p>

                        </div>
                      )
                    )
                )}

              </div>

            </div>
          )}

          {/* ==================================================
              QR SCANNER
          ================================================== */}

          {activeSection ===
            "scan" && (
            <div className="space-y-6">

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                    <FaQrcode
                      className="text-green-700"
                      size={30}
                    />
                  </div>

                  <div>

                    <h2 className="text-2xl font-bold text-green-700">
                      Scan Booking QR
                    </h2>

                    <p className="text-gray-500">
                      Scan the customer's booking QR to verify entry.
                    </p>

                  </div>

                </div>

              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">

                {!isScanning && (
                  <div className="text-center">

                    <FaQrcode
                      size={80}
                      className="mx-auto text-green-600 mb-5"
                    />

                    <h3 className="text-xl font-bold">
                      Ready to Scan
                    </h3>

                    <p className="text-gray-500 mt-2">
                      Allow camera permission when requested.
                    </p>

                    <button
                      onClick={
                        startQRScanner
                      }
                      className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold"
                    >
                      Start QR Scanner
                    </button>

                  </div>
                )}

                {isScanning && (
                  <div>

                    <div
                      id="owner-qr-reader"
                      className="max-w-md mx-auto"
                    />

                    <button
                      onClick={
                        stopQRScanner
                      }
                      className="w-full max-w-md mx-auto mt-4 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2"
                    >
                      <FaTimes />
                      Stop Scanner
                    </button>

                  </div>
                )}

                {scanError && (
                  <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center font-semibold">
                    {scanError}
                  </div>
                )}

              </div>

              {/* SCANNED BOOKING */}

              {scannedBooking && (
                <div className="bg-white rounded-2xl shadow-lg p-6">

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

                    <div>

                      <h2 className="text-2xl font-bold text-green-700">
                        Booking Found
                      </h2>

                      <p className="text-sm text-gray-500">
                        ID:{" "}
                        {
                          scannedBooking.id
                        }
                      </p>

                    </div>

                    <span
                      className={`px-4 py-2 rounded-full font-bold w-fit ${
                        scannedBooking.status ===
                        "Checked-in"
                          ? "bg-green-100 text-green-700"
                          : scannedBooking.status ===
                            "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {
                        scannedBooking.status
                      }
                    </span>

                  </div>

                  <div className="grid md:grid-cols-2 gap-4">

                    <DetailBox
                      title="Customer"
                      value={
                        scannedBooking.userName ||
                        "--"
                      }
                    />

                    <DetailBox
                      title="Email"
                      value={
                        scannedBooking.userEmail ||
                        "--"
                      }
                    />

                    <DetailBox
                      title="Vehicle"
                      value={
                        scannedBooking.vehicleNumber ||
                        "--"
                      }
                    />

                    <DetailBox
                      title="Date"
                      value={
                        scannedBooking.bookingDate ||
                        "--"
                      }
                    />

                    <DetailBox
                      title="Time"
                      value={
                        scannedBooking.bookingSlot ||
                        "--"
                      }
                    />

                    <DetailBox
                      title="Connector"
                      value={
                        scannedBooking.connector ||
                        "--"
                      }
                    />

                    <DetailBox
                      title="Duration"
                      value={
                        scannedBooking.duration
                          ? `${scannedBooking.duration} minutes`
                          : "--"
                      }
                    />

                    <DetailBox
                      title="Payment"
                      value={
                        scannedBooking.paymentStatus ||
                        scannedBooking.paymentMethod ||
                        "--"
                      }
                    />

                    <DetailBox
                      title="Amount"
                      value={`₹${Number(
                        scannedBooking.estimatedPrice ||
                          scannedBooking.amount ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}`}
                    />

                  </div>

                  {scannedBooking.status !==
                    "Checked-in" &&
                    scannedBooking.status !==
                      "Cancelled" && (
                      <button
                        onClick={
                          verifyBooking
                        }
                        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2"
                      >
                        <FaCheckCircle />
                        Verify Booking &
                        Check-in
                      </button>
                    )}

                  {scannedBooking.status ===
                    "Checked-in" && (
                    <div className="mt-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-5 text-center font-bold">
                      <FaCheckCircle
                        className="inline mr-2"
                      />
                      Customer Checked-in Successfully
                    </div>
                  )}

                  {scannedBooking.status ===
                    "Cancelled" && (
                    <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 text-center font-bold">
                      This booking has been cancelled.
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          

{activeSection === "emergency" && (
  <div className="space-y-6">

    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Emergency Requests
        </h1>

        <p className="text-gray-500 mt-1">
          Customer emergency requests for your station
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3">
        <p className="text-sm text-red-600">
          Pending Requests
        </p>

        <p className="text-2xl font-bold text-red-700">
          {pendingEmergencyRequests.length}
        </p>
      </div>

    </div>


    {/* Loading */}
    {emergencyLoading ? (

      <div className="bg-white rounded-2xl shadow p-10 text-center">

        <div className="animate-spin w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full mx-auto"></div>

        <p className="mt-4 text-gray-500">
          Loading emergency requests...
        </p>

      </div>

    ) : emergencyRequests.length === 0 ? (

      /* No requests */

      <div className="bg-white rounded-2xl shadow p-10 text-center">

        <FaAmbulance className="text-gray-300 text-5xl mx-auto" />

        <h3 className="text-lg font-semibold text-gray-700 mt-4">
          No Emergency Requests
        </h3>

        <p className="text-gray-500 mt-1">
          New emergency requests will appear here in realtime.
        </p>

      </div>

    ) : (

      /* Requests */

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {emergencyRequests.map((request) => {

          const status =
            request.status || "Pending";

          return (

            <div
              key={request.id}
              className="bg-white rounded-2xl shadow-md border border-red-200 overflow-hidden"
            >

              {/* Header */}

              <div className="p-5 border-b">

                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">

                      <FaAmbulance className="text-red-600 text-xl" />

                    </div>

                    <div>

                      <h3 className="font-bold text-gray-800">
                        {request.emergencyType ||
                          "Emergency Request"}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {request.stationName ||
                          "Charging Station"}
                      </p>

                    </div>

                  </div>


                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      status === "Pending"
                        ? "bg-red-100 text-red-700"
                        : status === "Accepted"
                        ? "bg-yellow-100 text-yellow-700"
                        : status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {status}
                  </span>

                </div>

              </div>


              {/* Details */}

              <div className="p-5 space-y-4">

                {/* Customer */}

                <div>

                  <p className="text-xs text-gray-500">
                    Customer
                  </p>

                  <p className="font-semibold text-gray-800">
                    {request.userName ||
                      "Unknown User"}
                  </p>

                  {request.userEmail && (
                    <p className="text-sm text-gray-500">
                      {request.userEmail}
                    </p>
                  )}

                </div>


                {/* Phone */}

                {request.userMobile && (

                  <a
                    href={`tel:${request.userMobile}`}
                    className="flex items-center gap-3 text-green-600 font-semibold"
                  >

                    <FaPhone />

                    {request.userMobile}

                  </a>

                )}


                {/* Station */}

                <div className="flex items-start gap-3">

                  <FaMapMarkerAlt className="text-red-500 mt-1" />

                  <div>

                    <p className="text-sm font-semibold text-gray-700">
                      {request.stationName ||
                        "Charging Station"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {request.address || ""}
                    </p>

                  </div>

                </div>


                {/* Message */}

                {request.message && (

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-xs text-gray-500">
                      Message
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      {request.message}
                    </p>

                  </div>

                )}


                {/* Customer Location */}

                {request.latitude != null &&
                  request.longitude != null && (

                    <a
                      href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 border border-blue-200 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50"
                    >

                      <FaMapMarkerAlt />

                      View Customer Location

                    </a>

                  )}


                {/* Created Time */}

                {request.createdAt && (

                  <div className="flex items-center gap-2 text-sm text-gray-500">

                    <FaClock />

                    <span>

                      {request.createdAt?.toDate
                        ? request.createdAt
                            .toDate()
                            .toLocaleString()
                        : String(
                            request.createdAt
                          )}

                    </span>

                  </div>

                )}


                {/* Actions */}

                {status === "Pending" && (

                  <div className="grid grid-cols-2 gap-3 pt-2">

                    <button
                      onClick={() =>
                        updateEmergencyStatus(
                          request.id,
                          "Accepted"
                        )
                      }
                      className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
                    >

                      <FaCheckCircle />

                      Accept

                    </button>


                    <button
                      onClick={() =>
                        updateEmergencyStatus(
                          request.id,
                          "Cancelled"
                        )
                      }
                      className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200"
                    >

                      <FaTimesCircle />

                      Decline

                    </button>

                  </div>

                )}


                {/* Resolve */}

                {status === "Accepted" && (

                  <button
                    onClick={() =>
                      updateEmergencyStatus(
                        request.id,
                        "Resolved"
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
                  >

                    <FaCheckCircle />

                    Mark as Resolved

                  </button>

                )}


                {/* Resolved */}

                {status === "Resolved" && (

                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-center font-semibold">

                    Emergency Request Resolved

                  </div>

                )}

              </div>

            </div>

          );

        })}

      </div>

    )}

  </div>
)}

          {/* ==================================================
              SETTINGS
          ================================================== */}

          {activeSection ===
            "settings" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">

              <div className="mb-8">

                <h2 className="text-2xl font-bold text-green-700">
                  Station Settings
                </h2>

                <p className="text-gray-500 mt-1">
                  Update your owner and station information.
                </p>

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <InputField
                  label="Owner Name"
                  value={
                    settings.ownerName
                  }
                  onChange={(
                    value
                  ) =>
                    setSettings({
                      ...settings,
                      ownerName:
                        value,
                    })
                  }
                />

                <InputField
                  label="Mobile Number"
                  value={
                    settings.mobile
                  }
                  onChange={(
                    value
                  ) =>
                    setSettings({
                      ...settings,
                      mobile:
                        value,
                    })
                  }
                />

                <InputField
                  label="Station Name"
                  value={
                    settings.stationName
                  }
                  onChange={(
                    value
                  ) =>
                    setSettings({
                      ...settings,
                      stationName:
                        value,
                    })
                  }
                />

                <InputField
                  label="City"
                  value={
                    settings.city
                  }
                  onChange={(
                    value
                  ) =>
                    setSettings({
                      ...settings,
                      city: value,
                    })
                  }
                />

                <InputField
                  label="State"
                  value={
                    settings.state
                  }
                  onChange={(
                    value
                  ) =>
                    setSettings({
                      ...settings,
                      state: value,
                    })
                  }
                />

                <InputField
                  label="Opening Time"
                  type="time"
                  value={
                    settings.openingTime
                  }
                  onChange={(
                    value
                  ) =>
                    setSettings({
                      ...settings,
                      openingTime:
                        value,
                    })
                  }
                />

                <InputField
                  label="Closing Time"
                  type="time"
                  value={
                    settings.closingTime
                  }
                  onChange={(
                    value
                  ) =>
                    setSettings({
                      ...settings,
                      closingTime:
                        value,
                    })
                  }
                />

              </div>

              <div className="mt-5">

                <label className="font-semibold text-gray-700">
                  Station Address
                </label>

                <textarea
                  rows="4"
                  value={
                    settings.address
                  }
                  onChange={(
                    e
                  ) =>
                    setSettings({
                      ...settings,
                      address:
                        e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3 mt-2"
                />

              </div>

              <button
                onClick={
                  handleSaveSettings
                }
                disabled={
                  savingSettings
                }
                className="mt-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2"
              >
                <FaSave />

                {savingSettings
                  ? "Saving..."
                  : "Save Settings"}
              </button>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}


// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-green-700 mt-2">
            {value}
          </h2>

        </div>

        {icon}

      </div>

    </div>
  );
}


// ======================================================
// SUMMARY CARD
// ======================================================

function SummaryCard({
  title,
  value,
  className,
}) {
  return (
    <div
      className={`${className} rounded-2xl p-6`}
    >

      <p className="text-gray-600">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>

    </div>
  );
}


// ======================================================
// REVENUE CARD
// ======================================================

function RevenueCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-green-700 mt-2">
            {typeof value ===
            "number"
              ? `₹${value.toLocaleString(
                  "en-IN"
                )}`
              : value}
          </h2>

        </div>

        <div className="text-green-600 text-3xl">
          {icon}
        </div>

      </div>

    </div>
  );
}


// ======================================================
// BOOKING ROW
// ======================================================

function BookingRow({
  booking,
  onApprove,
  onReject,
}) {
  return (
    <div className="border rounded-2xl p-5">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div className="flex-1">

          <div className="flex flex-wrap items-center gap-3">

            <h3 className="text-lg font-bold">
              {booking.userName ||
                "Customer"}
            </h3>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                booking.status ===
                "Cancelled"
                  ? "bg-red-100 text-red-700"
                  : booking.status ===
                    "Checked-in"
                  ? "bg-green-100 text-green-700"
                  : booking.status ===
                    "Approved"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {booking.status ||
                "Pending"}
            </span>

          </div>

          <p className="text-gray-500 text-sm mt-1">
            {booking.userEmail ||
              "--"}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">

            <MiniDetail
              label="Date"
              value={
                booking.bookingDate ||
                booking.date ||
                "--"
              }
            />

            <MiniDetail
              label="Time"
              value={
                booking.bookingSlot ||
                booking.time ||
                "--"
              }
            />

            <MiniDetail
              label="Vehicle"
              value={
                booking.vehicleNumber ||
                "--"
              }
            />

            <MiniDetail
              label="Amount"
              value={`₹${Number(
                booking.estimatedPrice ||
                  booking.amount ||
                  booking.totalAmount ||
                  0
              )}`}
            />

          </div>

        </div>

        {(booking.status ===
          "Pending" ||
          !booking.status) && (
          <div className="flex gap-3">

            <button
              onClick={() =>
                onApprove(
                  booking.id
                )
              }
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
            >
              <FaCheckCircle />
              Approve
            </button>

            <button
              onClick={() =>
                onReject(
                  booking.id
                )
              }
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
            >
              <FaTimesCircle />
              Reject
            </button>

          </div>
        )}

      </div>

    </div>
  );
}


// ======================================================
// MINI DETAIL
// ======================================================

function MiniDetail({
  label,
  value,
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="font-semibold text-sm mt-1 break-words">
        {value}
      </p>

    </div>
  );
}


// ======================================================
// DETAIL BOX
// ======================================================

function DetailBox({
  title,
  value,
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="font-bold text-gray-800 mt-1 break-words">
        {value}
      </p>

    </div>
  );
}


// ======================================================
// INPUT FIELD
// ======================================================

function InputField({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>

      <label className="font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full border rounded-xl p-3 mt-2"
      />

    </div>
  );
}