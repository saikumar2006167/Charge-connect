import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export async function downloadReceipt(payment) {
  const doc = new jsPDF();

  // QR Code
  const qr = await QRCode.toDataURL(
    `Payment ID: ${payment.paymentId || "N/A"}`
  );

  // Header
  doc.setFillColor(22, 163, 74);
  doc.rect(0, 0, 210, 28, "F");

  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text("ChargeConnect", 15, 18);

  doc.setFontSize(11);
  doc.text("EV Charging Receipt", 145, 18);

  // Title
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("PAYMENT RECEIPT", 60, 40);

  // Receipt Number
  const receiptNo =
    "CC-" + new Date().getTime();

  doc.setFontSize(12);

  doc.text(`Receipt No : ${receiptNo}`, 15, 55);

  doc.text(
    `Date : ${new Date().toLocaleDateString()}`,
    130,
    55
  );

  // Customer Details
  doc.setFillColor(240, 240, 240);
  doc.rect(12, 62, 186, 45, "F");

  doc.text(
    `Customer : ${payment.userName || "-"}`,
    18,
    75
  );

  doc.text(
    `Email : ${payment.userEmail || "-"}`,
    18,
    85
  );

  doc.text(
    `Mobile : ${payment.mobile || "-"}`,
    18,
    95
  );

  // Booking Details
  doc.setFontSize(13);

  doc.text("Booking Details", 15, 120);

  doc.setFontSize(11);

  doc.text(
    `Station : ${payment.stationName}`,
    18,
    132
  );

  doc.text(
    `Vehicle : ${payment.vehicleNumber}`,
    18,
    142
  );

  doc.text(
    `Connector : ${payment.connector}`,
    18,
    152
  );

  doc.text(
    `Date : ${payment.bookingDate}`,
    18,
    162
  );

  doc.text(
    `Time : ${payment.bookingSlot}`,
    18,
    172
  );

  doc.text(
    `Duration : ${payment.duration} mins`,
    18,
    182
  );

  // Payment
  doc.setFontSize(13);

  doc.text("Payment", 125, 120);

  doc.setFontSize(11);

  doc.text(
    `Amount : ₹${payment.estimatedPrice}`,
    125,
    132
  );

  doc.text(
    `Method : ${payment.paymentMethod}`,
    125,
    142
  );

  doc.text(
    `Status : ${payment.paymentStatus}`,
    125,
    152
  );

  doc.text(
    `Payment ID`,
    125,
    162
  );

  doc.text(
    payment.paymentId || "-",
    125,
    170
  );

  // QR
  doc.addImage(qr, "PNG", 145, 176, 45, 45);

  // Footer
  doc.setFillColor(22, 163, 74);

  doc.rect(0, 282, 210, 15, "F");

  doc.setTextColor(255, 255, 255);

  doc.setFontSize(10);

  doc.text(
    "Thank you for using ChargeConnect • Safe Journey ⚡",
    28,
    291
  );

  doc.save(
    `ChargeConnect_Receipt_${receiptNo}.pdf`
  );
}