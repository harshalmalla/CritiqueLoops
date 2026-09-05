const mongoose = require("mongoose")

const contactMessageSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model("ContactMessage", contactMessageSchema)
