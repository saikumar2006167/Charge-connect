import { useState } from "react";
import { Link } from "react-router-dom";
import { registerOwner } from "../services/ownerService";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaChargingStation,
  FaMapMarkerAlt,
  FaClock,
  FaFileUpload,
} from "react-icons/fa";

export default function OwnerRegister() {

  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",

    stationName: "",
    stationType: "",
    chargers: "",
    connectorType: "",
    price: "",

    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",

    openingTime: "",
    closingTime: "",

    certificate: null,

    acceptTerms: false,
  });

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {

    const {
      confirmPassword,
      certificate,
      stationImage,
      ...ownerData
    } = formData;


    const result = await registerOwner(ownerData);

    console.log("REGISTER RESPONSE:", result);


    if (result.success) {

      alert("Charging Station Registered Successfully!");

      window.location.href = "/owner-login";

    } else {

      alert(result.message || "Registration Failed");

    }


  } catch (error) {

    console.error("REGISTER ERROR:", error);

    alert("Something went wrong.");

  }
};

  return (

    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-4xl font-bold text-green-700 text-center">

          Register Your Charging Station

        </h1>

        <p className="text-center text-gray-500 mt-3">

          Become a ChargeConnect Partner and grow your EV charging business.

        </p>

        <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-10">

        {/* Owner Information */}

          <div>

            <div className="flex items-center gap-3 mb-6">

              <FaUser className="text-green-600 text-2xl" />

              <h2 className="text-2xl font-bold text-green-700">
                Owner Information
              </h2>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Owner Name */}

              <div>

                <label className="font-semibold">
                  Owner Full Name
                </label>

                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Enter Owner Name"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              {/* Email */}

              <div>

                <label className="font-semibold">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email Address"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              {/* Mobile */}

              <div>

                <label className="font-semibold">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter Mobile Number"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              {/* Password */}

              <div>

                <label className="font-semibold">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create Password"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              {/* Confirm Password */}

              <div className="md:col-span-2">

                <label className="font-semibold">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

            </div>

          </div>
          {/* Station Information */}

          <div>

            <div className="flex items-center gap-3 mb-6">

              <FaChargingStation className="text-green-600 text-2xl" />

              <h2 className="text-2xl font-bold text-green-700">
                Station Information
              </h2>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Station Name */}

              <div>

                <label className="font-semibold">
                  Charging Station Name
                </label>

                <input
                  type="text"
                  name="stationName"
                  value={formData.stationName}
                  onChange={handleChange}
                  placeholder="Enter Station Name"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              {/* Station Type */}

              <div>

                <label className="font-semibold">
                  Station Type
                </label>

                <select
                  name="stationType"
                  value={formData.stationType}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                >

                  <option value="">Select Station Type</option>

                  <option value="Public">
                    Public
                  </option>

                  <option value="Private">
                    Private
                  </option>

                  <option value="Commercial">
                    Commercial
                  </option>

                </select>

              </div>

              {/* Number of Chargers */}

              <div>

                <label className="font-semibold">
                  Number of Chargers
                </label>

                <input
                  type="number"
                  name="chargers"
                  value={formData.chargers}
                  onChange={handleChange}
                  placeholder="Example : 6"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              {/* Connector Type */}

              <div>

                <label className="font-semibold">
                  Connector Type
                </label>

                <select
                  name="connectorType"
                  value={formData.connectorType}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                >

                  <option value="">Select Connector</option>

                  <option value="CCS2">CCS2</option>

                  <option value="Type-2">Type-2</option>

                  <option value="CHAdeMO">CHAdeMO</option>

                  <option value="GB/T">GB/T</option>

                </select>

              </div>

              {/* Price */}

              <div>

                <label className="font-semibold">
                  Charging Price (₹ / kWh)
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter Charging Price"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

            </div>

          </div>
          {/* Government Certificate */}

          <div>

            <div className="flex items-center gap-3 mb-6">

              <FaFileUpload className="text-green-600 text-2xl" />

              <h2 className="text-2xl font-bold text-green-700">
                Government Approval
              </h2>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Government Certificate */}

              {/* Government Certificate */}

<div>

  <label className="font-semibold">
    Government Approved Station Certificate
  </label>

  <input
    type="file"
    name="certificate"
    accept=".pdf,.jpg,.jpeg,.png"
    className="w-full mt-2 border rounded-xl p-4 bg-white"
    onChange={(e) =>
      setFormData({
        ...formData,
        certificate: e.target.files[0],
      })
    }
  />

  <p className="text-sm text-gray-500 mt-2">
    Government approval certificate can be uploaded later from the
    Station Owner Dashboard after registration.
  </p>

  <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded-xl p-4">

    <h3 className="font-semibold text-yellow-700">
      Demo Registration
    </h3>

    <p className="text-sm text-yellow-700 mt-2">
      Certificate upload is optional for demonstration purposes.
      Your charging station will be registered with the status
      <b> "Pending Verification"</b>.
      After uploading the Government Approval Certificate, the
      ChargeConnect Admin can verify and approve your station.
    </p>

  </div>

</div>
          </div>

              {/* Station Image */}

<div>

  <label className="font-semibold">
    Charging Station Image
  </label>

  <input
    type="file"
    name="stationImage"
    accept="image/*"
    className="w-full mt-2 border rounded-xl p-4 bg-white"
    onChange={(e) =>
      setFormData({
        ...formData,
        stationImage: e.target.files[0],
      })
    }
  />

  <p className="text-sm text-gray-500 mt-2">
    Upload a clear image of your charging station.
    This step is optional during the demo.
  </p>

  <div className="mt-4 bg-blue-50 border border-blue-300 rounded-xl p-4">

    <h3 className="font-semibold text-blue-700">
      Demo Note
    </h3>

    <p className="text-sm text-blue-700 mt-2">
      You can skip uploading the station image for demonstration purposes.
      Once your station is verified, you can upload or update station images
      anytime from the Station Owner Dashboard.
    </p>

  </div>

</div>
              </div>
          
          {/* Location Details */}

          <div>

            <div className="flex items-center gap-3 mb-6">

              <FaMapMarkerAlt className="text-green-600 text-2xl" />

              <h2 className="text-2xl font-bold text-green-700">
                Location Details
              </h2>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Full Address */}

              <div className="md:col-span-2">

                <label className="font-semibold">
                  Full Address
                </label>

                <textarea
                  rows="3"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter Complete Station Address"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              {/* Landmark */}

              <div>

                <label className="font-semibold">
                  Landmark
                </label>

                <input
                  type="text"
                  name="landmark"
                  placeholder="Near Bus Stand / Mall"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>

              {/* City */}

              <div>

                <label className="font-semibold">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter City"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              {/* District */}

              <div>

                <label className="font-semibold">
                  District
                </label>

                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Enter District"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              {/* State */}

              <div>

                <label className="font-semibold">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter State"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              {/* PIN Code */}

              <div>

                <label className="font-semibold">
                  PIN Code
                </label>

                <input
                  type="number"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter PIN Code"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              {/* Latitude */}

              <div>

                <label className="font-semibold">
                  Latitude
                </label>

                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="17.3850"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>

              {/* Longitude */}

              <div>

                <label className="font-semibold">
                  Longitude
                </label>

                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="78.4867"
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>

            </div>

          </div>
          {/* Operating Timings */}

          <div>

            <div className="flex items-center gap-3 mb-6">

              <FaClock className="text-green-600 text-2xl" />

              <h2 className="text-2xl font-bold text-green-700">
                Operating Timings
              </h2>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <label className="font-semibold">
                  Opening Time
                </label>

                <input
                  type="time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              <div>

                <label className="font-semibold">
                  Closing Time
                </label>

                <input
                  type="time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

            </div>

          </div>

          {/* Terms */}

          <div className="bg-gray-50 border rounded-2xl p-6">

            <label className="flex items-start gap-3">

              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1 accent-green-600"
                required
              />

              <span className="text-gray-700 leading-7">

                I confirm that all the information provided is true and accurate.

                I certify that this charging station is legally registered and
                government approved.

                I agree to the ChargeConnect Terms & Conditions and Privacy Policy.

              </span>

            </label>

          </div>

          {/* Buttons */}

          <div className="flex gap-5">

            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-semibold transition"
            >
              Register Charging Station
            </button>

            <Link
              to="/owner-login"
              className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-4 rounded-xl text-center text-lg font-semibold transition"
            >
              Back to Login
            </Link>

          </div>

        </form>

      </div>

    </div>

  );

}