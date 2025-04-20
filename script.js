document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

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

  portfolioForm.addEventListener("submit", (e) => {
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

    // Simulate form submission
    const submitBtn = portfolioForm.querySelector(".btn-submit")
    submitBtn.textContent = "Submitting..."
    submitBtn.disabled = true

    setTimeout(() => {
      // Show success message
      portfolioSuccess.style.display = "block"
      submitBtn.textContent = "Submit for Review"
      submitBtn.disabled = false

      // Reset form after 3 seconds
      setTimeout(() => {
        portfolioForm.reset()
        portfolioSuccess.style.display = "none"
      }, 3000)

      // Simulate getting a random portfolio to review
      simulateReviewAssignment()
    }, 1500)
  })

  // Contact form submission
  const contactForm = document.getElementById("contact-form")
  const emailInput = document.getElementById("email")
  const messageInput = document.getElementById("message")
  const emailError = document.getElementById("email-error")
  const messageError = document.getElementById("message-error")
  const contactSuccess = document.getElementById("contact-success")

  contactForm.addEventListener("submit", (e) => {
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

    // Simulate form submission
    const submitBtn = contactForm.querySelector(".btn-submit")
    submitBtn.textContent = "Sending..."
    submitBtn.disabled = true

    setTimeout(() => {
      // Show success message
      contactSuccess.style.display = "block"
      submitBtn.textContent = "Send Message"
      submitBtn.disabled = false

      // Reset form after 3 seconds
      setTimeout(() => {
        contactForm.reset()
        contactSuccess.style.display = "none"
      }, 3000)
    }, 1500)
  })

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

  // Helper functions
  function isValidUrl(url) {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Simulate review assignment (for future implementation)
  function simulateReviewAssignment() {
    // This function would be expanded in the future to handle the actual review matching
    console.log("Portfolio submitted. Review assignment would happen here in the future implementation.")

    // Example of what might happen in the future:
    // 1. Send portfolio to backend
    // 2. Get a random portfolio to review
    // 3. Show the user the portfolio they need to review
    // 4. Collect their feedback
  }
})
