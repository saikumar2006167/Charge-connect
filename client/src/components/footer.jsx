import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-8 py-10 grid md:grid-cols-3 gap-8">

        {/* Logo */}
        <div>
          <h2 className="text-2xl font-bold text-green-400">
            ChargeConnect
          </h2>
          <p className="text-gray-400 mt-3">
            Find nearby EV charging stations and
            book charging slots quickly and securely.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Quick Links
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/stations">Stations</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/my-bookings">My Bookings</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Legal
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>
  <Link to="/privacy" className="hover:text-green-400">
    Privacy Policy
  </Link>
</li>

<li>
  <Link to="/terms" className="hover:text-green-400">
    Terms & Conditions
  </Link>
</li>

<li>
  <Link to="/contact" className="hover:text-green-400">
    Contact Us
  </Link>
</li>
            <li>Email: chargeconnectsupport@gmail.com</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 py-4 text-center text-gray-500">
        © 2026 ChargeConnect. All Rights Reserved.
      </div>
    </footer>
  );
}