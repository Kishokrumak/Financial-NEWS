import fs from 'fs';
import path from 'path';

export type Category = 'Stocks & Equity' | 'Mutual Funds' | 'Gold & Silver' | 'Economy & RBI';

export interface NewsCard {
  id: string;
  title: string;
  bullets: string[];
  sourceUrl: string;
  sourceName: string;
  category: Category;
  publishedAt: string;
}

interface RawArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

interface DailyCache {
  date: string; // YYYY-MM-DD in IST
  news: NewsCard[];
  builtAt: string;
}

// ---------- IST helpers ----------
function getISTDateString(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);
  return istNow.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function isPublishedTodayIST(isoString: string): boolean {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const articleIST = new Date(new Date(isoString).getTime() + istOffset);
  return articleIST.toISOString().slice(0, 10) === getISTDateString();
}

// ---------- Cache helpers ----------
// On Vercel, /tmp is the only writable directory
const CACHE_DIR = process.env.NODE_ENV === 'production' ? '/tmp/fews-cache' : path.join(process.cwd(), 'cache');
const CACHE_FILE = path.join(CACHE_DIR, 'daily-news.json');

function readCache(): DailyCache | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
    const cache: DailyCache = JSON.parse(raw);
    // Only valid if cache was built today (IST)
    if (cache.date !== getISTDateString()) return null;
    return cache;
  } catch {
    return null;
  }
}

function writeCache(news: NewsCard[]): void {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    const cache: DailyCache = {
      date: getISTDateString(),
      news,
      builtAt: new Date().toISOString(),
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), 'utf-8');
  } catch (e) {
    console.error('Cache write failed:', e);
  }
}

// ---------- Category search queries ----------
const CATEGORY_QUERIES: Record<Category, string[]> = {
  'Stocks & Equity': ['Indian stock market NSE BSE', 'Nifty Sensex today', 'India equity shares'],
  'Mutual Funds':    ['India mutual fund SIP', 'SEBI mutual fund India'],
  'Gold & Silver':   ['gold price India today', 'silver price India MCX'],
  'Economy & RBI':   ['RBI monetary policy India', 'India GDP inflation economy'],
};

// ---------- Finance relevance filter ----------
const FINANCE_KEYWORDS = [
  'stock', 'share', 'nifty', 'sensex', 'bse', 'nse', 'market', 'invest',
  'mutual fund', 'sip', 'nav', 'equity', 'debt fund',
  'gold', 'silver', 'mcx', 'commodity', 'price',
  'rbi', 'repo rate', 'inflation', 'gdp', 'economy', 'fiscal', 'budget',
  'sebi', 'ipo', 'dividend', 'earnings', 'revenue', 'profit', 'loss',
  'rupee', 'forex', 'currency', 'bond', 'yield', 'interest rate',
  'bank', 'nbfc', 'loan', 'credit', 'finance', 'financial',
];

function isFinanceRelated(article: RawArticle): boolean {
  const text = `${article.title} ${article.description}`.toLowerCase();
  return FINANCE_KEYWORDS.some(kw => text.includes(kw));
}

// ---------- Deduplication ----------
function normaliseTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().slice(0, 60);
}

function dedupeRaw(articles: RawArticle[]): RawArticle[] {
  const seenUrls   = new Set<string>();
  const seenTitles = new Set<string>();
  return articles.filter(a => {
    const norm = normaliseTitle(a.title);
    if (seenUrls.has(a.url) || seenTitles.has(norm)) return false;
    seenUrls.add(a.url);
    seenTitles.add(norm);
    return true;
  });
}

// ---------- NewsAPI ----------
async function fetchFromNewsAPI(category: Category): Promise<RawArticle[]> {
  const key = process.env.NEWSAPI_KEY;
  if (!key) return [];
  const query = CATEGORY_QUERIES[category][0];
  const from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&from=${from}&pageSize=5&apiKey=${key}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return (data.articles || []).map((a: any) => ({
      title: a.title || '',
      description: a.description || a.content || '',
      url: a.url,
      source: a.source?.name || 'NewsAPI',
      publishedAt: a.publishedAt,
    }));
  } catch { return []; }
}

// ---------- Marketaux ----------
async function fetchFromMarketaux(category: Category): Promise<RawArticle[]> {
  const key = process.env.MARKETAUX_KEY;
  if (!key) return [];
  const symbolMap: Partial<Record<Category, string>> = {
    'Stocks & Equity': 'NIFTY,SENSEX',
    'Gold & Silver':   'GOLD,SILVER',
  };
  const symbols = symbolMap[category];
  const endpoint = symbols
    ? `https://api.marketaux.com/v1/news/all?symbols=${symbols}&filter_entities=true&language=en&api_token=${key}`
    : `https://api.marketaux.com/v1/news/all?countries=in&language=en&api_token=${key}`;
  try {
    const res = await fetch(endpoint, { cache: 'no-store' });
    const data = await res.json();
    return (data.data || []).slice(0, 5).map((a: any) => ({
      title: a.title || '',
      description: a.description || '',
      url: a.url,
      source: a.source || 'Marketaux',
      publishedAt: a.published_at,
    }));
  } catch { return []; }
}

// ---------- GNews ----------
async function fetchFromGNews(category: Category): Promise<RawArticle[]> {
  const key = process.env.GNEWS_KEY;
  if (!key) return [];
  const query = CATEGORY_QUERIES[category][1] || CATEGORY_QUERIES[category][0];
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=5&apikey=${key}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return (data.articles || []).map((a: any) => ({
      title: a.title || '',
      description: a.description || '',
      url: a.url,
      source: a.source?.name || 'GNews',
      publishedAt: a.publishedAt,
    }));
  } catch { return []; }
}

// ---------- AI rewrite — called ONCE per article, result is cached ----------
async function rewriteWithAI(article: RawArticle, category: Category): Promise<string[]> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    const sentences = article.description
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.length > 20)
      .slice(0, 4);
    return sentences.length > 0 ? sentences : [article.description.slice(0, 200)];
  }

  const prompt = `You are a financial news summarizer for FEWS, an Indian finance news app for beginners.

Article Title: ${article.title}
Article Content: ${article.description}
Category: ${category}

Rewrite this news as exactly 3-4 bullet points in simple, beginner-friendly English. Each bullet:
- Is 1 sentence, clear and easy to understand
- Avoids jargon (or briefly explains it if unavoidable)
- Is factual and concise
- Focuses on what matters to an Indian retail investor

Return ONLY the bullet points, one per line, starting with a dash (-). No intro, no conclusion.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // Haiku is 10x cheaper than Sonnet, perfect for rewrites
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    const text: string = data.content?.[0]?.text || '';
    const bullets = text
      .split('\n')
      .map((l: string) => l.replace(/^[-•*]\s*/, '').trim())
      .filter((l: string) => l.length > 10);
    return bullets.slice(0, 4);
  } catch {
    return [article.description.slice(0, 300)];
  }
}

// ---------- Build fresh news (calls Claude) — only runs once per day ----------
async function buildFreshNews(): Promise<NewsCard[]> {
  const categories: Category[] = ['Stocks & Equity', 'Mutual Funds', 'Gold & Silver', 'Economy & RBI'];

  const results = await Promise.all(categories.map(async (category) => {
    const [newsapi, marketaux, gnews] = await Promise.all([
      fetchFromNewsAPI(category),
      fetchFromMarketaux(category),
      fetchFromGNews(category),
    ]);

    const combined = dedupeRaw([...newsapi, ...marketaux, ...gnews])
      .filter(isFinanceRelated)
      .filter(a => isPublishedTodayIST(a.publishedAt))
      .slice(0, 8);

    const cards = await Promise.all(
      combined.map(async (article, i) => {
        const bullets = await rewriteWithAI(article, category);
        return {
          id: `${category}-${i}-${Date.now()}`,
          title: article.title,
          bullets,
          sourceUrl: article.url,
          sourceName: article.source,
          category,
          publishedAt: article.publishedAt,
        } satisfies NewsCard;
      })
    );
    return cards.filter(c => c.bullets.length > 0);
  }));

  const all = results.flat();

  // Global dedupe across all categories by title
  const globalSeenTitles = new Set<string>();
  const deduped = all.filter(card => {
    const norm = normaliseTitle(card.title);
    if (globalSeenTitles.has(norm)) return false;
    globalSeenTitles.add(norm);
    return true;
  });

  // Sort newest first
  return deduped.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// ---------- Main export — serves from cache, Claude never called twice ----------
export async function getAllNews(): Promise<{ news: NewsCard[]; builtAt: string; fromCache: boolean }> {
  // 1. Try to serve from today's cache first
  const cached = readCache();
  if (cached) {
    return { news: cached.news, builtAt: cached.builtAt, fromCache: true };
  }

  // 2. Cache is empty or stale — build fresh (this is the ONLY time Claude is called)
  console.log('Cache miss — fetching and rewriting news with Claude...');
  const news = await buildFreshNews();
  writeCache(news);
  return { news, builtAt: new Date().toISOString(), fromCache: false };
}

// ---------- Force refresh — called by cron job at midnight ----------
export async function forceRefreshNews(): Promise<{ news: NewsCard[]; builtAt: string }> {
  console.log('Force refresh triggered — rebuilding cache...');
  const news = await buildFreshNews();
  writeCache(news);
  return { news, builtAt: new Date().toISOString() };
}
