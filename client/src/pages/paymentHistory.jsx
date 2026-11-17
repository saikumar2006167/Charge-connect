import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getBookings } from "../services/bookingService";
import {

  FaMoneyBillWave,
  FaCreditCard,
  FaCalendarAlt,
} from "react-icons/fa";
import { downloadReceipt } from "../services/receiptService";

export default function PaymentHistory() {
  const auth = getAuth();

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const data = await getBookings(user.email);

      setPayments(data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-green-600 mb-8">
          💳 Payment History
        </h1>

        {payments.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <h2 className="text-2xl font-bold">
              No Payments Yet
            </h2>

            <p className="text-gray-500 mt-3">
              Your payment history will appear here.
            </p>
          </div>

        ) : (

          <div className="space-y-5">

            {payments.map((payment) => (

              <div
                key={payment.id}
                className="bg-white rounded-2xl shadow-lg p-6"
              >

                <div className="flex justify-between">

                  <div>

                    <h2 className="text-2xl font-bold text-green-700">
                      {payment.stationName}
                    </h2>

                    <p className="mt-2 flex items-center gap-2">
                      <FaCalendarAlt />
                      {payment.bookingDate}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-3xl font-bold text-green-600">
                      ₹{payment.estimatedPrice}
                    </p>

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {payment.paymentStatus || "Pending"}
                    </span>

                  </div>

                </div>

                <hr className="my-4" />

                <div className="grid md:grid-cols-2 gap-4">

                  <p className="flex items-center gap-2">
                    <FaMoneyBillWave />
                    Method :
                    {payment.paymentMethod || "Cash"}
                  </p>

                  <p className="flex items-center gap-2">
                    <FaCreditCard />
                    Payment ID :
                    {payment.paymentId || "--"}
                  </p>
                  <button
  onClick={() => downloadReceipt(payment)}
  className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
>
  📄 Download Receipt
</button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}