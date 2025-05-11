const nodemailer = require('nodemailer');

// Configure Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER, // Your Gmail
    pass: process.env.SMTP_PASS,    // Use an App Password (see below)
  },
});


module.exports = transporter;