export type Category = 'Stocks & Equity' | 'Mutual Funds' | 'Gold & Silver' | 'Economy & RBI';

export interface NewsCard {
  id: string;
  title: string;
  bullets: string[];
  sourceUrl: string;
  sourceName: string;
  category: Category;
  publishedAt: string; // ISO string
  imageUrl?: string;
}

// ---------- Category → search queries ----------
const CATEGORY_QUERIES: Record<Category, string[]> = {
  'Stocks & Equity': ['Indian stock market NSE BSE', 'Nifty Sensex today', 'India equity shares'],
  'Mutual Funds': ['India mutual fund SIP', 'SEBI mutual fund India'],
  'Gold & Silver': ['gold price India today', 'silver price India MCX'],
  'Economy & RBI': ['RBI monetary policy India', 'India GDP inflation economy'],
};

// ---------- Fetch from NewsAPI ----------
async function fetchFromNewsAPI(category: Category): Promise<RawArticle[]> {
  const key = process.env.NEWSAPI_KEY;
  if (!key) return [];
  const query = CATEGORY_QUERIES[category][0];
  const from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&from=${from}&pageSize=5&apiKey=${key}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    return (data.articles || []).map((a: any) => ({
      title: a.title,
      description: a.description || a.content || '',
      url: a.url,
      source: a.source?.name || 'NewsAPI',
      publishedAt: a.publishedAt,
    }));
  } catch { return []; }
}

// ---------- Fetch from Marketaux ----------
async function fetchFromMarketaux(category: Category): Promise<RawArticle[]> {
  const key = process.env.MARKETAUX_KEY;
  if (!key) return [];
  const symbolMap: Partial<Record<Category, string>> = {
    'Stocks & Equity': 'NIFTY,SENSEX',
    'Gold & Silver': 'GOLD,SILVER',
  };
  const symbols = symbolMap[category];
  const endpoint = symbols
    ? `https://api.marketaux.com/v1/news/all?symbols=${symbols}&filter_entities=true&language=en&api_token=${key}`
    : `https://api.marketaux.com/v1/news/all?countries=in&language=en&api_token=${key}`;
  try {
    const res = await fetch(endpoint, { next: { revalidate: 3600 } });
    const data = await res.json();
    return (data.data || []).slice(0, 5).map((a: any) => ({
      title: a.title,
      description: a.description || '',
      url: a.url,
      source: a.source || 'Marketaux',
      publishedAt: a.published_at,
    }));
  } catch { return []; }
}

// ---------- Fetch from GNews ----------
async function fetchFromGNews(category: Category): Promise<RawArticle[]> {
  const key = process.env.GNEWS_KEY;
  if (!key) return [];
  const query = CATEGORY_QUERIES[category][1] || CATEGORY_QUERIES[category][0];
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=5&apikey=${key}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    return (data.articles || []).map((a: any) => ({
      title: a.title,
      description: a.description || '',
      url: a.url,
      source: a.source?.name || 'GNews',
      publishedAt: a.publishedAt,
    }));
  } catch { return []; }
}

interface RawArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

// ---------- AI rewrite via Claude API ----------
async function rewriteWithAI(article: RawArticle, category: Category): Promise<string[]> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    // Fallback: split description into sentences as bullets
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

Rewrite this news as exactly 3-4 bullet points in simple, beginner-friendly English. Each bullet point should:
- Be 1 sentence, clear and easy to understand
- Avoid jargon (or briefly explain it if unavoidable)
- Be factual and concise
- Focus on what matters to an Indian retail investor

Return ONLY the bullet points, one per line, starting with a dash (-). No intro text, no conclusion.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
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

// ---------- Normalise title for comparison ----------
function normaliseTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().slice(0, 60);
}

// ---------- Deduplicate within a single fetch (by URL and title) ----------
function dedupeRaw(articles: RawArticle[]): RawArticle[] {
  const seenUrls  = new Set<string>();
  const seenTitles = new Set<string>();
  return articles.filter(a => {
    const normTitle = normaliseTitle(a.title);
    if (seenUrls.has(a.url) || seenTitles.has(normTitle)) return false;
    seenUrls.add(a.url);
    seenTitles.add(normTitle);
    return true;
  });
}

// ---------- Check if article is actually finance-related ----------
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

// ---------- Main export ----------
export async function fetchNewsForCategory(category: Category): Promise<NewsCard[]> {
  const [newsapi, marketaux, gnews] = await Promise.all([
    fetchFromNewsAPI(category),
    fetchFromMarketaux(category),
    fetchFromGNews(category),
  ]);

  const combined = dedupeRaw([...newsapi, ...marketaux, ...gnews])
    .filter(isFinanceRelated) // drop non-finance articles before calling Claude
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
}

export async function fetchAllNews(): Promise<NewsCard[]> {
  const categories: Category[] = ['Stocks & Equity', 'Mutual Funds', 'Gold & Silver', 'Economy & RBI'];
  const results = await Promise.all(categories.map(fetchNewsForCategory));
  const all = results.flat();

  // ---------- Global dedupe across ALL categories by title ----------
  // Prevents same article appearing under multiple category labels
  const globalSeenTitles = new Set<string>();
  const dedupedAll = all.filter(card => {
    const norm = normaliseTitle(card.title);
    if (globalSeenTitles.has(norm)) return false;
    globalSeenTitles.add(norm);
    return true;
  });

  // Sort newest first
  return dedupedAll.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
