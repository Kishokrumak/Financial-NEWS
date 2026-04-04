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
  twitter: {
    card: 'summary_large_image',
    title: 'FEWS – Financial News',
    description: 'Financial news made simple for Indian investors.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>{children}</body>
    </html>
  );
}
