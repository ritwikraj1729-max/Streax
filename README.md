# ⚡ Streax

> **A premium, minimal habit streak tracker built with pure HTML, CSS, and JavaScript.**

Streax helps you build consistency by tracking multiple habit streaks in one elegant workspace. Whether you're working on fitness, coding, reading, meditation, or any personal goal, Streax provides a clean and distraction-free experience inspired by modern productivity tools like **Linear**, **Arc**, **Apple**, and **Raycast**.

---

# ✨ Features

## 📊 Dashboard

View all your streaks in beautiful, responsive cards displaying:

* Emoji icon
* Habit name
* Current streak
* Description
* Last updated date
* Theme color

Everything is designed for quick scanning while maintaining a premium look.

---

## ➕ Create & Edit Streaks

Create unlimited streaks with customizable:

* Name
* Emoji
* Theme color
* Description

Edit your streak details anytime without losing progress.

---

## 📈 Streak Management

Each streak has its own dedicated page where you can:

### ✅ Add Day (+1)

* Increase your streak
* Update longest streak automatically
* Save progress instantly
* Trigger milestone celebrations

### ➖ Minus Day (-1)

* Decrease the streak (minimum 0)
* Track consecutive minus actions
* Two consecutive minus actions automatically reset the streak

### 🔄 Reset

Reset any streak to zero with a confirmation dialog.

---

## 📊 Statistics

Every streak includes detailed statistics:

* Current streak
* Longest streak
* Date created
* Last updated
* Total days added
* Total resets
* Consecutive minus count

---

## 🕒 Activity Timeline

Every action is permanently recorded:

* Added day
* Minus day
* Reset
* Timestamps

Review your complete journey whenever you want.

---

## 🔍 Search & Sorting

Quickly organize your streaks using:

* Search by name
* Highest streak
* Recently updated
* Alphabetical (A–Z)
* Newest first
* Oldest first

---

## 🎉 Milestone Celebrations

Celebrate consistency with animated achievements.

Milestones include:

* ⭐ 7 Days
* 🚀 30 Days
* 💎 50 Days
* 🏆 100 Days
* 👑 365 Days

Each milestone triggers:

* Confetti animation
* Celebration popup
* Smooth visual effects

---

## 🌑 Permanent Dark Theme

Streax is designed exclusively for dark mode.

Features include:

* Pure black backgrounds
* Charcoal surfaces
* Soft shadows
* Premium gradients
* Modern glassmorphism
* Beautiful glow accents

No light mode.
No unnecessary toggles.
Just one carefully crafted experience.

---

## 💾 Offline & Local Storage

Your data never leaves your browser.

Everything is stored locally using **localStorage**, allowing you to:

* Close the browser safely
* Reopen anytime
* Continue where you left off
* Use the app completely offline

No accounts.
No cloud.
No tracking.

---

# 🎨 Design Philosophy

Streax follows a simple philosophy:

> **Less clutter. More consistency.**

Inspired by products like:

* Linear
* Apple
* Arc Browser
* Raycast
* Notion

The interface focuses on:

* Clean typography
* Spacious layouts
* Smooth animations
* Minimal distractions
* Fast interactions

Every component is designed to feel lightweight, modern, and intentional.

---

# 🚀 Technology Stack

Built using only web standards.

* HTML5
* CSS3
* JavaScript (ES6+)

No frameworks.

No libraries.

No dependencies.

No build tools.

Just three files.

```
streax/
│
├── index.html
├── style.css
└── script.js
```

---

# 🧠 Data Structure

All streaks are stored under:

```text
localStorage
└── streax_data
```

Each streak contains:

```javascript
{
  id,
  name,
  emoji,
  color,
  description,
  current,
  longest,
  created,
  lastUpdated,
  totalAdded,
  totalResets,
  consecutiveMinus,
  history
}
```

Every change immediately:

* Updates the UI
* Saves to localStorage
* Keeps the application reactive

---

# 🎨 Theme Colors

Choose from multiple built-in accent colors.

* 🔵 Blue
* 🟣 Purple
* 🟢 Green
* 🟠 Orange
* 🔴 Red
* 🌸 Pink
* 🟡 Yellow
* 🩵 Teal
* 🟦 Indigo
* ⚪ Slate

Each color automatically styles:

* Cards
* Buttons
* Badges
* Glows
* Progress accents

---

# 😀 Emoji Support

Personalize every streak with emojis.

Examples include:

🏋️ Gym

📚 Reading

💻 Coding

🧘 Meditation

🎨 Art

🎵 Music

💧 Water

🛌 Sleep

🥗 Diet

…and many more.

---

# 📱 Responsive Design

Designed for every screen size.

* 💻 Desktop
* 📱 Mobile
* 📟 Tablet

Features:

* Fluid layouts
* Responsive grids
* Touch-friendly controls
* No horizontal scrolling

---

# 🔒 Privacy

Privacy is a core feature.

✅ No accounts

✅ No analytics

✅ No servers

✅ No tracking

✅ No cloud storage

Everything stays on your own device.

---

# 🚀 Getting Started

1. Clone or download this repository.
2. Open **index.html** in your browser.
3. Create your first streak.
4. Stay consistent.

That's it.

No installation.

No configuration.

No internet connection required.

---

# 🤝 Contributing

Streax is a personal project, but improvements and ideas are always welcome.

Feel free to:

* Fork the project
* Improve the design
* Add new features
* Fix bugs
* Share suggestions

---

# 🌟 Future Ideas

Potential improvements include:

* Weekly analytics
* Calendar heatmap
* Habit categories
* Export & import backups
* Reminder notifications
* Keyboard shortcuts
* Custom milestone rewards
* Multiple themes
* Progressive Web App (PWA) support
* Optional cloud sync

---

# ❤️ Made for Consistency

Streax isn't about completing tasks.

It's about showing up every day.

One day becomes a week.

One week becomes a month.

One month becomes a lifestyle.

**Build better habits, one streak at a time.**
