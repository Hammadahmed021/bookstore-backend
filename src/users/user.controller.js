const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./user.model");
const { auth } = require("../../firebaseConfig");
const admin = require("firebase-admin");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

// Register User API
const registerUser = async (req, res) => {
  const { email, password, name, idToken } = req.body;

  if (!email || !password || !name || !idToken) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      role,
      password: hashedPassword,
      firebaseUid: uid,
      token: idToken,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", userId: uid });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res
      .status(500)
      .json({ message: "Failed to register user", error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, idToken } = req.body;

  if (!email || !idToken) {
    return res.status(400).json({ message: "Email and ID token are required" });
  }

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Check if the user exists in the database
    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // If the user doesn't exist, create a new user entry
      const newUser = new User({
        name: decodedToken.name || "Unknown", // Use name from Firebase if available
        email: decodedToken.email,
        firebaseUid: uid,
        role: "user", // Default role
      });

      await newUser.save();

      return res.status(201).json({
        message: "User registered and logged in successfully",
        userId: uid,
        email: decodedToken.email,
        name: decodedToken.name || "Unknown",
        role
      });
    }

    // If the user exists, update their token (optional)
    user.token = idToken;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      userId: uid,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res
      .status(500)
      .json({ message: "Failed to log in user", error: error.message });
  }
};

// Verify User API
const verifyUser = async (req, res) => {
  try {
    // User is already attached to the request by the middleware
    const { user } = req;

    res.status(200).json({
      success: true,
      message: "User verified successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error verifying user:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("Authorization"); // Clear the token cookie
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// admin login
const adminLogin = async (req, res) => {
  const { email, idToken } = req.body;

  if (!email || !idToken) {
    return res.status(400).json({ message: "Email and ID token are required" });
  }

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Check if the user exists in the database
    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // If the user doesn't exist, create a new user entry
      const newUser = new User({
        name: decodedToken.name || "Unknown", // Use name from Firebase if available
        email: decodedToken.email,
        firebaseUid: uid,
        role: "admin", // Default role
      });

      await newUser.save();

      return res.status(201).json({
        message: "User registered and logged in successfully",
        userId: uid,
        email: decodedToken.email,
        name: decodedToken.name || "Unknown",
      });
    }

    // If the user exists, update their token (optional)
    user.token = idToken;
    await user.save();

    res.status(200).json({
      message: "Admin login successful",
      userId: uid,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res
      .status(500)
      .json({ message: "Failed to log in user", error: error.message });
  }
};

// creating admin
const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("123456", 10); // Hash the password
    const adminUser = new User({
      name: "Admin ",
      email: "admin@yopmail.com",
      password: hashedPassword,
      role: "admin",
      firebaseUid: process.env.ADMIN_UID, // Replace with a Firebase UID
    });

    await adminUser.save();
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  }
};

const GetAllUsers = async (req, res) => {
  try {
      const getUsers = await User.find().sort({ createdAt: -1 })
      res.status(200).send(getUsers)
  } catch (error) {
      console.error("Error fetching books", error);
      res.status(500).send({ message: 'Failed to get books' })
  }
}


module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  logoutUser,
  createAdmin,
  adminLogin,
  GetAllUsers
};
