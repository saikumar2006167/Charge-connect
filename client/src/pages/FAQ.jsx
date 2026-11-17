import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function FAQ() {
  const faqs = [
    {
      question: "How do I book a charging slot?",
      answer:
        "Go to Stations, choose your preferred charging station and click Book Now to reserve a slot.",
    },
    {
      question: "How can I cancel my booking?",
      answer:
        "Open My Bookings, select your booking and click Cancel Booking.",
    },
    {
      question: "How do I add my vehicle?",
      answer:
        "Open Profile → My Vehicles → Add Vehicle and fill in your EV details.",
    },
    {
      question: "How does Route Planner work?",
      answer:
        "Enter your starting location and destination. ChargeConnect finds the best route and nearby charging stations.",
    },
    {
      question: "What should I do during an EV emergency?",
      answer:
        "Open the Emergency page to quickly call Fire Department, Ambulance or share your live location.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-green-600 mb-8">
          Frequently Asked Questions
        </h1>

        {faqs.map((faq, index) => (

          <div
            key={index}
            className="border rounded-2xl mb-4 overflow-hidden"
          >

            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="w-full flex justify-between items-center p-5 text-left font-semibold hover:bg-gray-50"
            >
              {faq.question}

              {openIndex === index ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </button>

            {openIndex === index && (

              <div className="px-5 pb-5 text-gray-600">
                {faq.answer}
              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}