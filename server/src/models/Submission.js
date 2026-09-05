const mongoose = require("mongoose")

const submissionSchema = new mongoose.Schema(
  {
    portfolioUrl: { type: String, required: true },
    // Opaque secret handed back to the submitter and required on every
    // follow-up request. There is no login, so this token IS the identity.
    token: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ["waiting", "matched"], default: "waiting" },
    matchedWith: { type: mongoose.Schema.Types.ObjectId, ref: "Submission", default: null },
    hasSubmittedReview: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Submission", submissionSchema)
