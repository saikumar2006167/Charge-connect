import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const ADMIN_EMAIL = "chargeconnectsupport@gmail.com";
  const ADMIN_PASSWORD = "saikumar";

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert("Please enter email and password.");
      return;
    }

    setLoading(true);

    const enteredEmail = email.trim().toLowerCase();

    // Check Admin Email
    if (enteredEmail !== ADMIN_EMAIL) {
      alert("Access Denied! Only Admin can login.");
      setLoading(false);
      return;
    }

    // Check Admin Password
    if (password !== ADMIN_PASSWORD) {
      alert("Invalid Admin Password.");
      setLoading(false);
      return;
    }

    // Admin Login Successful
    localStorage.setItem("adminLoggedIn", "true");
    localStorage.setItem("adminEmail", ADMIN_EMAIL);

    setLoading(false);

    navigate("/admin-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden md:flex bg-green-700 text-white p-10 flex-col justify-between">

          <div>
            {/* LOGO */}
            <div className="flex items-center gap-3 mb-10">

              <div className="w-12 h-12 bg-white text-green-700 rounded-2xl flex items-center justify-center text-2xl font-bold">
                ⚡
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  ChargeConnect
                </h1>

                <p className="text-green-100 text-sm">
                  EV Charging Platform
                </p>
              </div>

            </div>

            {/* TITLE */}
            <h2 className="text-4xl font-bold leading-tight mb-5">
              Admin
              <br />
              Control Panel
            </h2>

            <p className="text-green-100 leading-7">
              Manage charging stations, station owners,
              users, bookings, payments and platform
              activities from one centralized dashboard.
            </p>
          </div>

          {/* FEATURES */}
          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
                ✓
              </div>

              <span>
                Station Owner Management
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
                ✓
              </div>

              <span>
                Charging Station Management
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
                ✓
              </div>

              <span>
                Users & Bookings Management
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
                ✓
              </div>

              <span>
                Reports & Analytics
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 md:p-12">

          <div className="max-w-md mx-auto">

            {/* MOBILE LOGO */}
            <div className="md:hidden flex items-center justify-center gap-3 mb-8">

              <div className="w-12 h-12 bg-green-700 text-white rounded-2xl flex items-center justify-center text-2xl">
                ⚡
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  ChargeConnect
                </h1>

                <p className="text-sm text-gray-500">
                  Admin Portal
                </p>
              </div>

            </div>

            {/* LOGIN HEADER */}
            <div className="text-center mb-8">

              <div className="w-16 h-16 mx-auto bg-green-100 text-green-700 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🔐
              </div>

              <h2 className="text-3xl font-bold text-gray-900">
                Admin Login
              </h2>

              <p className="text-gray-500 mt-2">
                Sign in to manage ChargeConnect
              </p>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* EMAIL */}
              <div>

                <label
                  htmlFor="admin-email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Admin Email
                </label>

                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter admin email"
                  autoComplete="email"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />

              </div>

              {/* PASSWORD */}
              <div>

                <label
                  htmlFor="admin-password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>

                <div className="relative">

                  <input
                    id="admin-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    className="w-full px-4 py-3.5 pr-12 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "◉" : "○"}
                  </button>

                </div>

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-green-200"
              >
                {loading
                  ? "Signing In..."
                  : "Sign In as Admin"}
              </button>

            </form>

            {/* DEMO CREDENTIALS */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">

              <p className="text-xs text-green-800 font-semibold mb-2">
                Admin Login
              </p>

              <p className="text-xs text-gray-600">
                Email: {ADMIN_EMAIL}
              </p>

              <p className="text-xs text-gray-600">
                Password: {ADMIN_PASSWORD}
              </p>

            </div>

            {/* BACK TO WEBSITE */}
            <div className="text-center mt-8">

              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-green-700 transition"
              >
                ← Back to ChargeConnect
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}