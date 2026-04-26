# FEWS – Financial News
## fews.in

Simple, beginner-friendly financial news for Indian investors.
Covers: Stocks & Equity · Mutual Funds · Gold & Silver · Economy & RBI

---

## 🚀 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Claude Haiku API** – rewrites news into plain English (cheapest Claude model)
- **NewsAPI + Marketaux + GNews** – free news sources
- **File-based cache** – Claude is called ONCE per day, not on every visit

---

## 💰 Cost After Caching Fix

| Before fix | After fix |
|---|---|
| Claude called on every user visit | Claude called ONCE at midnight |
| ~$0.50–1.50/day | ~$0.10–0.15/day |
| $5 lasts 3–10 days | $5 lasts 30–50 days |

---

## 📦 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up API keys
```bash
cp .env.local.example .env.local
# Open .env.local and fill in your keys
```

| Key | Where to get it | Free tier |
|---|---|---|
| `NEWSAPI_KEY` | https://newsapi.org | 500 req/day |
| `MARKETAUX_KEY` | https://www.marketaux.com | 100 req/day |
| `GNEWS_KEY` | https://gnews.io | 100 req/day |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com | Pay per use |

### 3. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

### 4. Build for production
```bash
npm run build
npm start
```

---

## 🌐 Deploy to fews.in (Vercel)

1. Push this folder to a GitHub repo
2. Go to https://vercel.com → Import project
3. Add all 4 environment variables in Vercel dashboard
4. Set custom domain: fews.in

---

## 🔄 How the Caching Works

```
Midnight IST (cron job)
    ↓
Fetch fresh articles from NewsAPI + Marketaux + GNews
    ↓
Filter: only finance-related, only today's date, deduplicate
    ↓
Claude rewrites each article into bullet points (ONCE only)
    ↓
Save to /tmp/fews-cache/daily-news.json
    ↓
All user visits → served from cache (Claude never called again)
    ↓
Silent refresh every 15 mins → reads cache, adds new articles if any
```

---

## 📁 Project Structure

```
fews/
├── app/
│   ├── api/
│   │   └── news/
│   │       ├── route.ts          # Serves news from cache
│   │       └── refresh/
│   │           └── route.ts      # Cron endpoint — rebuilds cache at midnight
│   ├── disclaimer/page.tsx
│   ├── privacy/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── NewsFeed.tsx              # Filter, sort, silent refresh
│   ├── NewsCard.tsx              # Individual card UI
│   └── SkeletonCard.tsx          # Loading placeholder
├── lib/
│   └── news.ts                   # Fetch + filter + cache + AI rewrite
├── public/
│   └── robots.txt
├── vercel.json                   # Cron job: midnight IST refresh
├── .env.local.example
└── README.md
```

---

## ✅ All Bugs Fixed

- ✅ Old news filtered — only today's IST date shown
- ✅ Midnight cron resets news automatically
- ✅ Silent auto-refresh every 15 mins for open tabs
- ✅ Duplicate articles removed across all categories
- ✅ Irrelevant articles (fashion, lifestyle) blocked
- ✅ Claude called only ONCE per day (caching)
- ✅ Switched to Claude Haiku (10x cheaper than Sonnet)
- ✅ .gitignore excludes node_modules and .env.local
- ✅ No API keys hardcoded anywhere

---

## 💰 Google AdSense Setup

1. Apply at https://adsense.google.com after 30 days of content
2. Add AdSense script to `/app/layout.tsx` in `<head>`
3. Add ad units between cards in `/components/NewsFeed.tsx`

Built for FEWS.in · Financial News for Indian Investors
