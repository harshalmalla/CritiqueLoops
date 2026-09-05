const express = require("express")
const crypto = require("crypto")
const Submission = require("../models/Submission")
const Review = require("../models/Review")
const { loadSubmission } = require("../middleware/auth")

const router = express.Router()

function isValidPortfolioUrl(value) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch (e) {
    return false
  }
}

// POST /api/submissions
// Submit a portfolio and try to pair it with the next person already
// waiting. First submitter of a pair waits; second submitter completes
// the match for both sides atomically.
router.post("/", async (req, res, next) => {
  try {
    const { portfolioUrl } = req.body || {}

    if (typeof portfolioUrl !== "string" || !isValidPortfolioUrl(portfolioUrl)) {
      return res.status(400).json({ error: "Please provide a valid http(s) portfolio URL" })
    }

    const token = crypto.randomBytes(24).toString("hex")
    const submission = await Submission.create({ portfolioUrl: portfolioUrl.trim(), token })

    // Atomically claim the oldest still-waiting submission (never ourselves).
    // findOneAndUpdate is atomic at the DB level, so two submissions arriving
    // at the same time can't both claim the same partner.
    const partner = await Submission.findOneAndUpdate(
      { _id: { $ne: submission._id }, status: "waiting", matchedWith: null },
      { $set: { status: "matched", matchedWith: submission._id } },
      { sort: { createdAt: 1 } }
    )

    if (partner) {
      submission.status = "matched"
      submission.matchedWith = partner._id
      await submission.save()
    }

    res.status(201).json({
      submissionId: submission._id,
      token: submission.token,
      status: submission.status,
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/submissions/:id
// Status check for the caller's own submission (requires their token).
router.get("/:id", loadSubmission, async (req, res, next) => {
  try {
    const submission = req.submission
    let matchedPortfolioUrl = null

    if (submission.matchedWith) {
      const partner = await Submission.findById(submission.matchedWith).select("portfolioUrl")
      matchedPortfolioUrl = partner ? partner.portfolioUrl : null
    }

    const feedbackReceived = await Review.find({ toSubmission: submission._id })
      .sort({ createdAt: 1 })
      .select("feedback createdAt -_id")

    res.json({
      status: submission.status,
      matchedPortfolioUrl,
      hasSubmittedReview: submission.hasSubmittedReview,
      feedbackReceived,
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/submissions/:id/review
// Leave feedback for the portfolio this submission was matched with.
router.post("/:id/review", loadSubmission, async (req, res, next) => {
  try {
    const submission = req.submission
    const { feedback } = req.body || {}

    if (!submission.matchedWith) {
      return res.status(409).json({ error: "You have not been matched yet" })
    }
    if (submission.hasSubmittedReview) {
      return res.status(409).json({ error: "You have already submitted your review" })
    }
    if (typeof feedback !== "string" || feedback.trim().length < 20) {
      return res.status(400).json({ error: "Feedback must be at least 20 characters" })
    }

    await Review.create({
      fromSubmission: submission._id,
      toSubmission: submission.matchedWith,
      feedback: feedback.trim(),
    })

    submission.hasSubmittedReview = true
    await submission.save()

    res.status(201).json({ ok: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
