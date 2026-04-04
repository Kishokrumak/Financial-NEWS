# FEWS – Financial News
## fews.in

Simple, beginner-friendly financial news for Indian investors.
Covers: Stocks & Equity · Mutual Funds · Gold & Silver · Economy & RBI

---

## 🚀 Tech Stack

- **Next.js 14** (App Router) – SSR + ISR for SEO and AdSense
- **TypeScript** – Type safe
- **No external UI libraries** – Pure CSS, zero bloat
- **AI rewrites** – Claude API (Anthropic) rewrites news in plain English
- **News Sources** – NewsAPI + Marketaux + GNews (all free tiers)

---

## 📦 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up API keys
Copy `.env.local.example` to `.env.local` and fill in your keys:

```bash
cp .env.local.example .env.local
```

| Key | Where to get it | Free tier |
|-----|----------------|-----------|
| `NEWSAPI_KEY` | https://newsapi.org | 500 req/day |
| `MARKETAUX_KEY` | https://www.marketaux.com | 100 req/day |
| `GNEWS_KEY` | https://gnews.io | 100 req/day |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com | Pay per use (~₹0.01/article) |

> **Note:** The app works without API keys using fallback summaries.
> For full AI rewrites, you need the Anthropic API key.

### 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000

### 4. Build for production
```bash
npm run build
npm start
```

---

## 🌐 Deploy to fews.in

### Option A: Vercel (Recommended – Free)
1. Push this folder to a GitHub repo
2. Go to https://vercel.com → Import project
3. Add environment variables in Vercel dashboard
4. Set custom domain: fews.in → point DNS to Vercel

### Option B: Self-hosted (VPS)
```bash
npm run build
npm start
# Use PM2 for process management:
pm2 start npm --name fews -- start
```

---

## 🔄 How the Daily Refresh Works

News refreshes automatically via **Next.js ISR (Incremental Static Regeneration)**:
- `revalidate = 86400` (24 hours) in `/app/api/news/route.ts`
- The API route fetches fresh news from all sources once per day
- Old news is automatically replaced

To force a refresh manually, trigger a revalidation or redeploy.

---

## 💰 Google AdSense Setup

1. Apply at https://adsense.google.com once the site has 20+ articles
2. Add your AdSense script to `/app/layout.tsx` in the `<head>`:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>
   ```
3. Add ad units between news cards in `/components/NewsFeed.tsx`

**AdSense checklist:**
- ✅ Original AI-rewritten content (not copied)
- ✅ Privacy Policy page at /privacy
- ✅ Disclaimer page at /disclaimer  
- ✅ Original articles linked (attribution)
- ✅ Mobile responsive
- ✅ robots.txt

---

## 📁 Project Structure

```
fews/
├── app/
│   ├── api/news/route.ts     # News API endpoint (daily refresh)
│   ├── disclaimer/page.tsx   # Disclaimer page
│   ├── privacy/page.tsx      # Privacy Policy page
│   ├── globals.css           # Design tokens + base styles
│   ├── layout.tsx            # Root layout + SEO metadata
│   └── page.tsx              # Homepage
├── components/
│   ├── NewsFeed.tsx          # Filter/sort + renders all cards
│   ├── NewsCard.tsx          # Individual news card UI
│   └── SkeletonCard.tsx      # Loading placeholder
├── lib/
│   └── news.ts               # News fetching + AI rewriting logic
├── public/
│   └── robots.txt
├── .env.local.example        # API keys template
└── README.md
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#3176FF` |
| Secondary | `#4A69A6` |
| Accent | `#FF8C42` |
| Font Display | Instrument Serif |
| Font Body | DM Sans |

---

## ⚠️ Legal Notes

- News is fetched via **licensed APIs** (NewsAPI, Marketaux, GNews) – legally compliant
- Summaries are **AI-rewritten** in original language – not copy-pasted
- Each card links to the **original article** – proper attribution
- Content is **not financial advice** – covered by Disclaimer page
- This approach follows the **Inshorts model** of news aggregation

---

Built for FEWS.in · Financial News for Indian Investors
