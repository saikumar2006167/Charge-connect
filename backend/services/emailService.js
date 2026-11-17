const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendBookingEmail(details) {
  try {
    await transporter.sendMail({
      from: `"ChargeConnect" <${process.env.EMAIL_USER}>`,
      to: details.email,
      subject: "⚡ Booking Confirmed - ChargeConnect",

      html: `
        <h2 style="color:#16a34a">
          Booking Confirmed ✅
        </h2>

        <p>Hello <b>${details.name}</b>,</p>

        <p>Your charging slot has been booked successfully.</p>

        <hr>

        <h3>Booking Details</h3>

        <p><b>Station :</b> ${details.station}</p>

        <p><b>Vehicle :</b> ${details.vehicle}</p>

        <p><b>Date :</b> ${details.date}</p>

        <p><b>Time :</b> ${details.time}</p>

        <p><b>Amount :</b> ₹${details.amount}</p>

        <p><b>Payment :</b> ${details.status}</p>

        <br>

        <p>
          Thank you for choosing
          <b>ChargeConnect ⚡</b>
        </p>
      `,
    });

    console.log("Booking Email Sent");
  } catch (err) {
    console.log(err);
  }
}

async function sendOTPEmail(email, otp) {
  try {
    await transporter.sendMail({
      from: `"ChargeConnect" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 ChargeConnect Email Verification OTP",

      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2 style="color:#16a34a">
            Verify Your Email
          </h2>

          <p>Your One-Time Password (OTP) is:</p>

          <h1 style="letter-spacing:8px;color:#16a34a;">
            ${otp}
          </h1>

          <p>This OTP is valid for <b>5 minutes</b>.</p>

          <p>Do not share this OTP with anyone.</p>

          <hr>

          <p>Team <b>ChargeConnect ⚡</b></p>
        </div>
      `,
    });

    console.log("OTP Email Sent");
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  sendBookingEmail,
  sendOTPEmail,
};