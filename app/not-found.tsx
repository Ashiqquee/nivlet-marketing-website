import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return <main id="main" className="prose wrap"><p className="eyebrow">Nivlet / Page unavailable</p><h1>That page isn’t here.</h1><p><Link href="/">Return to Nivlet</Link> or <Link href="/releases">check the release status</Link>.</p></main>;
}
