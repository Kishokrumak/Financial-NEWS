import { kv } from '@vercel/kv';

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
  date: string;
  news: NewsCard[];
  builtAt: string;
  processedUrls: string[];
}

const CACHE_KEY = 'fews:daily-news';

// ---------- IST helpers ----------
function getISTDateString(): string {
  const istOffset = 5.5 * 60 * 60 * 1000;
  return new Date(Date.now() + istOffset).toISOString().slice(0, 10);
}

function getISTYesterday(): string {
  const istOffset = 5.5 * 60 * 60 * 1000;
  return new Date(Date.now() + istOffset - 86400000).toISOString().slice(0, 10);
}

function isRecentEnough(isoString: string): boolean {
  if (!isoString) return false;
  try {
    const istOffset = 5.5 * 60 * 60 * 1000;
    const articleDay = new Date(new Date(isoString).getTime() + istOffset)
      .toISOString().slice(0, 10);
    return articleDay === getISTDateString() || articleDay === getISTYesterday();
  } catch { return true; }
}

// ---------- Shared KV cache — same data for ALL server instances ----------
async function readCache(): Promise<DailyCache | null> {
  try {
    const cache = await kv.get<DailyCache>(CACHE_KEY);
    if (!cache) return null;
    if (cache.date !== getISTDateString()) return null;
    return cache;
  } catch { return null; }
}

async function writeCache(cache: DailyCache): Promise<void> {
  try {
    // Expire at end of day — 30 hours is safe enough
    await kv.set(CACHE_KEY, cache, { ex: 30 * 60 * 60 });
  } catch (e) { console.error('KV write failed:', e); }
}

async function clearCache(): Promise<void> {
  try { await kv.del(CACHE_KEY); } catch {}
}

// ---------- Category queries ----------
const CATEGORY_QUERIES: Record<Category, string[]> = {
  'Stocks & Equity': [
    'Nifty Sensex stock market India',
    'NSE BSE India shares equity',
    'Indian stock market today',
  ],
  'Mutual Funds': [
    'India mutual fund SIP SEBI',
    'mutual fund NAV India investment',
  ],
  'Gold & Silver': [
    'gold price India MCX today',
    'silver price India commodity',
  ],
  'Economy & RBI': [
    'RBI repo rate India monetary policy',
    'India GDP inflation economy budget',
  ],
};

// ---------- Finance relevance ----------
const FINANCE_KEYWORDS = [
  'stock','share','nifty','sensex','bse','nse','market','invest',
  'mutual fund','sip','nav','equity','debt','fund',
  'gold','silver','mcx','commodity','price','rate',
  'rbi','repo','inflation','gdp','economy','fiscal','budget',
  'sebi','ipo','dividend','earnings','revenue','profit','loss',
  'rupee','forex','currency','bond','yield','interest',
  'bank','nbfc','loan','credit','finance','financial',
  'trade','export','import','tariff','tax','gst',
];

const BLOCK_KEYWORDS = [
  'saree','fashion','makeup','beauty','hairstyle','celebrity',
  'bollywood','cricket score','recipe','travel','lifestyle',
  'wedding','film','movie','music','actor','actress',
];

function isFinanceRelated(a: RawArticle): boolean {
  const text = `${a.title} ${a.description}`.toLowerCase();
  if (BLOCK_KEYWORDS.some(kw => text.includes(kw))) return false;
  return FINANCE_KEYWORDS.some(kw => text.includes(kw));
}

// ---------- Deduplication ----------
function normaliseTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().slice(0, 60);
}

function dedupeRaw(articles: RawArticle[]): RawArticle[] {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  return articles.filter(a => {
    if (!a.title || !a.url) return false;
    const norm = normaliseTitle(a.title);
    if (seenUrls.has(a.url) || seenTitles.has(norm)) return false;
    seenUrls.add(a.url);
    seenTitles.add(norm);
    return true;
  });
}

// ---------- API fetchers ----------
async function fetchFromNewsAPI(queries: string[]): Promise<RawArticle[]> {
  const key = process.env.NEWSAPI_KEY;
  if (!key) return [];
  const from = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString().split('T')[0];
  const results: RawArticle[] = [];
  for (const query of queries) {
    try {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&from=${from}&pageSize=10&apiKey=${key}`,
        { cache: 'no-store' }
      );
      const data = await res.json();
      if (data.articles) {
        results.push(...data.articles.map((a: any) => ({
          title: a.title || '',
          description: a.description || a.content || '',
          url: a.url,
          source: a.source?.name || 'NewsAPI',
          publishedAt: a.publishedAt,
        })));
      }
    } catch {}
  }
  return results;
}

async function fetchFromMarketaux(category: Category): Promise<RawArticle[]> {
  const key = process.env.MARKETAUX_KEY;
  if (!key) return [];
  const symbolMap: Partial<Record<Category, string>> = {
    'Stocks & Equity': 'NIFTY,SENSEX',
    'Gold & Silver': 'GOLD,SILVER',
  };
  const symbols = symbolMap[category];
  const endpoint = symbols
    ? `https://api.marketaux.com/v1/news/all?symbols=${symbols}&filter_entities=true&language=en&limit=10&api_token=${key}`
    : `https://api.marketaux.com/v1/news/all?countries=in&language=en&limit=10&api_token=${key}`;
  try {
    const res = await fetch(endpoint, { cache: 'no-store' });
    const data = await res.json();
    return (data.data || []).map((a: any) => ({
      title: a.title || '',
      description: a.description || '',
      url: a.url,
      source: a.source || 'Marketaux',
      publishedAt: a.published_at,
    }));
  } catch { return []; }
}

async function fetchFromGNews(queries: string[]): Promise<RawArticle[]> {
  const key = process.env.GNEWS_KEY;
  if (!key) return [];
  try {
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(queries[0])}&lang=en&country=in&max=10&apikey=${key}`,
      { cache: 'no-store' }
    );
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

// ---------- AI rewrite (called ONCE per article, result stored in KV) ----------
async function rewriteWithAI(article: RawArticle, category: Category): Promise<string[]> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    const sentences = article.description
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.length > 20)
      .slice(0, 4);
    return sentences.length > 0 ? sentences : [article.description.slice(0, 200)];
  }
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `You are a financial news summarizer for FEWS, an Indian finance news app for beginners.

Article Title: ${article.title}
Article Content: ${article.description}
Category: ${category}

Rewrite as exactly 3-4 bullet points in simple beginner-friendly English for an Indian retail investor.
Each bullet: 1 clear sentence, avoids jargon, factual and concise.
Return ONLY bullet points, one per line, starting with dash (-). No intro, no conclusion.`,
        }],
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

// ---------- Fetch & filter raw articles ----------
async function fetchRawForCategory(category: Category): Promise<RawArticle[]> {
  const queries = CATEGORY_QUERIES[category];
  const [newsapi, marketaux, gnews] = await Promise.all([
    fetchFromNewsAPI(queries),
    fetchFromMarketaux(category),
    fetchFromGNews(queries),
  ]);
  return dedupeRaw([...newsapi, ...marketaux, ...gnews])
    .filter(isFinanceRelated)
    .filter(a => isRecentEnough(a.publishedAt));
}

function globalDedup(cards: NewsCard[]): NewsCard[] {
  const seen = new Set<string>();
  return cards.filter(card => {
    const norm = normaliseTitle(card.title);
    if (seen.has(norm)) return false;
    seen.add(norm);
    return true;
  });
}

// ---------- Process only NEW articles — never rewrites existing ones ----------
async function processNewArticles(
  freshRaw: RawArticle[],
  category: Category,
  alreadyProcessedUrls: Set<string>,
  existingCards: NewsCard[],
): Promise<NewsCard[]> {
  const newRaw = freshRaw.filter(a => !alreadyProcessedUrls.has(a.url));
  if (newRaw.length === 0) return existingCards;
  const newCards = await Promise.all(
    newRaw.slice(0, 10).map(async (article, i) => {
      const bullets = await rewriteWithAI(article, category);
      return {
        id: `${category.replace(/\s+/g, '-')}-${Date.now()}-${i}`,
        title: article.title,
        bullets,
        sourceUrl: article.url,
        sourceName: article.source,
        category,
        publishedAt: article.publishedAt,
      } satisfies NewsCard;
    })
  );
  return [...existingCards, ...newCards.filter(c => c.bullets.length > 0)];
}

// ---------- Public API ----------

// Serves from shared KV cache — zero Claude calls on user visits
export async function getAllNews(): Promise<{ news: NewsCard[]; builtAt: string; fromCache: boolean }> {
  const cached = await readCache();
  if (cached) return { news: cached.news, builtAt: cached.builtAt, fromCache: true };
  const { news, builtAt } = await forceRefreshNews();
  return { news, builtAt, fromCache: false };
}

// Incremental — checks for new articles, only rewrites ones not already processed
export async function incrementalRefresh(): Promise<{ news: NewsCard[]; builtAt: string; newCount: number }> {
  const categories: Category[] = ['Stocks & Equity', 'Mutual Funds', 'Gold & Silver', 'Economy & RBI'];
  const cached = await readCache();

  if (!cached || cached.date !== getISTDateString()) {
    const result = await forceRefreshNews();
    return { ...result, newCount: result.news.length };
  }

  const alreadyProcessedUrls = new Set(cached.processedUrls || []);
  const previousCount = cached.news.length;
  let updatedNews = [...cached.news];

  for (const category of categories) {
    const freshRaw = await fetchRawForCategory(category);
    const categoryCards = updatedNews.filter(n => n.category === category);
    const updated = await processNewArticles(freshRaw, category, alreadyProcessedUrls, categoryCards);
    updatedNews = [...updatedNews.filter(n => n.category !== category), ...updated];
    freshRaw.forEach(a => alreadyProcessedUrls.add(a.url));
  }

  const deduped = globalDedup(updatedNews)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  await writeCache({
    date: getISTDateString(),
    news: deduped,
    builtAt: new Date().toISOString(),
    processedUrls: Array.from(alreadyProcessedUrls),
  });

  return { news: deduped, builtAt: new Date().toISOString(), newCount: deduped.length - previousCount };
}

// Full rebuild — called by midnight cron, clears old cache
export async function forceRefreshNews(): Promise<{ news: NewsCard[]; builtAt: string }> {
  console.log('[FEWS] Full rebuild — clearing KV cache...');
  await clearCache();

  const categories: Category[] = ['Stocks & Equity', 'Mutual Funds', 'Gold & Silver', 'Economy & RBI'];
  const processedUrls = new Set<string>();
  const allCards: NewsCard[] = [];

  for (const category of categories) {
    const freshRaw = await fetchRawForCategory(category);
    freshRaw.forEach(a => processedUrls.add(a.url));
    const cards = await processNewArticles(freshRaw, category, new Set(), []);
    allCards.push(...cards);
  }

  const deduped = globalDedup(allCards)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const cache: DailyCache = {
    date: getISTDateString(),
    news: deduped,
    builtAt: new Date().toISOString(),
    processedUrls: Array.from(processedUrls),
  };
  await writeCache(cache);

  console.log(`[FEWS] Rebuilt with ${deduped.length} articles.`);
  return { news: deduped, builtAt: cache.builtAt };
}
