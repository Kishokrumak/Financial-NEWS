import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FEWS – Financial News',
  description: 'Simple, beginner-friendly financial news for Indian investors. Stocks, Mutual Funds, Gold, Silver and Economy explained in plain English.',
  keywords: 'Indian stock market news, mutual fund news, gold price India, RBI news, Nifty Sensex today',
  openGraph: {
    title: 'FEWS – Financial News',
    description: 'Financial news made simple for Indian investors.',
    url: 'https://fews.in',
    siteName: 'FEWS',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Inter for article titles, DM Sans for body */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Noto+Sans+Tamil:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2471284161287322"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
