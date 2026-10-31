import type { Metadata, Viewport } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';
import { ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from '@/components/scroll-reveal';
import { site } from '@/lib/site';
import './globals.css';

const inter = localFont({
  src: '../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  variable: '--font-inter', display: 'swap', weight: '100 900', style: 'normal',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: '%s — Nivlet' },
  description: site.description,
  applicationName: site.name,
  authors: [site.maker],
  creator: site.maker.name,
  publisher: site.maker.name,
  category: 'productivity',
  alternates: { canonical: '/' },
  robots: site.indexable
    ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } }
    : { index: false, follow: false },
  openGraph: { type: 'website', siteName: site.name, locale: 'en_US', url: '/', title: site.title, description: site.description, images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description, images: [site.ogImage] },
  formatDetection: { telephone: false, email: false, address: false },
  icons: { icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' }], apple: '/apple-touch-icon.png' },
};

export const viewport: Viewport = { themeColor: '#07080a', colorScheme: 'dark' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={inter.variable}><body>
    <a className="skip" href="#main">Skip to content</a>
    <div className="header-shell">
      <header className="site-header wrap">
        <Link href="/" className="brand" aria-label="Nivlet home"><Image src="/brand/nivlet-wordmark.png" width={132} height={44} alt="Nivlet" priority /></Link>
        <nav className="header-links" aria-label="Main"><Link href="/#tour">Tour</Link><Link href="/#tools">Tools</Link><Link href="/#privacy">Privacy</Link><Link href="/#questions">FAQ</Link><Link href="/support">Support</Link></nav>
        <Link className="nav-status" href="/releases">Release status <ArrowUpRight size={14} aria-hidden="true" /></Link>
      </header>
    </div>
    <ScrollReveal />
    {children}
    <footer className="site-footer wrap">
      <div className="footer-top"><Link href="/" className="brand" aria-label="Nivlet home"><Image src="/brand/nivlet-wordmark.png" width={132} height={44} alt="Nivlet" loading="eager" /></Link><div className="maker-credit"><span>Made by</span><a className="maker-link" href="https://ashique.work" rel="noreferrer"><Image src="/brand/ashique-favicon.png" width={22} height={22} alt="" /><span>Ashique</span><ArrowUpRight size={13} aria-hidden="true" /></a></div></div>
      <div className="footer-bottom"><nav aria-label="Footer"><Link href="/privacy">Privacy</Link><Link href="/support">Support & recovery</Link><Link href="/compatibility">Compatibility</Link><Link href="/terms">Terms</Link></nav></div>
    </footer>
  </body></html>;
}
