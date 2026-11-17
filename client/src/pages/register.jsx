import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { sendOTP, verifyOTP } from "../services/authService";


function Register() {
  const navigate = useNavigate();

 const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [mobile, setMobile] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [otp, setOtp] = useState("");
const [otpVerified, setOtpVerified] = useState(false);
const [sendingOTP, setSendingOTP] = useState(false);

 async function handleSendOTP() {
  if (!email) {
    alert("Enter email first");
    return;
  }

  try {
    setSendingOTP(true);

    const res = await sendOTP(email);

    alert(res.message);

  } catch (err) {
  console.log(err);
  alert("Unable to send OTP");

  } finally {
    setSendingOTP(false);
  }
}

async function handleVerifyOTP() {
  try {
    const res = await verifyOTP(email, otp);

    if (res.success) {
      setOtpVerified(true);
      alert("OTP Verified ✅");
    } else {
      alert(res.message);
    }
  } catch (err) {
    console.log(err);
    alert("Verification Failed");
  }
}

const handleRegister = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
  alert("Please verify your Email OTP first.");
  return;
}

    if (password !== confirmPassword) {
  alert("Passwords do not match");
  return;
}

if (mobile.length !== 10) {
  alert("Enter valid mobile number");
  return;
}

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
  uid: userCredential.user.uid,
  firstName,
  lastName,
  fullName: `${firstName} ${lastName}`,
  mobile,
  email,
  rewardPoints: 0,
  createdAt: new Date().toLocaleString(),
});

      alert("Registration Successful ✅");

      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        <input
type="text"
placeholder="First Name"
className="w-full border p-3 rounded mb-4"
value={firstName}
onChange={(e)=>setFirstName(e.target.value)}
required
/>

<input
type="text"
placeholder="Last Name"
className="w-full border p-3 rounded mb-4"
value={lastName}
onChange={(e)=>setLastName(e.target.value)}
required
/>
        <input
          type="tel"
          placeholder="Mobile Number"
          className="w-full border p-3 rounded mb-4"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="flex gap-2 mb-4">
  <button
    type="button"
    onClick={handleSendOTP}
    disabled={sendingOTP}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded w-full"
  >
    {sendingOTP ? "Sending OTP..." : "Send OTP"}
  </button>
</div>

<input
  type="text"
  placeholder="Enter Email OTP"
  className="w-full border p-3 rounded mb-4"
  value={otp}
  onChange={(e) => setOtp(e.target.value)}
/>

<button
  type="button"
  onClick={handleVerifyOTP}
  className={`w-full p-3 rounded mb-4 text-white ${
    otpVerified
      ? "bg-green-600"
      : "bg-orange-500 hover:bg-orange-600"
  }`}
>
  {otpVerified ? "OTP Verified ✅" : "Verify OTP"}
</button>

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
type="password"
placeholder="Confirm Password"
className="w-full border p-3 rounded mb-4"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
required
/>

        <button
  type="submit"
  disabled={!otpVerified}
  className={`w-full p-3 rounded text-white ${
    otpVerified
      ? "bg-green-600 hover:bg-green-700"
      : "bg-gray-400 cursor-not-allowed"
  }`}
>
  Register
</button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;