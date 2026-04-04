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

// ---------- Deduplicate by title similarity ----------
function dedupe(articles: RawArticle[]): RawArticle[] {
  const seen = new Set<string>();
  return articles.filter(a => {
    const key = a.title.toLowerCase().slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ---------- Main export ----------
export async function fetchNewsForCategory(category: Category): Promise<NewsCard[]> {
  const [newsapi, marketaux, gnews] = await Promise.all([
    fetchFromNewsAPI(category),
    fetchFromMarketaux(category),
    fetchFromGNews(category),
  ]);

  const combined = dedupe([...newsapi, ...marketaux, ...gnews]).slice(0, 8);

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
  // Sort newest first
  return all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
