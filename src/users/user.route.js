const express = require("express");
const { registerUser, loginUser, verifyUser } = require("./user.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// verify user
router.get("/verify", authenticateToken, verifyUser);

module.exports = router;
