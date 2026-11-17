import { useState } from "react";
import { FaLanguage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Language() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const navigate = useNavigate();

  const languages = [
    "English",
    "తెలుగు (Telugu)",
    "हिन्दी (Hindi)",
    "தமிழ் (Tamil)",
    "ಕನ್ನಡ (Kannada)"
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <div className="flex items-center gap-3 mb-8">
          <FaLanguage className="text-green-600 text-4xl" />
          <h1 className="text-4xl font-bold text-green-600">
            Language
          </h1>
        </div>

        <p className="text-gray-600 mb-6">
          Select your preferred application language.
        </p>

        {languages.map((lang) => (

          <label
            key={lang}
            className="flex items-center justify-between border rounded-2xl p-5 mb-4 cursor-pointer hover:bg-green-50"
          >

            <span className="font-medium text-lg">
              {lang}
            </span>

            <input
              type="radio"
              name="language"
              checked={selectedLanguage === lang}
              onChange={() => setSelectedLanguage(lang)}
            />

          </label>

        ))}

        <button
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-lg font-semibold"
          onClick={() =>
            alert(`Language changed to ${selectedLanguage}`)
          }
        >
          Save Language
        </button>

      </div>

    </div>
  );
}