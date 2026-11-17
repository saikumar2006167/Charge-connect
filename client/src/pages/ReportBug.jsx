import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function ReportBug() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submitBug = async () => {
    if (!title || !description) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "bugReports"), {
        title,
        description,
        createdAt: serverTimestamp(),
        status: "Pending",
      });

      alert("Bug Report Submitted Successfully ✅");

      setTitle("");
      setDescription("");
    } catch (err) {
      console.log(err);
      alert("Submission Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-red-600 mb-8">
          Report a Bug
        </h1>

        <input
          type="text"
          placeholder="Bug Title"
          className="w-full border rounded-xl p-3 mb-5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          rows="6"
          placeholder="Describe the issue..."
          className="w-full border rounded-xl p-3 mb-5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={submitBug}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
        >
          Submit Report
        </button>

      </div>

    </div>
  );
}