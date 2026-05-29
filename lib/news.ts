import { kv } from '@vercel/kv';

export type Category = 'Stocks & Equity' | 'Mutual Funds' | 'Gold & Silver' | 'Economy & RBI';
export type Language = 'en' | 'ta';

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
  newsTamil: NewsCard[];   // Tamil versions stored separately
  builtAt: string;
  processedUrls: string[];
}

// One cache key — stores both English and Tamil
const CACHE_KEY = 'fews:daily-news-v2';

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

// ---------- Shared KV cache ----------
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

// ---------- Finance relevance filter ----------
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

// Phrases that indicate stock promotion — strip or reject bullets containing these
const PROMOTION_PHRASES = [
  'buy ', 'sell ', 'buy now', 'strong buy', 'must buy', 'time to buy',
  'add to portfolio', 'good time to invest', 'recommend', 'target price',
  'should invest', 'consider buying', 'consider investing', 'worth buying',
  'opportunity to buy', 'investors should buy', 'good investment',
];

function isFinanceRelated(a: RawArticle): boolean {
  const text = `${a.title} ${a.description}`.toLowerCase();
  if (BLOCK_KEYWORDS.some(kw => text.includes(kw))) return false;
  return FINANCE_KEYWORDS.some(kw => text.includes(kw));
}

// Remove any bullet that promotes buying/selling a specific stock
function stripPromotionalBullets(bullets: string[]): string[] {
  return bullets.filter(bullet => {
    const lower = bullet.toLowerCase();
    return !PROMOTION_PHRASES.some(phrase => lower.includes(phrase));
  });
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

// ---------- AI rewrite — called ONCE per article, both languages at once ----------
async function rewriteWithAI(
  article: RawArticle,
  category: Category,
): Promise<{ en: string[]; ta: string[] }> {
  const key = process.env.ANTHROPIC_API_KEY;

  // Fallback when no API key
  if (!key) {
    const sentences = article.description
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.length > 20)
      .slice(0, 4);
    const fallback = sentences.length > 0 ? sentences : [article.description.slice(0, 200)];
    return { en: fallback, ta: fallback };
  }

  const prompt = `You are a financial news summarizer for FEWS, an Indian finance news app for beginners.

Article Title: ${article.title}
Article Content: ${article.description}
Category: ${category}

Your task: Rewrite this news as bullet points in TWO languages.

STRICT RULES (apply to both languages):
- Do NOT recommend buying or selling any stock, fund, or asset
- Do NOT say things like "investors should buy", "good time to invest", "target price", "strong buy"
- Report facts only — what happened, what it means in context, no opinions or advice
- Write for a first-time Indian retail investor — simple, clear language
- Exactly 3-4 bullet points per language
- Each bullet is 1 sentence

Return ONLY this exact format, nothing else:

ENGLISH:
- bullet 1
- bullet 2
- bullet 3

TAMIL:
- bullet 1 in Tamil
- bullet 2 in Tamil
- bullet 3 in Tamil`;

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
        max_tokens: 600, // doubled to fit both languages
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    const text: string = data.content?.[0]?.text || '';

    // Parse ENGLISH section
    const enMatch = text.match(/ENGLISH:\s*([\s\S]*?)(?=TAMIL:|$)/i);
    const taMatch = text.match(/TAMIL:\s*([\s\S]*?)$/i);

    const parseBullets = (block: string): string[] =>
      (block || '')
        .split('\n')
        .map(l => l.replace(/^[-•*]\s*/, '').trim())
        .filter(l => l.length > 10)
        .slice(0, 4);

    const enBullets = stripPromotionalBullets(parseBullets(enMatch?.[1] || ''));
    const taBullets = parseBullets(taMatch?.[1] || '');

    // Fallback to English if Tamil parsing failed
    return {
      en: enBullets.length > 0 ? enBullets : [article.description.slice(0, 200)],
      ta: taBullets.length > 0 ? taBullets : enBullets,
    };
  } catch {
    const fallback = [article.description.slice(0, 300)];
    return { en: fallback, ta: fallback };
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

// ---------- Process only NEW articles — returns both EN and TA cards ----------
async function processNewArticles(
  freshRaw: RawArticle[],
  category: Category,
  alreadyProcessedUrls: Set<string>,
  existingEnCards: NewsCard[],
  existingTaCards: NewsCard[],
): Promise<{ en: NewsCard[]; ta: NewsCard[] }> {
  const newRaw = freshRaw.filter(a => !alreadyProcessedUrls.has(a.url));
  if (newRaw.length === 0) return { en: existingEnCards, ta: existingTaCards };

  const results = await Promise.all(
    newRaw.slice(0, 10).map(async (article, i) => {
      const { en, ta } = await rewriteWithAI(article, category);
      const base = {
        id: `${category.replace(/\s+/g, '-')}-${Date.now()}-${i}`,
        title: article.title,
        sourceUrl: article.url,
        sourceName: article.source,
        category,
        publishedAt: article.publishedAt,
      };
      return {
        en: { ...base, bullets: en } satisfies NewsCard,
        ta: { ...base, bullets: ta } satisfies NewsCard,
      };
    })
  );

  const validResults = results.filter(r => r.en.bullets.length > 0);
  return {
    en: [...existingEnCards, ...validResults.map(r => r.en)],
    ta: [...existingTaCards, ...validResults.map(r => r.ta)],
  };
}

// ---------- Public API ----------

export async function getAllNews(lang: Language = 'en'): Promise<{ news: NewsCard[]; builtAt: string; fromCache: boolean }> {
  const cached = await readCache();
  if (cached) {
    const news = lang === 'ta' ? cached.newsTamil : cached.news;
    return { news, builtAt: cached.builtAt, fromCache: true };
  }
  const { news, newsTamil, builtAt } = await forceRefreshNews();
  return { news: lang === 'ta' ? newsTamil : news, builtAt, fromCache: false };
}

export async function incrementalRefresh(): Promise<{ news: NewsCard[]; newsTamil: NewsCard[]; builtAt: string; newCount: number }> {
  const categories: Category[] = ['Stocks & Equity', 'Mutual Funds', 'Gold & Silver', 'Economy & RBI'];
  const cached = await readCache();

  if (!cached || cached.date !== getISTDateString()) {
    return forceRefreshNews();
  }

  const alreadyProcessedUrls = new Set(cached.processedUrls || []);
  const previousCount = cached.news.length;
  let updatedEn = [...cached.news];
  let updatedTa = [...(cached.newsTamil || [])];

  for (const category of categories) {
    const freshRaw = await fetchRawForCategory(category);
    const { en, ta } = await processNewArticles(
      freshRaw, category, alreadyProcessedUrls,
      updatedEn.filter(n => n.category === category),
      updatedTa.filter(n => n.category === category),
    );
    updatedEn = [...updatedEn.filter(n => n.category !== category), ...en];
    updatedTa = [...updatedTa.filter(n => n.category !== category), ...ta];
    freshRaw.forEach(a => alreadyProcessedUrls.add(a.url));
  }

  const sort = (cards: NewsCard[]) =>
    globalDedup(cards).sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  const sortedEn = sort(updatedEn);
  const sortedTa = sort(updatedTa);

  await writeCache({
    date: getISTDateString(),
    news: sortedEn,
    newsTamil: sortedTa,
    builtAt: new Date().toISOString(),
    processedUrls: Array.from(alreadyProcessedUrls),
  });

  return { news: sortedEn, newsTamil: sortedTa, builtAt: new Date().toISOString(), newCount: sortedEn.length - previousCount };
}

export async function forceRefreshNews(): Promise<{ news: NewsCard[]; newsTamil: NewsCard[]; builtAt: string; newCount: number }> {
  console.log('[FEWS] Full rebuild — clearing KV cache...');
  await clearCache();

  const categories: Category[] = ['Stocks & Equity', 'Mutual Funds', 'Gold & Silver', 'Economy & RBI'];
  const processedUrls = new Set<string>();
  const allEn: NewsCard[] = [];
  const allTa: NewsCard[] = [];

  for (const category of categories) {
    const freshRaw = await fetchRawForCategory(category);
    freshRaw.forEach(a => processedUrls.add(a.url));
    const { en, ta } = await processNewArticles(freshRaw, category, new Set(), [], []);
    allEn.push(...en);
    allTa.push(...ta);
  }

  const sort = (cards: NewsCard[]) =>
    globalDedup(cards).sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  const sortedEn = sort(allEn);
  const sortedTa = sort(allTa);
  const builtAt = new Date().toISOString();

  await writeCache({
    date: getISTDateString(),
    news: sortedEn,
    newsTamil: sortedTa,
    builtAt,
    processedUrls: Array.from(processedUrls),
  });

  console.log(`[FEWS] Rebuilt with ${sortedEn.length} articles.`);
  return { news: sortedEn, newsTamil: sortedTa, builtAt, newCount: sortedEn.length };
}
