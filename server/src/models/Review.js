const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
  {
    fromSubmission: { type: mongoose.Schema.Types.ObjectId, ref: "Submission", required: true },
    toSubmission: { type: mongoose.Schema.Types.ObjectId, ref: "Submission", required: true },
    feedback: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Review", reviewSchema)
