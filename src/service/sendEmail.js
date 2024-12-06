// services/emailService.js
const transporter = require("../config/nodemailer");

const sendRegistrationNotification = (user) => {
  const mailOptionsForAdmin = {
    from: process.env.EMAIL_USER, // Admin email
    to: "admin123@mailinator.com", // Admin email
    subject: "New User Registration",
    text: `A new user has registered:\n\nName: ${user.name}\nEmail: ${user.email}`,
  };

  const mailOptionsForUser = {
    from: process.env.EMAIL_USER, // Admin email
    to: user.email, // User's email
    subject: "Welcome to Our Platform!",
    text: `Dear ${user.name},\n\nThank you for registering with us!\n\nWe are excited to have you onboard.`,
  };

  // Send email to admin
  transporter.sendMail(mailOptionsForAdmin, (error, info) => {
    if (error) {
      console.error("Error sending registration email to admin:", error);
    } else {
      console.log("Registration email sent to admin:", info.response);
    }
  });

  // Send welcome email to the user
  transporter.sendMail(mailOptionsForUser, (error, info) => {
    if (error) {
      console.error("Error sending welcome email to user:", error);
    } else {
      console.log("Welcome email sent to user:", info.response);
    }
  });
};

const sendOrderNotification = (order) => {
  // Check if order.items exists and is an array
  const itemsText = Array.isArray(order.products)
    ? order.products
        .map((item) => {
          return `- ${item.title} (x${item.quantity}) - $${item.price}`;
        })
        .join("\n")
    : "No items available";  // Fallback in case order.items is not an array or is empty

  const recipientMailOptions = {
    from: process.env.EMAIL_USER, // Admin email
    to: order.email, // Customer's email
    subject: "Order Confirmation",
    text: `Thank you for your order!\n\nOrder ID: ${order.id}\nTotal: $${order.totalPrice}\nItems:\n${itemsText}`, // Plain text email
  };

  const adminMailOptions = {
    from: process.env.EMAIL_USER, // Admin email
    to: "admin123@mailinator.com", // Admin email
    subject: "New Order Received",
    text: `A new order has been placed:\n\nOrder ID: ${order.id}\nCustomer: ${order.name}\nTotal: $${order.totalPrice}\nItems:\n${itemsText}`, // Plain text email
  };

  // Send order confirmation to the recipient (customer)
  transporter.sendMail(recipientMailOptions, (error, info) => {
    if (error) {
      console.error("Error sending order email to customer:", error);
    } else {
      console.log("Order email sent to customer:", info.response);
    }
  });

  // Notify admin about the new order
  transporter.sendMail(adminMailOptions, (error, info) => {
    if (error) {
      console.error("Error sending order email to admin:", error);
    } else {
      console.log("Order email sent to admin:", info.response);
    }
  });
};

// Send the email with the reset link
const sendPasswordResetEmail = (email, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Admin email address
    to: email, // User's email
    subject: 'Password Reset Request',
    text: `We received a request to reset your password. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request a password reset, please ignore this email.`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending reset email:', error);
    } else {
      console.log('Password reset email sent:', info.response);
    }
  });
};

module.exports = {
  sendRegistrationNotification,
  sendOrderNotification,
  sendPasswordResetEmail
};
