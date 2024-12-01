const express = require("express");
const { registerUser, loginUser, verifyUser, logoutUser, adminLogin, GetAllUsers } = require("./user.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// verify user
router.get("/verify", authenticateToken, verifyUser);

//logout user
router.post("/logout", authenticateToken, logoutUser);

// admin login 
router.post("/admin-login", adminLogin);

// get all users for admin 
router.get("/all", authenticateToken, GetAllUsers);




module.exports = router;
