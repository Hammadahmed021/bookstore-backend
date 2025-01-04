require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("./book-store-2d290-firebase-adminsdk-pc40o-334402baef.json"); // Replace with your file path


// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL, // Replace with your Firebase database URL
});

// Export Auth
const auth = admin.auth();
module.exports = { auth };
