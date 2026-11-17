const db = require("../firebaseAdmin");

async function createNotification(data) {
  await db.collection("notifications").add({
    uid: data.uid,
    title: data.title,
    message: data.message,
    type: data.type,
    isRead: false,
    createdAt: new Date(),
  });

  console.log("Notification Created");
}

module.exports = {
  createNotification,
};