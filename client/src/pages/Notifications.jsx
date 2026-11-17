import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBell,
  FaTrash,
} from "react-icons/fa";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";

export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setNotifications([]);
        return;
      }

      const q = query(
        collection(db, "notifications"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotifications(data);
      });

      return unsubscribeSnapshot;
    });

    return () => unsubscribeAuth();
  }, []);

  async function clearNotifications() {
    try {
      for (const item of notifications) {
        await deleteDoc(doc(db, "notifications", item.id));
      }

      setNotifications([]);
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteNotification(id) {
    try {
      await deleteDoc(doc(db, "notifications", id));

      setNotifications((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate(-1)}
              className="bg-white p-3 rounded-xl shadow hover:bg-gray-100"
            >
              <FaArrowLeft />
            </button>

            <h1 className="text-4xl font-bold text-green-600">
              Notifications
            </h1>

          </div>

          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl flex items-center gap-2"
            >
              <FaTrash />
              Clear All
            </button>
          )}

        </div>

        {notifications.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">

            <FaBell className="mx-auto text-gray-400 text-6xl" />

            <h2 className="text-2xl font-bold mt-5">
              No Notifications
            </h2>

            <p className="text-gray-500 mt-2">
              You're all caught up!
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {notifications.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-start hover:shadow-xl transition"
              >

                <div className="flex gap-4">

                  <FaBell className="text-green-600 text-2xl mt-1" />

                  <div>

                    <h2 className="text-xl font-bold">
                      {item.title}
                    </h2>

                    <p className="text-gray-600 mt-2">
                      {item.message}
                    </p>

                    <p className="text-sm text-gray-400 mt-3">
                      {item.createdAt?.toDate
                        ? item.createdAt
                            .toDate()
                            .toLocaleString()
                        : ""}
                    </p>

                  </div>

                </div>

                <button
                  onClick={() =>
                    deleteNotification(item.id)
                  }
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
  );
}