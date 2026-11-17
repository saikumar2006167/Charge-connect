const { sendOTPEmail } = require("../services/emailService");

const otpStore = {};

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Unable to send OTP",
    });
  }
};

exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];

  if (!record) {
    return res.json({
      success: false,
      message: "OTP not found",
    });
  }

  if (Date.now() > record.expires) {
    delete otpStore[email];

    return res.json({
      success: false,
      message: "OTP Expired",
    });
  }

  if (record.otp !== otp) {
    return res.json({
      success: false,
      message: "Invalid OTP",
    });
  }

  delete otpStore[email];

  res.json({
    success: true,
    message: "OTP Verified",
  });
};