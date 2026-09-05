require("dotenv").config()

const express = require("express")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const { connectDB } = require("./db")
const submissionsRouter = require("./routes/submissions")
const contactRouter = require("./routes/contact")

const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI
const CORS_ORIGIN = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI environment variable")
  process.exit(1)
}

const app = express()

app.use(
  cors({
    // If CORS_ORIGIN isn't set, allow any origin (handy for local dev only —
    // always set it in production).
    origin: CORS_ORIGIN.length > 0 ? CORS_ORIGIN : true,
  })
)
app.use(express.json({ limit: "10kb" }))

// Generous but real limit: this API has no login, so it's the only thing
// standing between the demo and someone scripting thousands of submissions.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use("/api", apiLimiter)

app.get("/api/health", (req, res) => res.json({ ok: true }))
app.use("/api/submissions", submissionsRouter)
app.use("/api/contact", contactRouter)

app.use((req, res) => res.status(404).json({ error: "Not found" }))

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: "Internal server error" })
})

connectDB(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err)
    process.exit(1)
  })
