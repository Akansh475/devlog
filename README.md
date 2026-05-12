# DevLog

> A public learning journal for developers — write daily, build streaks, share your progress.

## Live App

🌐 [devlog-rosy.vercel.app](https://devlog-rosy.vercel.app)

📖 Example profile → [devlog-rosy.vercel.app/u/akansh](https://devlog-rosy.vercel.app/u/akansh)

---

## What it does

Most developers learn constantly but have nothing to show for it. DevLog gives you a place to write what you learned each day, automatically tracks your streak, and generates a public profile with a GitHub-style heatmap — so your consistency becomes visible to the world.

---

## Features

- ✦ **Daily log entries** — write what you learned, tag it, track time spent
- 🔥 **Streak tracking** — automatic streak calculation, breaks if you miss a day
- ⚡ **XP system** — earn 10 XP per log, bonus every 7-day milestone
- 🔁 **Streak revival** — spend 50 XP to bring a broken streak back
- 🗓 **GitHub-style heatmap** — 365-day contribution calendar on your profile
- 🌐 **Public profiles** — shareable `/u/:username` page with full history
- 🏷 **Tag filtering** — filter logs by topic on any public profile
- 📋 **Copy profile link** — one-click share from the dashboard

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| HTTP client | Axios |
| Deployment | Vercel |

---

## Local Development

### 1. Clone the repo
```bash
git clone https://github.com/YOURUSERNAME/devlog.git
cd devlog
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```env
VITE_API_URL=http://localhost:5000
```

> For production this points to your Render backend URL.

### 4. Start the dev server
```bash
npm run dev
```

App runs at `http://localhost:5173`

> **Note:** Make sure your backend is running too. See [devlog-backend](https://github.com/YOURUSERNAME/devlog-backend).

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

---

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variable: `VITE_API_URL` = your Render backend URL
4. Deploy — `vercel.json` handles SPA routing automatically

---

## Project Structure

```
src/
  api/
    axios.js          # axios instance with JWT interceptor
  components/
    Navbar.jsx
    LogCard.jsx
    ProtectedRoute.jsx
    CopyProfileLink.jsx
    ErrorBanner.jsx
    Skeletons.jsx
    EmptyState.jsx
  context/
    AuthContext.jsx   # auth state + login/logout
  pages/
    Landing.jsx
    Login.jsx
    Register.jsx
    Dashboard.jsx
    NewLog.jsx
    EditLog.jsx
    PublicProfile.jsx # /u/:username
  App.jsx
```

---

## Backend

This frontend connects to a separate Express + MongoDB backend.

→ [devlog-backend](https://github.com/YOURUSERNAME/devlog-backend)

---

## Built by

**Akansh** — [devlog-rosy.vercel.app/u/akansh](https://devlog-rosy.vercel.app/u/akansh)
