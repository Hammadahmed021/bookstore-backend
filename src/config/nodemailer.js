// config/nodemailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,  // Email user
    pass: process.env.EMAIL_PASS,  // Email password
  },
});

module.exports = transporter;
