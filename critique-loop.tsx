"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Code, Eye, Lock, MessageSquare, Send, Zap } from "lucide-react"
import { z } from "zod"

// Form validation schemas
const portfolioSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
})

const contactSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

export default function CritiqueLoop() {
  // Portfolio form state
  const [portfolioUrl, setPortfolioUrl] = useState("")
  const [portfolioError, setPortfolioError] = useState("")
  const [portfolioSuccess, setPortfolioSuccess] = useState(false)

  // Contact form state
  const [contactEmail, setContactEmail] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [contactError, setContactError] = useState("")
  const [contactSuccess, setContactSuccess] = useState(false)

  // Handle portfolio submission
  const handlePortfolioSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPortfolioError("")
    setPortfolioSuccess(false)

    try {
      portfolioSchema.parse({ url: portfolioUrl })
      // Simulate successful submission
      setTimeout(() => {
        setPortfolioSuccess(true)
        // Reset form after 3 seconds
        setTimeout(() => {
          setPortfolioUrl("")
          setPortfolioSuccess(false)
        }, 3000)
      }, 1000)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPortfolioError(error.errors[0].message)
      }
    }
  }

  // Handle contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setContactError("")
    setContactSuccess(false)

    try {
      contactSchema.parse({ email: contactEmail, message: contactMessage })
      // Simulate successful submission
      setTimeout(() => {
        setContactSuccess(true)
        // Reset form after 3 seconds
        setTimeout(() => {
          setContactEmail("")
          setContactMessage("")
          setContactSuccess(false)
        }, 3000)
      }, 1000)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setContactError(error.errors[0].message)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Code className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-blue-600">CritiqueLoop</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#submit" className="text-gray-600 hover:text-blue-600 transition-colors">
              Submit
            </a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </a>
          </nav>
          <Button asChild size="sm" className="hidden md:flex">
            <a href="#submit">Submit Portfolio</a>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">CritiqueLoop</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">Anonymous Portfolio Feedback for Creators</p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <a href="#submit">Submit Your Portfolio</a>
            </Button>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">About CritiqueLoop</h2>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-gray-700 mb-6">
                CritiqueLoop helps developers and designers improve their portfolios through honest, anonymous peer
                feedback. Our platform connects creators with each other, allowing them to give and receive valuable
                insights without the pressure of revealing their identities.
              </p>
              <p className="text-lg text-gray-700">
                Whether you're a seasoned professional or just starting out, getting fresh perspectives on your work is
                essential for growth. CritiqueLoop makes this process simple, fast, and anxiety-free.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                    <Send className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">1. Submit Your Portfolio</h3>
                  <p className="text-gray-600 text-center">
                    Enter your portfolio URL in our simple submission form. No account creation or personal details
                    required.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">2. Get Randomly Matched</h3>
                  <p className="text-gray-600 text-center">
                    Our system pairs you with another creator. You'll review their work while someone else reviews
                    yours.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">3. Review & Receive Feedback</h3>
                  <p className="text-gray-600 text-center">
                    Provide constructive feedback on your match's portfolio and receive valuable insights on your own
                    work.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">No Login Required</h3>
                <p className="text-gray-600 text-center">
                  Skip the account creation process. Just submit your URL and get started immediately.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Anonymous Submissions</h3>
                <p className="text-gray-600 text-center">
                  Your identity remains private, allowing for honest feedback without social pressure.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Simple & Fast Process</h3>
                <p className="text-gray-600 text-center">
                  Our streamlined system ensures you get valuable feedback quickly and efficiently.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Submit Portfolio Section */}
        <section id="submit" className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Submit Your Portfolio</h2>
            <div className="max-w-md mx-auto">
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <form onSubmit={handlePortfolioSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="portfolio-url" className="block text-sm font-medium text-gray-700 mb-1">
                        Portfolio URL
                      </label>
                      <Input
                        id="portfolio-url"
                        type="url"
                        placeholder="https://your-portfolio.com"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className="w-full"
                      />
                      {portfolioError && <p className="mt-1 text-sm text-red-600">{portfolioError}</p>}
                    </div>
                    <Button type="submit" className="w-full">
                      {portfolioSuccess ? "Submitted Successfully!" : "Submit for Review"}
                    </Button>
                    {portfolioSuccess && (
                      <p className="text-sm text-green-600 text-center">
                        Your portfolio has been submitted! You'll receive feedback soon.
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
            <div className="max-w-md mx-auto">
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your-email@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="How can we help you?"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full min-h-[120px]"
                      />
                    </div>
                    {contactError && <p className="text-sm text-red-600">{contactError}</p>}
                    <Button type="submit" className="w-full">
                      {contactSuccess ? "Message Sent!" : "Send Message"}
                    </Button>
                    {contactSuccess && (
                      <p className="text-sm text-green-600 text-center">
                        Your message has been sent! We'll get back to you soon.
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Code className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-xl font-bold">CritiqueLoop</span>
            </div>
            <div className="text-gray-400 text-sm">© {new Date().getFullYear()} CritiqueLoop. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
