import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pages } from '@/lib/content.mjs';

type Slug = keyof typeof pages;
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(pages).map(slug => ({slug})); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const {slug} = await params;
  if (!(slug in pages)) return {};
  const {metaTitle: title, description} = pages[slug as Slug];
  const url = `/${slug}/`;
  return { title, description, alternates: { canonical: url }, openGraph: { url, title, description }, twitter: { title, description } };
}
export default async function InformationPage({ params }: { params: Promise<{ slug: string }> }) {
  const {slug} = await params;
  if (!(slug in pages)) notFound();
  const page = pages[slug as Slug];
  // Only repository-owned, static editorial content enters these two fields.
  return <main id="main" className="prose wrap">
    <p className="eyebrow">Nivlet / {slug === 'releases' ? 'Release status' : slug}</p>
    <h1 dangerouslySetInnerHTML={{__html:page.title}} />
    <div dangerouslySetInnerHTML={{__html:page.body}} />
  </main>;
}
