import { useEffect, useState } from "react";

const API = "https://charge-connect.https://charge-connect.onrender.com/entertainment";

export default function EntertainmentManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Entertainment",
    duration: "30 min",
    emoji: "🎮",
    available: true,
  });

  const [editingId, setEditingId] = useState(null);

  // ============================
  // LOAD ENTERTAINMENT
  // ============================
  const loadItems = async () => {
    try {
      setLoading(true);

      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Failed to load entertainment");
      }

      const data = await response.json();

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Failed to load entertainment items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
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
  // SAVE
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter service name");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      alert("Please enter a valid price");
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

      if (!response.ok) {
        throw new Error("Failed to save item");
      }

      alert(
        editingId
          ? "✅ Entertainment updated"
          : "✅ Entertainment added"
      );

      resetForm();
      loadItems();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to save entertainment");
    }
  };

  // ============================
  // EDIT
  // ============================
  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      name: item.name || "",
      price: item.price || "",
      category:
        item.category || "Entertainment",
      duration:
        item.duration || "30 min",
      emoji: item.emoji || "🎮",
      available:
        item.available !== false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================
  // DELETE
  // ============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      alert("🗑️ Entertainment deleted");

      loadItems();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete item");
    }
  };

  // ============================
  // RESET
  // ============================
  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      price: "",
      category: "Entertainment",
      duration: "30 min",
      emoji: "🎮",
      available: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🎮 Entertainment Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage PlayStation, Kids Play Area,
            Games and other waiting-time services.
          </p>
        </div>

        {/* ============================
            ADD / EDIT FORM
        ============================ */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

          <h2 className="text-xl font-bold mb-5">
            {editingId
              ? "✏️ Edit Entertainment"
              : "➕ Add Entertainment"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            {/* NAME */}
            <div>
              <label className="block font-semibold mb-2">
                Service Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="PlayStation"
                className="w-full border rounded-xl p-3"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="block font-semibold mb-2">
                Price (₹)
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="100"
                min="1"
                className="w-full border rounded-xl p-3"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block font-semibold mb-2">
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                <option value="Entertainment">
                  Entertainment
                </option>

                <option value="Kids">
                  Kids
                </option>

                <option value="Gaming">
                  Gaming
                </option>

                <option value="Lounge">
                  Lounge
                </option>

                <option value="Games">
                  Games
                </option>
              </select>
            </div>

            {/* DURATION */}
            <div>
              <label className="block font-semibold mb-2">
                Duration
              </label>

              <select
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                <option value="15 min">
                  15 Minutes
                </option>

                <option value="30 min">
                  30 Minutes
                </option>

                <option value="45 min">
                  45 Minutes
                </option>

                <option value="60 min">
                  60 Minutes
                </option>

                <option value="Unlimited">
                  Unlimited
                </option>
              </select>
            </div>

            {/* EMOJI */}
            <div>
              <label className="block font-semibold mb-2">
                Icon / Emoji
              </label>

              <input
                type="text"
                name="emoji"
                value={form.emoji}
                onChange={handleChange}
                placeholder="🎮"
                className="w-full border rounded-xl p-3"
              />
            </div>

            {/* AVAILABLE */}
            <div className="flex items-center gap-3 mt-8">

              <input
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={handleChange}
                className="w-5 h-5"
              />

              <label className="font-semibold">
                Available for customers
              </label>

            </div>

            {/* BUTTONS */}
            <div className="md:col-span-2 flex gap-3">

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold"
              >
                {editingId
                  ? "Update Service"
                  : "Add Service"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-bold"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>
        </div>

        {/* ============================
            ITEMS
        ============================ */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-bold">
              🎮 Available Services
            </h2>

            <span className="bg-green-100 text-green-700 px-3 py-2 rounded-lg font-bold">
              {items.length} Services
            </span>

          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading entertainment...
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-10">

              <div className="text-5xl mb-3">
                🎮
              </div>

              <p className="font-semibold text-gray-700">
                No entertainment services yet
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Add PlayStation, Kids Play Area
                or other services above.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              {items.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-2xl p-5 hover:shadow-md transition"
                >

                  <div className="flex items-start justify-between">

                    <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-3xl">
                      {item.emoji || "🎮"}
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        item.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.available
                        ? "Available"
                        : "Unavailable"}
                    </span>

                  </div>

                  <h3 className="text-lg font-bold mt-4">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.category}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    ⏱️ {item.duration}
                  </p>

                  <p className="text-xl font-bold text-green-600 mt-3">
                    ₹{item.price}
                  </p>

                  <div className="flex gap-2 mt-5">

                    <button
                      onClick={() =>
                        handleEdit(item)
                      }
                      className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-lg font-semibold"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item.id)
                      }
                      className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg font-semibold"
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}