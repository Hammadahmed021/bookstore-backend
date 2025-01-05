const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    token: { type: String, default: null },
    firebaseUid: { type: String, unique: true, required: true }, // Firebase UID
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
