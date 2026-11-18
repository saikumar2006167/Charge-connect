import { useEffect, useState } from "react";

const API = "https://charge-connect.onrender.com/foods";

export default function FoodManagement() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Fast Food",
    preparationTime: "10-15 min",
    emoji: "🍔",
    available: true,
  });

  // ============================
  // LOAD FOOD
  // ============================
  const loadFoods = async () => {
    try {
      setLoading(true);

      const response = await fetch(API);
      const data = await response.json();

      setFoods(data);
    } catch (error) {
      console.error("Load food error:", error);
      alert("Unable to load food items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  // ============================
  // FORM CHANGE
  // ============================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ============================
  // RESET FORM
  // ============================
  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      category: "Fast Food",
      preparationTime: "10-15 min",
      emoji: "🍔",
      available: true,
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ============================
  // ADD / UPDATE FOOD
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      alert("Please enter food name and price");
      return;
    }

    try {
      const url = editingId
        ? `${API}/${editingId}`
        : API;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(
        editingId
          ? "✅ Food updated successfully"
          : "✅ Food added successfully"
      );

      resetForm();
      loadFoods();
    } catch (error) {
      console.error("Save food error:", error);
      alert("❌ " + error.message);
    }
  };

  // ============================
  // EDIT FOOD
  // ============================
  const handleEdit = (food) => {
    setForm({
      name: food.name || "",
      price: food.price || "",
      category: food.category || "Fast Food",
      preparationTime:
        food.preparationTime || "10-15 min",
      emoji: food.emoji || "🍴",
      available: food.available !== false,
    });

    setEditingId(food.id);
    setShowForm(true);
  };

  // ============================
  // DELETE FOOD
  // ============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this food?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      alert("🗑️ Food deleted successfully");

      loadFoods();
    } catch (error) {
      console.error("Delete food error:", error);
      alert("❌ " + error.message);
    }
  };

  // ============================
  // TOGGLE AVAILABILITY
  // ============================
  const toggleAvailability = async (food) => {
    try {
      const response = await fetch(`${API}/${food.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...food,
          available: !food.available,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update availability");
      }

      loadFoods();
    } catch (error) {
      console.error(error);
      alert("❌ Could not update availability");
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <p className="text-sm text-green-600 font-semibold">
            FOOD MANAGEMENT
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
            Food & Refreshments 🍔
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage food suggestions available during EV charging.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl font-semibold shadow-sm"
        >
          + Add Food
        </button>

      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex justify-between items-center mb-5">

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? "Edit Food" : "Add New Food"}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                This food will appear during station booking.
              </p>
            </div>

            <button
              onClick={resetForm}
              className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              ✕
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            {/* NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Food Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Veg Burger"
                className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Price
              </label>

              <input
                name="price"
                type="number"
                min="1"
                value={form.price}
                onChange={handleChange}
                placeholder="149"
                className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3"
              >
                <option>Fast Food</option>
                <option>Pizza</option>
                <option>Snacks</option>
                <option>Beverages</option>
                <option>Healthy</option>
                <option>Dessert</option>
              </select>
            </div>

            {/* PREPARATION TIME */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Preparation Time
              </label>

              <select
                name="preparationTime"
                value={form.preparationTime}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3"
              >
                <option>5-8 min</option>
                <option>8-10 min</option>
                <option>10-15 min</option>
                <option>15-20 min</option>
                <option>20-30 min</option>
              </select>
            </div>

            {/* EMOJI */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Food Icon
              </label>

              <input
                name="emoji"
                value={form.emoji}
                onChange={handleChange}
                placeholder="🍔"
                className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 text-xl"
              />
            </div>

            {/* AVAILABLE */}
            <div className="flex items-center gap-3 mt-7">

              <input
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={handleChange}
                className="w-5 h-5 accent-green-600"
              />

              <div>
                <p className="font-semibold text-gray-800">
                  Available
                </p>

                <p className="text-xs text-gray-500">
                  Show this item to customers
                </p>
              </div>

            </div>

            {/* BUTTONS */}
            <div className="md:col-span-2 flex gap-3 pt-2">

              <button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold"
              >
                {editingId ? "Update Food" : "Save Food"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* FOOD LIST */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="p-5 border-b border-gray-100 flex items-center justify-between">

          <div>
            <h3 className="font-bold text-gray-900">
              Food Items
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              {foods.length} items in your menu
            </p>
          </div>

          <span className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-semibold">
            {foods.filter((food) => food.available).length} Available
          </span>

        </div>

        {loading ? (

          <div className="p-10 text-center text-gray-500">
            Loading food items...
          </div>

        ) : foods.length === 0 ? (

          <div className="p-10 text-center">

            <div className="text-5xl mb-3">
              🍽️
            </div>

            <h3 className="font-bold text-gray-800">
              No Food Items
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Add your first food item.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-gray-100">

            {foods.map((food) => (

              <div
                key={food.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition"
              >

                {/* FOOD INFO */}
                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-3xl">
                    {food.emoji || "🍴"}
                  </div>

                  <div>

                    <h3 className="font-bold text-gray-900">
                      {food.name}
                    </h3>

                    <div className="flex flex-wrap gap-2 mt-1">

                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                        {food.category}
                      </span>

                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                        ⏱️ {food.preparationTime}
                      </span>

                    </div>

                  </div>

                </div>

                {/* PRICE */}
                <div className="text-left md:text-right">

                  <p className="text-xl font-bold text-green-700">
                    ₹{food.price}
                  </p>

                  <span
                    className={`text-xs font-semibold ${
                      food.available
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {food.available
                      ? "● Available"
                      : "● Unavailable"}
                  </span>

                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-2">

                  <button
                    onClick={() =>
                      toggleAvailability(food)
                    }
                    className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                      food.available
                        ? "bg-orange-50 text-orange-600"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {food.available
                      ? "Disable"
                      : "Enable"}
                  </button>

                  <button
                    onClick={() => handleEdit(food)}
                    className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(food.id)}
                    className="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold"
                  >
                    Delete

                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
}
