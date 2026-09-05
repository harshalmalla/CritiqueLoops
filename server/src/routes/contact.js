const express = require("express")
const ContactMessage = require("../models/ContactMessage")

const router = express.Router()

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

// POST /api/contact
router.post("/", async (req, res, next) => {
  try {
    const { email, message } = req.body || {}

    if (typeof email !== "string" || !isValidEmail(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" })
    }
    if (typeof message !== "string" || message.trim().length < 10) {
      return res.status(400).json({ error: "Message must be at least 10 characters" })
    }

    await ContactMessage.create({ email: email.trim(), message: message.trim() })
    res.status(201).json({ ok: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
