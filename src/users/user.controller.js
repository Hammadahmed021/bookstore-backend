const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./user.model");
const admin = require("firebase-admin");
const { auth } = require("../../firebaseConfig");
const { sendRegistrationNotification, sendPasswordResetEmail } = require("../service/sendEmail");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

// Register User API
const registerUser = async (req, res) => {
  const { email, password, name, idToken, role } = req.body;

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

    sendRegistrationNotification({
      name: newUser.name,
      email: newUser.email,
    });

    res
      .status(201)
      .json({
        message: "User registered successfully", userId: uid, email: newUser.email,
        name: newUser.name,
        role: newUser.role
      });

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

// get link to reset password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  const actionCodeSettings = {
    url: 'http://localhost:5173/forgot-password', // Adjust the port as per your local setup
    handleCodeInApp: true,
  };
  
  try {
    // Generate the password reset link from Firebase
    const resetLink = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);
    console.log(resetLink, 'Generated reset link');

    // Send the password reset email to the user
    sendPasswordResetEmail(email, resetLink);

    return res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email.',
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send password reset link.',
      error: error.message,
    });
  }
};

// Set New Password: After user clicks reset link
const setNewPassword = async (req, res) => {
  const { idToken, newPassword } = req.body;

  if (!idToken || !newPassword) {
    return res.status(400).json({ message: "ID token and new password are required" });
  }

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    console.log("Decoded UID:", uid);

    // Find user in the database
    const user = await User.findOne({ firebaseUid: uid });
    console.log("Fetched user:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("Hashed password:", hashedPassword);

    // Update password in MongoDB
    user.password = hashedPassword;
    await user.save();
    console.log("Password updated in MongoDB.");

    // Optionally update Firebase user password
    await admin.auth().updateUser(uid, { password: newPassword });
    console.log("Firebase password updated.");

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error setting new password:", error.message);
    res.status(500).json({ message: "Failed to update password", error: error.message });
  }
};



module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  logoutUser,
  createAdmin,
  adminLogin,
  GetAllUsers,
  forgotPassword,
  setNewPassword
};
