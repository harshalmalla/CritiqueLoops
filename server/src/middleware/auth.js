const Submission = require("../models/Submission")

// Loads the Submission for req.params.id and verifies the caller supplied
// the matching secret token. There's no login system, so this token is the
// only thing standing between "this is your submission" and anyone's.
async function loadSubmission(req, res, next) {
  try {
    const { id } = req.params
    const token = req.header("x-submission-token")

    if (!token) {
      return res.status(401).json({ error: "Missing submission token" })
    }

    const submission = await Submission.findById(id)

    if (!submission || submission.token !== token) {
      return res.status(404).json({ error: "Submission not found" })
    }

    req.submission = submission
    next()
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ error: "Submission not found" })
    }
    next(err)
  }
}

module.exports = { loadSubmission }
