
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  addBooking,
  getBookings,
} from "../services/bookingService";

import { getAuth } from "firebase/auth";

import {
  createOrder,
  verifyPayment,
} from "../services/paymentService";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  const station = location.state?.station;

  // ============================
  // BOOKING STATES
  // ============================
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [connector, setConnector] = useState("CCS2");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("online");

  // ============================
  // FOOD STATES
  // ============================
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [foodLoading, setFoodLoading] = useState(true);

  // ============================
  // ENTERTAINMENT STATES
  // ============================
  const [entertainmentItems, setEntertainmentItems] =
    useState([]);

  const [entertainmentCart, setEntertainmentCart] =
    useState([]);

  const [entertainmentLoading, setEntertainmentLoading] =
    useState(true);

  // ============================
  // TIME SLOTS
  // ============================
  const slots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  // ============================
  // PRICE CALCULATION
  // ============================

  const chargingPrice = Number(duration) * 5;

  const foodTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  const entertainmentTotal =
    entertainmentCart.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          Number(item.quantity),
      0
    );

  const finalTotal =
    chargingPrice +
    foodTotal +
    entertainmentTotal;

  // ============================
  // LOAD FOOD
  // ============================
  useEffect(() => {
    const loadFoods = async () => {
      try {
        setFoodLoading(true);

        const response = await fetch(
          "https://charge-connect.https://charge-connect.onrender.com/foods"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load food"
          );
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setFoodItems(
            data.filter(
              (food) =>
                food.available !== false
            )
          );
        } else {
          setFoodItems([]);
        }
      } catch (error) {
        console.error(
          "Food loading error:",
          error
        );

        setFoodItems([]);
      } finally {
        setFoodLoading(false);
      }
    };

    loadFoods();
  }, []);

  // ============================
  // LOAD ENTERTAINMENT
  // ============================
  useEffect(() => {
    const loadEntertainment = async () => {
      try {
        setEntertainmentLoading(true);

        const response = await fetch(
          "https://charge-connect.onrender.com/entertainment"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load entertainment"
          );
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setEntertainmentItems(
            data.filter(
              (item) =>
                item.available !== false
            )
          );
        } else {
          setEntertainmentItems([]);
        }
      } catch (error) {
        console.error(
          "Entertainment loading error:",
          error
        );

        setEntertainmentItems([]);
      } finally {
        setEntertainmentLoading(false);
      }
    };

    loadEntertainment();
  }, []);

  // ============================
  // ADD FOOD
  // ============================
  const addFoodToCart = (food) => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === food.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === food.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...food,
          quantity: 1,
        },
      ];
    });
  };

  // ============================
  // INCREASE FOOD
  // ============================
  const increaseFood = (foodId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === foodId
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  // ============================
  // DECREASE FOOD
  // ============================
  const decreaseFood = (foodId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === foodId
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // ============================
  // FOOD QUANTITY
  // ============================
  const getFoodQuantity = (foodId) => {
    const item = cart.find(
      (item) => item.id === foodId
    );

    return item ? item.quantity : 0;
  };

  // ============================
  // ADD ENTERTAINMENT
  // ============================
  const addEntertainmentToCart = (
    entertainment
  ) => {
    setEntertainmentCart(
      (currentCart) => {
        const existing =
          currentCart.find(
            (item) =>
              item.id ===
              entertainment.id
          );

        if (existing) {
          return currentCart.map(
            (item) =>
              item.id ===
              entertainment.id
                ? {
                    ...item,
                    quantity:
                      item.quantity + 1,
                  }
                : item
          );
        }

        return [
          ...currentCart,
          {
            ...entertainment,
            quantity: 1,
          },
        ];
      }
    );
  };

  // ============================
  // INCREASE ENTERTAINMENT
  // ============================
  const increaseEntertainment = (
    itemId
  ) => {
    setEntertainmentCart(
      (currentCart) =>
        currentCart.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
    );
  };

  // ============================
  // DECREASE ENTERTAINMENT
  // ============================
  const decreaseEntertainment = (
    itemId
  ) => {
    setEntertainmentCart(
      (currentCart) =>
        currentCart
          .map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity:
                    item.quantity - 1,
                }
              : item
          )
          .filter(
            (item) =>
              item.quantity > 0
          )
    );
  };

  // ============================
  // ENTERTAINMENT QUANTITY
  // ============================
  const getEntertainmentQuantity = (
    itemId
  ) => {
    const item =
      entertainmentCart.find(
        (item) =>
          item.id === itemId
      );

    return item ? item.quantity : 0;
  };

  // ============================
  // LOAD BOOKED SLOTS
  // ============================
  useEffect(() => {
    if (!date || !station) return;

    const loadBookedSlots = async () => {
      try {
        const user =
          auth.currentUser;

        if (!user) return;

        const bookings =
          await getBookings(
            user.email
          );

        const booked = bookings
          .filter(
            (booking) =>
              booking.stationName ===
                station.name &&
              booking.bookingDate ===
                date
          )
          .map(
            (booking) =>
              booking.bookingSlot
          );

        setBookedSlots(booked);
      } catch (error) {
        console.error(
          "Booked slots error:",
          error
        );
      }
    };

    loadBookedSlots();
  }, [date, station]);

  // ============================
  // ONLINE PAYMENT
  // ============================
  const handleOnlinePayment =
    async () => {
      try {
        if (!window.Razorpay) {
          alert(
            "Razorpay is not loaded. Please refresh the page."
          );
          return;
        }

        const order =
          await createOrder(
            finalTotal
          );

        const options = {
          key:
            import.meta.env
              .VITE_RAZORPAY_KEY,

          amount: order.amount,

          currency:
            order.currency,

          name: "ChargeConnect",

          description:
            "EV Charging + Food + Entertainment Booking",

          order_id: order.id,

          handler: async (
            response
          ) => {
            try {
              const verification =
                await verifyPayment(
                  response
                );

              if (
                verification.success
              ) {
                alert(
                  "✅ Payment Verified Successfully"
                );

                await handleBooking(
                  "Paid"
                );
              } else {
                alert(
                  "❌ Payment Verification Failed"
                );
              }
            } catch (error) {
              console.error(error);

              alert(
                "❌ Payment Verification Failed"
              );
            }
          },

          prefill: {
            name:
              auth.currentUser
                ?.displayName || "",

            email:
              auth.currentUser
                ?.email || "",
          },

          theme: {
            color: "#16a34a",
          },
        };

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.open();
      } catch (error) {
        console.error(
          "Payment error:",
          error
        );

        alert("❌ Payment Failed");
      }
    };

  // ============================
  // CREATE BOOKING
  // ============================
  const handleBooking = async (
    paymentStatusOverride = null
  ) => {
    if (!date || !time) {
      alert(
        "Please select date and time"
      );
      return;
    }

    if (!vehicleNumber.trim()) {
      alert(
        "Please enter vehicle number"
      );
      return;
    }

    if (bookedSlots.includes(time)) {
      alert(
        "This slot is already booked."
      );
      return;
    }

    try {
      const user =
        auth.currentUser;

      if (!user) {
        alert("Please Login First");
        return;
      }

      // ============================
      // SELECTED FOOD
      // ============================
      const selectedFood =
        cart.map((item) => ({
          foodId: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(
            item.quantity
          ),
          total:
            Number(item.price) *
            Number(item.quantity),
        }));

      // ============================
      // SELECTED ENTERTAINMENT
      // ============================
      const selectedEntertainment =
        entertainmentCart.map(
          (item) => ({
            entertainmentId:
              item.id,

            name: item.name,

            category:
              item.category ||
              "Entertainment",

            duration:
              item.duration ||
              "30 min",

            price: Number(
              item.price
            ),

            quantity: Number(
              item.quantity
            ),

            total:
              Number(item.price) *
              Number(item.quantity),
          })
        );

      // ============================
      // ADD BOOKING
      // ============================
      await addBooking({

        uid: user.uid,

        userEmail: user.email,

        userName:
          user.displayName || "",

        stationId: station.id,

        stationName: station.name,

        ownerName:
          station.ownerName || "",

        ownerMobile:
          station.ownerMobile || "",

        ownerEmail:
          station.ownerEmail || "",

        address:
          station.address || "",

        chargers:
          station.chargers || "",

        available:
          station.available,

        bookingDate: date,

        bookingSlot: time,

        duration,

        connector,

        vehicleNumber:
          vehicleNumber
            .trim()
            .toUpperCase(),

        // CHARGING
        chargingPrice,

        // FOOD
        foodItems:
          selectedFood,

        foodTotal,

        // ENTERTAINMENT
        entertainmentItems:
          selectedEntertainment,

        entertainmentTotal,

        // FINAL PRICE
        estimatedPrice:
          finalTotal,

        // PAYMENT
        paymentMethod,

        paymentStatus:
          paymentStatusOverride ||
          (paymentMethod ===
          "online"
            ? "Paid"
            : "Cash"),

        status: "Booked",

        createdAt:
          new Date().toLocaleString(),
      });

      // ============================
      // SUCCESS
      // ============================
      alert(
        "✅ Booking Confirmed Successfully!"
      );

      setTime("");

      setVehicleNumber("");

      setCart([]);

      setEntertainmentCart([]);

      navigate("/my-bookings");

    } catch (error) {
      console.error(
        "Booking error:",
        error
      );

      alert("❌ Booking Failed");
    }
  };

  // ============================
  // NO STATION
  // ============================
  if (!station) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white p-10 rounded-2xl shadow text-center">

          <h2 className="text-2xl font-bold text-red-500">
            No Station Selected
          </h2>

          <p className="text-gray-500 mt-2">
            Please select a charging station first.
          </p>

          <button
            onClick={() =>
              navigate("/stations")
            }
            className="mt-5 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Go to Stations
          </button>

        </div>

      </div>
    );
  }

  // ============================
  // UI
  // ============================
  return (
    <div className="bg-gray-100 min-h-screen py-10 px-5">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-green-600 mb-6">
          Book Charging Slot
        </h1>

        {/* STATION INFO */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">

          <h2 className="text-xl font-bold">
            {station.name}
          </h2>

          <p className="mt-2 text-gray-700">
            🔌 Chargers:{" "}
            {station.chargers ||
              "Available"}
          </p>

          <p className="mt-1 text-gray-700">
            Status:{" "}
            {station.available ? (
              <span className="text-green-600 font-semibold">
                ✅ Available
              </span>
            ) : (
              <span className="text-red-600 font-semibold">
                ❌ Busy
              </span>
            )}
          </p>

          {station.address && (
            <p className="mt-1 text-gray-600">
              📍 {station.address}
            </p>
          )}

        </div>

        {/* DATE */}
        <label className="font-semibold">
          Select Date
        </label>

        <input
          type="date"
          className="w-full border rounded-xl p-3 mt-2 mb-5"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
          min={
            new Date()
              .toISOString()
              .split("T")[0]
          }
        />

        {/* TIME */}
        <label className="font-semibold">
          Select Time Slot
        </label>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 mb-6">

          {slots.map((slot) => {
            const booked =
              bookedSlots.includes(
                slot
              );

            return (
              <button
                key={slot}
                type="button"
                disabled={booked}
                onClick={() =>
                  setTime(slot)
                }
                className={`rounded-lg p-3 border transition font-semibold ${
                  booked
                    ? "bg-red-500 text-white cursor-not-allowed"
                    : time === slot
                    ? "bg-green-600 text-white"
                    : "bg-white hover:bg-green-50"
                }`}
              >
                {booked
                  ? `❌ ${slot}`
                  : time === slot
                  ? `✓ ${slot}`
                  : slot}
              </button>
            );
          })}

        </div>

        {/* DURATION */}
        <label className="font-semibold">
          Charging Duration
        </label>

        <select
          className="w-full border rounded-xl p-3 mt-2 mb-5"
          value={duration}
          onChange={(e) =>
            setDuration(
              e.target.value
            )
          }
        >
          <option value="30">
            30 Minutes
          </option>

          <option value="60">
            60 Minutes
          </option>

          <option value="90">
            90 Minutes
          </option>

          <option value="120">
            120 Minutes
          </option>
        </select>

        {/* VEHICLE */}
        <label className="font-semibold">
          Vehicle Number
        </label>

        <input
          type="text"
          placeholder="TS09AB1234"
          className="w-full border rounded-xl p-3 mt-2 mb-5"
          value={vehicleNumber}
          onChange={(e) =>
            setVehicleNumber(
              e.target.value.toUpperCase()
            )
          }
        />

        {/* CONNECTOR */}
        <label className="font-semibold">
          Connector Type
        </label>

        <select
          className="w-full border rounded-xl p-3 mt-2 mb-6"
          value={connector}
          onChange={(e) =>
            setConnector(
              e.target.value
            )
          }
        >
          <option value="CCS2">
            CCS2
          </option>

          <option value="Type 2">
            Type 2
          </option>

          <option value="CHAdeMO">
            CHAdeMO
          </option>

          <option value="GB/T">
            GB/T
          </option>
        </select>

        {/* ============================ */}
        {/* FOOD */}
        {/* ============================ */}

        <div className="border-t pt-6 mt-4">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-2xl font-bold">
                🍔 Food & Refreshments
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Order food while your vehicle
                is charging.
              </p>

            </div>

            {cart.length > 0 && (
              <span className="bg-green-100 text-green-700 px-3 py-2 rounded-lg font-bold">
                🛒{" "}
                {cart.reduce(
                  (sum, item) =>
                    sum +
                    item.quantity,
                  0
                )}
              </span>
            )}

          </div>

          {foodLoading ? (

            <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
              Loading food items...
            </div>

          ) : foodItems.length === 0 ? (

            <div className="bg-gray-50 rounded-xl p-6 text-center">

              <div className="text-4xl mb-2">
                🍽️
              </div>

              <p className="font-semibold">
                No food available
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Food items added by admin will
                appear here.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {foodItems.map(
                (food) => {

                  const quantity =
                    getFoodQuantity(
                      food.id
                    );

                  return (
                    <div
                      key={food.id}
                      className="border rounded-2xl p-4 hover:shadow-md transition"
                    >

                      <div className="flex items-center justify-between gap-3">

                        <div className="flex items-center gap-3">

                          <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center text-3xl">
                            {food.emoji ||
                              "🍴"}
                          </div>

                          <div>

                            <h3 className="font-bold">
                              {food.name}
                            </h3>

                            <p className="text-xs text-gray-500">
                              {food.category ||
                                "Food"}
                            </p>

                            <p className="text-xs text-gray-500">
                              ⏱️{" "}
                              {food.preparationTime ||
                                "10-15 min"}
                            </p>

                            <p className="font-bold text-green-700 mt-1">
                              ₹
                              {Number(
                                food.price
                              )}
                            </p>

                          </div>

                        </div>

                        {quantity === 0 ? (

                          <button
                            type="button"
                            onClick={() =>
                              addFoodToCart(
                                food
                              )
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            + Add
                          </button>

                        ) : (

                          <div className="flex items-center gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                decreaseFood(
                                  food.id
                                )
                              }
                              className="w-9 h-9 rounded-lg bg-gray-100 font-bold text-lg"
                            >
                              −
                            </button>

                            <span className="font-bold min-w-[20px] text-center">
                              {quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseFood(
                                  food.id
                                )
                              }
                              className="w-9 h-9 rounded-lg bg-green-100 text-green-700 font-bold text-lg"
                            >
                              +
                            </button>

                          </div>

                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

        {/* ============================ */}
        {/* SELECTED FOOD */}
        {/* ============================ */}

        {cart.length > 0 && (
          <div className="mt-6 bg-orange-50 border border-orange-100 rounded-2xl p-5">

            <h3 className="text-lg font-bold mb-4">
              🛒 Your Food Order
            </h3>

            <div className="space-y-3">

              {cart.map(
                (item) => (

                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-white rounded-xl p-3"
                  >

                    <div>

                      <p className="font-semibold">
                        {item.emoji ||
                          "🍴"}{" "}
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        ₹{item.price} ×{" "}
                        {item.quantity}
                      </p>

                    </div>

                    <p className="font-bold text-green-700">
                      ₹
                      {Number(
                        item.price
                      ) *
                        item.quantity}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>
        )}

        {/* ============================ */}
        {/* ENTERTAINMENT */}
        {/* ============================ */}

        <div className="border-t pt-6 mt-6">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-2xl font-bold">
                🎮 Entertainment & Kids Zone
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Enjoy your waiting time while your vehicle
                is charging.
              </p>

            </div>

            {entertainmentCart.length >
              0 && (
              <span className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg font-bold">
                🎮{" "}
                {entertainmentCart.reduce(
                  (sum, item) =>
                    sum +
                    item.quantity,
                  0
                )}
              </span>
            )}

          </div>

          {entertainmentLoading ? (

            <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
              Loading entertainment...
            </div>

          ) : entertainmentItems.length ===
            0 ? (

            <div className="bg-gray-50 rounded-xl p-6 text-center">

              <div className="text-4xl mb-2">
                🎮
              </div>

              <p className="font-semibold">
                No entertainment available
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Entertainment services added by admin
                will appear here.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {entertainmentItems.map(
                (item) => {

                  const quantity =
                    getEntertainmentQuantity(
                      item.id
                    );

                  return (
                    <div
                      key={item.id}
                      className="border rounded-2xl p-4 hover:shadow-md transition"
                    >

                      <div className="flex items-center justify-between gap-3">

                        <div className="flex items-center gap-3">

                          <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center text-3xl">
                            {item.emoji ||
                              "🎮"}
                          </div>

                          <div>

                            <h3 className="font-bold">
                              {item.name}
                            </h3>

                            <p className="text-xs text-gray-500">
                              {item.category ||
                                "Entertainment"}
                            </p>

                            <p className="text-xs text-gray-500">
                              ⏱️{" "}
                              {item.duration ||
                                "30 min"}
                            </p>

                            <p className="font-bold text-purple-700 mt-1">
                              ₹
                              {Number(
                                item.price
                              )}
                            </p>

                          </div>

                        </div>

                        {quantity === 0 ? (

                          <button
                            type="button"
                            onClick={() =>
                              addEntertainmentToCart(
                                item
                              )
                            }
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            + Book
                          </button>

                        ) : (

                          <div className="flex items-center gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                decreaseEntertainment(
                                  item.id
                                )
                              }
                              className="w-9 h-9 rounded-lg bg-gray-100 font-bold text-lg"
                            >
                              −
                            </button>

                            <span className="font-bold min-w-[20px] text-center">
                              {quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseEntertainment(
                                  item.id
                                )
                              }
                              className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 font-bold text-lg"
                            >
                              +
                            </button>

                          </div>

                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

        {/* ============================ */}
        {/* SELECTED ENTERTAINMENT */}
        {/* ============================ */}

        {entertainmentCart.length >
          0 && (
          <div className="mt-6 bg-purple-50 border border-purple-100 rounded-2xl p-5">

            <h3 className="text-lg font-bold mb-4">
              🎮 Your Entertainment Booking
            </h3>

            <div className="space-y-3">

              {entertainmentCart.map(
                (item) => (

                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-white rounded-xl p-3"
                  >

                    <div>

                      <p className="font-semibold">
                        {item.emoji ||
                          "🎮"}{" "}
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        ₹{item.price} ×{" "}
                        {item.quantity}
                      </p>

                    </div>

                    <p className="font-bold text-purple-700">
                      ₹
                      {Number(
                        item.price
                      ) *
                        item.quantity}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>
        )}

        {/* ============================ */}
        {/* PRICE SUMMARY */}
        {/* ============================ */}

        <div className="bg-green-50 rounded-2xl p-5 mt-6">

          <h3 className="text-xl font-bold text-green-700 mb-4">
            💰 Price Summary
          </h3>

          <div className="flex justify-between mb-2">

            <span>
              Charging Cost
            </span>

            <span className="font-semibold">
              ₹{chargingPrice}
            </span>

          </div>

          <div className="flex justify-between mb-2">

            <span>
              Food & Refreshments
            </span>

            <span className="font-semibold">
              ₹{foodTotal}
            </span>

          </div>

          <div className="flex justify-between mb-3">

            <span>
              🎮 Entertainment
            </span>

            <span className="font-semibold">
              ₹{entertainmentTotal}
            </span>

          </div>

          <div className="border-t pt-3 flex justify-between">

            <span className="text-lg font-bold">
              Grand Total
            </span>

            <span className="text-2xl font-bold text-green-700">
              ₹{finalTotal}
            </span>

          </div>

          <p className="text-sm text-gray-500 mt-3">
            Charging: ₹5 per minute
          </p>

        </div>

        {/* ============================ */}
        {/* PAYMENT */}
        {/* ============================ */}

        <div className="mt-6 bg-white rounded-xl p-5 shadow border">

          <h3 className="text-xl font-bold mb-4">
            Payment Method
          </h3>

          <label className="flex items-center gap-3 mb-3 cursor-pointer">

            <input
              type="radio"
              checked={
                paymentMethod ===
                "online"
              }
              onChange={() =>
                setPaymentMethod(
                  "online"
                )
              }
            />

            <span>
              💳 Online Payment
            </span>

          </label>

          <label className="flex items-center gap-3 cursor-pointer">

            <input
              type="radio"
              checked={
                paymentMethod ===
                "cash"
              }
              onChange={() =>
                setPaymentMethod(
                  "cash"
                )
              }
            />

            <span>
              💵 Cash at Station
            </span>

          </label>

        </div>

        {/* ============================ */}
        {/* CONFIRM BOOKING */}
        {/* ============================ */}

        <button
          type="button"
          onClick={() => {
            if (
              paymentMethod ===
              "cash"
            ) {
              handleBooking(
                "Cash"
              );
            } else {
              handleOnlinePayment();
            }
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-lg transition mt-6"
        >
          ✅ Confirm Booking — ₹
          {finalTotal}
        </button>

      </div>

    </div>
  );
}

