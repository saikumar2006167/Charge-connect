import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function RateApp() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const submitRating = async () => {
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    try {
      await addDoc(collection(db, "appRatings"), {
        rating,
        feedback,
        createdAt: serverTimestamp(),
      });

      alert("Thank you for your feedback ❤️");

      setRating(0);
      setFeedback("");
    } catch (err) {
      console.log(err);
      alert("Submission Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-green-600 mb-8">
          Rate ChargeConnect
        </h1>

        <div className="flex justify-center gap-3 mb-8">
          {[1,2,3,4,5].map((star) => (
            <FaStar
              key={star}
              size={40}
              onClick={() => setRating(star)}
              className={`cursor-pointer ${
                star <= rating
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <textarea
          rows="5"
          placeholder="Write your feedback..."
          className="w-full border rounded-xl p-3 mb-6"
          value={feedback}
          onChange={(e)=>setFeedback(e.target.value)}
        />

        <button
          onClick={submitRating}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
        >
          Submit Rating
        </button>

      </div>

    </div>
  );
}