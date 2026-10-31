import type { MetadataRoute } from 'next';
import { pages } from '@/lib/content.mjs';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, changeFrequency: 'monthly', priority: 1 },
    ...Object.keys(pages).map(slug => ({ url: `${site.url}/${slug}/`, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];
}
