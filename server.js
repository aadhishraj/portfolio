const nodemailer = require("nodemailer");
require('dotenv').config();  // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const Contact = require('./models/contact'); // Correct path

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve all static files like HTML/CSS/JS

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Create transporter for Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Use email from .env
    pass: process.env.EMAIL_PASS   // Use app password from .env
  }
});

// API Route to handle contact form submission
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Save to MongoDB
  try {
    const contact = new Contact({ name, email, phone, message });
    await contact.save();

    // Send email notification
    const mailOptions = {
      from: email,  // The email from the form
      to: process.env.EMAIL_USER,  // Send to yourself
      subject: "New Contact Form Message!",
      text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
      `
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("❌ Email send failed:", err);
        return res.status(500).json({ error: "Failed to send email" });
      } else {
        console.log("📨 Email sent:", info.response);
        return res.status(201).json({ message: 'Form submitted and email sent!' });
      }
    });
  } catch (err) {
    console.error('❌ Error saving contact:', err);
    return res.status(400).json({ error: err.message });
  }
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
