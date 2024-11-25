const jwt = require("jsonwebtoken");
const User = require("../users/user.model");
const admin = require("firebase-admin");

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = async (req, res, next) => {
  let token;

  // Extract token from Authorization header or cookies
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1]; // Bearer <token>
  } else if (req.cookies["Authorization"]) {
    token = req.cookies["Authorization"];
  }

  if (!token) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  try {
    // Verify the token using Firebase Admin SDK
    const decoded = await admin.auth().verifyIdToken(token);

    // Fetch the user from the database using firebaseUid
    const user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Attach user information to the request object for downstream use
    req.user = user;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};




module.exports = { authenticateToken };
