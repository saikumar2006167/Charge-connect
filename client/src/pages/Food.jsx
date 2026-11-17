
import { useState } from "react";

const foodItems = [
  {
    id: 1,
    name: "Veg Burger",
    category: "Burgers",
    price: 149,
    time: "10-15 min",
    emoji: "🍔",
  },
  {
    id: 2,
    name: "Chicken Burger",
    category: "Burgers",
    price: 199,
    time: "10-15 min",
    emoji: "🍔",
  },
  {
    id: 3,
    name: "Veg Pizza",
    category: "Pizza",
    price: 249,
    time: "15-20 min",
    emoji: "🍕",
  },
  {
    id: 4,
    name: "French Fries",
    category: "Snacks",
    price: 99,
    time: "8-10 min",
    emoji: "🍟",
  },
  {
    id: 5,
    name: "Cold Coffee",
    category: "Drinks",
    price: 129,
    time: "5-8 min",
    emoji: "🥤",
  },
  {
    id: 6,
    name: "Sandwich",
    category: "Snacks",
    price: 129,
    time: "8-12 min",
    emoji: "🥪",
  },
];

function Food() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const categories = ["All", "Burgers", "Pizza", "Snacks", "Drinks"];

  const filteredFood =
    selectedCategory === "All"
      ? foodItems
      : foodItems.filter(
          (item) => item.category === selectedCategory
        );

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-green-700 text-white px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          <div>
            <p className="text-green-200 text-sm">
              While your vehicle is charging ⚡
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-1">
              Grab a Bite 🍔
            </h1>

            <p className="text-green-100 mt-2">
              Order food and enjoy your charging time.
            </p>
          </div>

          {/* CART */}
          <div className="bg-white text-green-700 px-4 py-3 rounded-xl font-semibold">
            🛒 {cart.length}
          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* LOCATION */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-7">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center text-xl">
              📍
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Ordering near
              </p>

              <h3 className="font-bold text-gray-900">
                Your Charging Station
              </h3>

              <p className="text-sm text-gray-500">
                Food will be prepared while you charge
              </p>
            </div>
          </div>

        </div>

        {/* CATEGORIES */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-7">

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-3 rounded-xl whitespace-nowrap text-sm font-semibold transition ${
                selectedCategory === category
                  ? "bg-green-700 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-green-50"
              }`}
            >
              {category}
            </button>
          ))}

        </div>

        {/* SECTION TITLE */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            Popular Food
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Quick bites that are ready before your vehicle finishes charging.
          </p>
        </div>

        {/* FOOD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredFood.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition"
            >

              {/* IMAGE AREA */}
              <div className="h-44 bg-green-50 flex items-center justify-center text-7xl">
                {item.emoji}
              </div>

              {/* DETAILS */}
              <div className="p-5">

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      ⭐ 4.5 • {item.category}
                    </p>
                  </div>

                  <span className="text-lg font-bold text-green-700">
                    ₹{item.price}
                  </span>

                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
                  ⏱️ Ready in {item.time}
                </div>

                <button
                  onClick={() => addToCart(item)}
                  className="w-full mt-4 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold transition"
                >
                  + Add to Cart
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* CART MESSAGE */}
        {cart.length > 0 && (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-5">

            <div>
              <p className="font-semibold">
                🛒 {cart.length} item{cart.length > 1 ? "s" : ""} added
              </p>

              <p className="text-xs text-gray-300">
                Your food will be ready while you charge.
              </p>
            </div>

            <button
              onClick={() => alert("Cart page coming next!")}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold"
            >
              View Cart
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default Food;
