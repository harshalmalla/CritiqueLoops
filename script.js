const API_BASE_URL = window.CRITIQUELOOP_API_BASE_URL || "http://localhost:4000/api"
const STORAGE_KEY = "critiqueloop_submission"

document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  const currentYearEl = document.getElementById("current-year")
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear()
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mobileMenu = document.querySelector(".mobile-menu")
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link")

  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active")
  })

  // Close mobile menu when clicking a link
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active")
    })
  })

  // Portfolio form submission
  const portfolioForm = document.getElementById("portfolio-form")
  const portfolioUrlInput = document.getElementById("portfolio-url")
  const urlError = document.getElementById("url-error")
  const portfolioSuccess = document.getElementById("portfolio-success")

  portfolioForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Reset messages
    urlError.style.display = "none"
    portfolioSuccess.style.display = "none"

    // Validate URL
    const portfolioUrl = portfolioUrlInput.value.trim()

    if (!isValidUrl(portfolioUrl)) {
      urlError.textContent = "Please enter a valid URL"
      urlError.style.display = "block"
      return
    }

    const submitBtn = portfolioForm.querySelector(".btn-submit")
    submitBtn.textContent = "Submitting..."
    submitBtn.disabled = true

    try {
      const data = await apiRequest("/submissions", {
        method: "POST",
        body: { portfolioUrl },
      })

      saveSubmission({ submissionId: data.submissionId, token: data.token })
      portfolioSuccess.style.display = "block"
      portfolioForm.reset()

      showMatchSection()
      await refreshMatchStatus()
      startPolling()
    } catch (err) {
      urlError.textContent = err.message || "Something went wrong. Please try again."
      urlError.style.display = "block"
    } finally {
      submitBtn.textContent = "Submit for Review"
      submitBtn.disabled = false
    }
  })

  // Contact form submission
  const contactForm = document.getElementById("contact-form")
  const emailInput = document.getElementById("email")
  const messageInput = document.getElementById("message")
  const emailError = document.getElementById("email-error")
  const messageError = document.getElementById("message-error")
  const contactSuccess = document.getElementById("contact-success")

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Reset messages
    emailError.style.display = "none"
    messageError.style.display = "none"
    contactSuccess.style.display = "none"

    // Validate email
    const email = emailInput.value.trim()
    if (!isValidEmail(email)) {
      emailError.textContent = "Please enter a valid email address"
      emailError.style.display = "block"
      return
    }

    // Validate message
    const message = messageInput.value.trim()
    if (message.length < 10) {
      messageError.textContent = "Message must be at least 10 characters"
      messageError.style.display = "block"
      return
    }

    const submitBtn = contactForm.querySelector(".btn-submit")
    submitBtn.textContent = "Sending..."
    submitBtn.disabled = true

    try {
      await apiRequest("/contact", { method: "POST", body: { email, message } })
      contactSuccess.style.display = "block"
      contactForm.reset()
    } catch (err) {
      messageError.textContent = err.message || "Something went wrong. Please try again."
      messageError.style.display = "block"
    } finally {
      submitBtn.textContent = "Send Message"
      submitBtn.disabled = false
    }
  })

  // Review form submission (feedback for the matched portfolio)
  const reviewForm = document.getElementById("review-form")
  const reviewFeedbackInput = document.getElementById("review-feedback")
  const reviewError = document.getElementById("review-error")
  const reviewSuccess = document.getElementById("review-success")

  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    reviewError.style.display = "none"
    reviewSuccess.style.display = "none"

    const feedback = reviewFeedbackInput.value.trim()
    if (feedback.length < 20) {
      reviewError.textContent = "Feedback must be at least 20 characters"
      reviewError.style.display = "block"
      return
    }

    const submission = getSavedSubmission()
    if (!submission) {
      reviewError.textContent = "We couldn't find your submission. Try submitting your portfolio again."
      reviewError.style.display = "block"
      return
    }

    const submitBtn = reviewForm.querySelector(".btn-submit")
    submitBtn.textContent = "Sending..."
    submitBtn.disabled = true

    try {
      await apiRequest(`/submissions/${submission.submissionId}/review`, {
        method: "POST",
        body: { feedback },
        token: submission.token,
      })
      reviewSuccess.style.display = "block"
      reviewForm.reset()
      await refreshMatchStatus()
    } catch (err) {
      reviewError.textContent = err.message || "Something went wrong. Please try again."
      reviewError.style.display = "block"
    } finally {
      submitBtn.textContent = "Send Feedback"
      submitBtn.disabled = false
    }
  })

  // Restore an in-progress submission across page reloads
  if (getSavedSubmission()) {
    showMatchSection()
    refreshMatchStatus()
    startPolling()
  }

  // Add fade-in animation to sections
  const sections = document.querySelectorAll(".section")

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  sections.forEach((section) => {
    observer.observe(section)
  })

  // ---- Helper functions ----

  function isValidUrl(url) {
    try {
      const parsed = new URL(url)
      return parsed.protocol === "http:" || parsed.protocol === "https:"
    } catch (e) {
      return false
    }
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  async function apiRequest(path, { method = "GET", body, token } = {}) {
    const headers = { "Content-Type": "application/json" }
    if (token) headers["x-submission-token"] = token

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    let data = null
    try {
      data = await response.json()
    } catch (e) {
      // No JSON body (e.g. a 204, or the server errored before responding).
    }

    if (!response.ok) {
      const error = new Error((data && data.error) || `Request failed (${response.status})`)
      error.status = response.status
      throw error
    }

    return data
  }

  function saveSubmission({ submissionId, token }) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ submissionId, token }))
  }

  function getSavedSubmission() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  }

  function clearSavedSubmission() {
    localStorage.removeItem(STORAGE_KEY)
  }

  function showMatchSection() {
    const matchSection = document.getElementById("match")
    if (matchSection) matchSection.style.display = "block"
  }

  let pollTimer = null

  function startPolling() {
    if (pollTimer) return
    pollTimer = setInterval(refreshMatchStatus, 6000)
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  async function refreshMatchStatus() {
    const submission = getSavedSubmission()
    if (!submission) return

    const waitingCard = document.getElementById("match-waiting")
    const readyCard = document.getElementById("match-ready")
    const doneCard = document.getElementById("match-done")
    const matchUrlEl = document.getElementById("match-url")
    const feedbackWrapper = document.getElementById("feedback-received-wrapper")
    const feedbackList = document.getElementById("feedback-received-list")

    try {
      const data = await apiRequest(`/submissions/${submission.submissionId}`, {
        token: submission.token,
      })

      if (data.status === "matched" && data.hasSubmittedReview) {
        waitingCard.style.display = "none"
        readyCard.style.display = "none"
        doneCard.style.display = "block"
        stopPolling()
      } else if (data.status === "matched") {
        waitingCard.style.display = "none"
        readyCard.style.display = "block"
        doneCard.style.display = "none"
        if (matchUrlEl && data.matchedPortfolioUrl) {
          matchUrlEl.href = data.matchedPortfolioUrl
          matchUrlEl.textContent = data.matchedPortfolioUrl
        }
        stopPolling()
      } else {
        waitingCard.style.display = "block"
        readyCard.style.display = "none"
        doneCard.style.display = "none"
      }

      if (feedbackWrapper && feedbackList) {
        if (data.feedbackReceived && data.feedbackReceived.length > 0) {
          feedbackWrapper.style.display = "block"
          feedbackList.innerHTML = ""
          data.feedbackReceived.forEach((review) => {
            const li = document.createElement("li")
            li.textContent = review.feedback
            feedbackList.appendChild(li)
          })
        } else {
          feedbackWrapper.style.display = "none"
        }
      }
    } catch (err) {
      if (err.status === 404) {
        // The submission no longer exists server-side (e.g. DB was reset) -
        // stop treating this browser as having an active submission.
        clearSavedSubmission()
        stopPolling()
        const matchSection = document.getElementById("match")
        if (matchSection) matchSection.style.display = "none"
      }
      console.error("Failed to refresh match status:", err.message)
    }
  }
})
