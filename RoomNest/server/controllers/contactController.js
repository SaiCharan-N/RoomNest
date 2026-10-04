const ContactMessage = require('../models/ContactMessage');

async function submitContact(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }
    await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ message: "Thanks for reaching out! We'll get back to you soon." });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitContact };
