const admin = require("firebase-admin");

const serviceAccount = require("./book-store-2d290-firebase-adminsdk.json"); // Replace with your file path

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://book-store-2d290.firebaseio.com", // Replace with your Firebase database URL
});

// Export Auth
const auth = admin.auth();
module.exports = { auth };
