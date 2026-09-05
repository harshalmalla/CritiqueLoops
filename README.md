# CritiqueLoop

A minimal and anonymous peer feedback platform for developers and designers to exchange portfolio reviews.

## 🧾 Problem Statement
**Code:** WD-01  
**Goal:** Create a platform where users submit their portfolio links and are matched anonymously for feedback.

## 🌐 Live Demo
🔗 [View CritiqueLoop Live](https://harshalmalla.github.io/CritiqueLoops/)

## 🎯 Features

- 📤 Submit your portfolio anonymously
- 🔁 Real matching system — you're automatically paired with the next person who submits
- 🧾 Leave and receive feedback without login (identity is a one-time opaque token, never shown to anyone)
- 💻 Frontend built with HTML, CSS, and JS
- 🗄️ Backend API on Node/Express + MongoDB, deployed on Render
- 📱 Mobile-responsive design

## 🛠 Tech Stack

- **Frontend:** HTML, CSS, JavaScript — built visually using [v0.dev](https://v0.dev), hosted on GitHub Pages
- **Backend:** Node.js + Express + MongoDB (Mongoose), hosted on [Render](https://render.com) — see [server/README.md](server/README.md) for setup and deploy steps
- **Database:** MongoDB Atlas (free tier)

## 📁 Folder Structure
```
CritiqueLoops/
├── index.html
├── styles.css
├── script.js
├── render.yaml        # Render deploy blueprint
└── server/            # Express + MongoDB API (see server/README.md)
```

## 🚀 How to Use

1. Open the live site (or run `index.html` locally)
2. Enter your portfolio link and submit
3. You're queued and automatically matched with the next submitter — the page updates itself, no reload needed
4. Review their portfolio and leave feedback; see feedback others left for you on the same page
5. Anonymous throughout — no login, no personal data stored beyond the URL, email/message you submit

## 🔒 Ethics & Simplicity

- No login. Anonymity is enforced by a one-time, unguessable token — not by trusting the client
- No portfolio or feedback data is shared with anyone outside your match
- Focused on UX for Round 1 demo, but the matching and feedback loop is real, not simulated

## 🧩 Future Enhancements

- Review reputation system
- Sentiment-based feedback scoring
- Login and personalized dashboard

## 📬 Team

**Created by:** Harshal & Team  
📧 Contact: critique.loop.team@gmail.com

