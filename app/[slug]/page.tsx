import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pages } from '@/lib/content.mjs';
import { site } from '@/lib/site';
import { UpdateStatus } from '@/components/update-status';

type Slug = keyof typeof pages;
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(pages).map(slug => ({slug})); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const {slug} = await params;
  if (!(slug in pages)) return {};
  const {metaTitle: title, description} = pages[slug as Slug];
  const url = `/${slug}/`;
  // Nested metadata replaces the layout's rather than merging, so the shared image is repeated here.
  return {
    title, description, alternates: { canonical: url },
    openGraph: { type: 'website', siteName: site.name, locale: 'en_US', url, title, description, images: [site.ogImage] },
    twitter: { card: 'summary_large_image', title, description, images: [site.ogImage] },
  };
}
export default async function InformationPage({ params }: { params: Promise<{ slug: string }> }) {
  const {slug} = await params;
  if (!(slug in pages)) notFound();
  const page = pages[slug as Slug];
  // Only repository-owned, static editorial content enters these two fields.
  return <main id="main" className="prose wrap">
    <p className="eyebrow">Nivlet / {slug === 'releases' ? 'Download' : slug}</p>
    <h1 dangerouslySetInnerHTML={{__html:page.title}} />
    {slug === 'releases' && <UpdateStatus />}
    <div dangerouslySetInnerHTML={{__html:page.body}} />
  </main>;
}
