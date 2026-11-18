import { BrowserRouter, Routes, Route } from "react-router-dom";
import EntertainmentManagement from "./pages/EntertainmentManagement";
import Food from "./pages/Food";
import Stations from "./pages/stations";
import Booking from "./pages/booking";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Profile from "./pages/profile";
import MyBookings from "./pages/mybookings";
import History from "./pages/history";
import Footer from "./components/footer";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import Contact from "./pages/contact";
import ScrollToTop from "./components/scrolltotop";
import FavouriteStations from "./pages/favouritestations";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import MyVehicles from "./pages/MyVehicles";
import RoutePlanner from "./pages/RoutePlanner";
import Emergency from "./pages/Emergency";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Language from "./pages/Language";
import ReportBug from "./pages/ReportBug";
import RateApp from "./pages/RateApp";
import PaymentHistory from "./pages/paymentHistory";
import EditProfile from "./pages/EditProfile";
import EVMechanics from "./pages/EVMechanics";
import OwnerLogin from "./pages/OwnerLogin";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerRegister from "./pages/OwnerRegister";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
  path="/admin/entertainment"
  element={<EntertainmentManagement />}
/>
        <Route path="/food" element={<Food />} />
        <Route path="/" element={<Home />} />
        <Route path="/stations" element={<Stations />} />
        <Route path="/route-planner" element={<RoutePlanner />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/history"element={<History />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/favourites" element={<FavouriteStations />} />
        <Route path="/Settings" element={<Settings />} />
        <Route
  path="/notifications"
  element={<Notifications />}
/>
<Route path="/contact" element={<Contact />} />
<Route path="/my-vehicles" element={<MyVehicles />} />
<Route path="/emergency" element={<Emergency />} />
<Route path="/about" element={<About />} />
<Route path="/faq" element={<FAQ />} />
<Route path="/language" element={<Language />} />
<Route path="/report-bug" element={<ReportBug />} />
<Route path="/rate-app" element={<RateApp />} />
<Route
  path="/payment-history"
  element={<PaymentHistory />}
/>
<Route
  path="/edit-profile"
  element={<EditProfile />}
/>
<Route path="/mechanics" element={<EVMechanics />} />
<Route
  path="/owner-login"
  element={<OwnerLogin />}
/>
<Route
  path="/owner-register"
  element={<OwnerRegister />}
/>
<Route
  path="/owner-dashboard"
  element={<OwnerDashboard />}
/>
<Route
  path="/admin-login"
  element={<AdminLogin />}
/>
<Route
  path="/admin-dashboard"
  element={<AdminDashboard />}
/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;