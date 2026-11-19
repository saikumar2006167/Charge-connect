const nodemailer = require("nodemailer");

// Gmail - Booking confirmation emails
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
        <h2 style="color:#16a34a">Booking Confirmed ✅</h2>
        <p>Hello <b>${details.name}</b>,</p>
        <p>Your charging slot has been booked successfully.</p>
        <hr>
        <h3>Booking Details</h3>
        <p><b>Station:</b> ${details.station}</p>
        <p><b>Vehicle:</b> ${details.vehicle}</p>
        <p><b>Date:</b> ${details.date}</p>
        <p><b>Time:</b> ${details.time}</p>
        <p><b>Amount:</b> ₹${details.amount}</p>
        <p><b>Payment:</b> ${details.status}</p>
        <br>
        <p>Thank you for choosing <b>ChargeConnect ⚡</b></p>
      `,
    });

    console.log("Booking Email Sent");
  } catch (err) {
    console.log("Booking Email Error:", err);
  }
}

// EmailJS - Registration OTP
async function sendOTPEmail(email, otp) {
  try {
    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_PUBLIC_KEY,
          accessToken: process.env.EMAILJS_PRIVATE_KEY,
          template_params: {
            email: email,
            passcode: otp,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    console.log("OTP Email Sent Successfully");
    return true;

  } catch (err) {
    console.error("OTP Email Error:", err.message);
    throw err;
  }
}

module.exports = {
  sendBookingEmail,
  sendOTPEmail,
};