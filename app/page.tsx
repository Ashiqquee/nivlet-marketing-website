import Link from 'next/link';
import { ArrowRight, ArrowUpRight, EyeOff, HardDrive, MousePointerClick, WifiOff } from 'lucide-react';
import { Beams } from '@/components/beams';
import { NativeDemo } from '@/components/native-demo';
import { DemoVideo } from '@/components/demo-video';
import { ToolCarousel } from '@/components/tool-carousel';
import { CoffeeSupport } from '@/components/coffee-support';
import { DownloadButton } from '@/components/download-button';
import { site } from '@/lib/site';
import { release } from '@/lib/release';

const keys = [
  { caps: ['⌘', 'F'], label: 'Search the pocket' },
  { caps: ['↩'], label: 'Copy the selected prompt' },
  { caps: ['⌘', 'K'], label: 'Open actions' },
  { caps: ['esc'], label: 'Close the panel' },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': `${site.url}/#website`, url: `${site.url}/`, name: site.name, description: site.description, inLanguage: 'en' },
    {
      '@type': 'SoftwareApplication', '@id': `${site.url}/#app`, name: site.name, description: site.description, url: `${site.url}/`,
      applicationCategory: 'UtilitiesApplication', operatingSystem: 'macOS', processorRequirements: 'Apple silicon',
      image: `${site.url}${site.ogImage.url}`, screenshot: `${site.url}/assets/prompts.png`,
      softwareVersion: release.version, downloadUrl: `${site.url}${release.href}`, fileSize: release.size,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@type': 'Person', name: site.maker.name, url: site.maker.url },
    },
  ],
};

export default function Home() {
  return <main id="main">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <section className="hero" aria-labelledby="hero-title">
      <Beams />
      <div className="hero-copy wrap">
        <h1 id="hero-title" className="enter" style={{ '--i': 0 } as React.CSSProperties}>Your prompts.<br />One click away.</h1>
        <p className="hero-description enter" style={{ '--i': 1 } as React.CSSProperties}>Prompts, reference files and notes in a native panel at the edge of your Mac. Free, local and offline.</p>
        <div className="hero-actions enter" style={{ '--i': 2 } as React.CSSProperties}><DownloadButton /><a className="button secondary" href="#tour">See how it works</a></div>
        <div className="hero-meta enter" style={{ '--i': 3 } as React.CSSProperties}><p>{release.macOSName} or later and Apple silicon required</p><p className="hero-links"><Link href="/releases#install">How to install</Link><Link href="/releases">Version {release.version} release notes</Link></p></div>
        <a className="announcement enter" style={{ '--i': 4 } as React.CSSProperties} href="#tools">Four tools in one panel <ArrowRight size={14} aria-hidden="true" /></a>
      </div>
    </section>

    <section className="tour-section wrap" id="tour" aria-labelledby="tour-title">
      <div className="section-intro center quiet" data-reveal><h2 id="tour-title">Stay in your chat, not your folders.</h2><p>One panel for everything you reuse.</p></div>
      <div data-reveal><NativeDemo /></div>
    </section>

    <section className="keys-section wrap" aria-labelledby="keys-title">
      <div className="keys-copy" data-reveal><h2 id="keys-title">Less hunting.<br /><span>More doing.</span></h2><p>Open the panel, find what you need and get back to work. The keyboard works as well as the mouse.</p><a className="button secondary small" href="#tour">Take the tour</a></div>
      <ul className="keys-board" data-reveal>{keys.map((item, index) => <li key={item.label} style={{ '--k': index } as React.CSSProperties}><span className="caps">{item.caps.map(cap => <kbd key={cap}>{cap}</kbd>)}</span><span>{item.label}</span></li>)}</ul>
    </section>

    <section className="tools-section wrap" id="tools" aria-labelledby="tools-title">
      <div className="section-intro quiet" data-reveal><h2 id="tools-title">A small kit for every project.</h2><p>Use it with the AI app you already have.</p></div>
      <div data-reveal><ToolCarousel /></div>
    </section>

    <section className="privacy-section wrap" id="privacy" aria-labelledby="privacy-title">
      <div className="section-intro center" data-reveal><p className="eyebrow">Private by design</p><h2 id="privacy-title">Works offline.<br /><span>Stays on your Mac.</span></h2></div>
      <div className="privacy-grid" data-reveal>
        <article><HardDrive size={20} strokeWidth={1.5} aria-hidden="true" /><h3>Stored locally</h3><p>Your pockets live on your Mac. No account, cloud library or sync.</p></article>
        <article><WifiOff size={20} strokeWidth={1.5} aria-hidden="true" /><h3>No internet needed</h3><p>There’s no model, API key or provider connection. Every tool works offline.</p></article>
        <article><EyeOff size={20} strokeWidth={1.5} aria-hidden="true" /><h3>Nothing watched</h3><p>Nivlet doesn’t read your chats or monitor your clipboard.</p></article>
        <article><MousePointerClick size={20} strokeWidth={1.5} aria-hidden="true" /><h3>You choose what to share</h3><p>Copy and drag only happen when you ask. Nothing is pasted or sent for you.</p></article>
      </div>
      <p className="center-link" data-reveal><Link className="text-link" href="/privacy">Read the privacy policy <ArrowUpRight size={14} aria-hidden="true" /></Link></p>
    </section>

    <section className="video-section wrap" aria-labelledby="video-title">
      <div className="section-intro center quiet" data-reveal><h2 id="video-title">Watch it work.</h2><p>A 15-second walkthrough of the native app.</p></div>
      <div className="video-shell" data-reveal><DemoVideo /></div>
    </section>

    <section className="questions wrap" id="questions" aria-labelledby="questions-title"><div data-reveal><h2 id="questions-title">Questions</h2><p>Anything else? <Link href="/support">Visit support</Link>.</p></div><div className="faq-list" data-reveal>
      <details><summary>Is Nivlet free?</summary><p>Yes. No trial, licence or feature paywall. You can <a href="https://buymeacoffee.com/ashiqquee" rel="noreferrer">buy the maker a coffee</a> if it’s useful. Support is optional and doesn’t unlock anything.</p></details>
      <details><summary>How do I install it?</summary><p>Download the disk image, open it and drag Nivlet into Applications. {release.notarized ? 'Then open Nivlet from Applications.' : 'This early version isn’t notarized by Apple yet, so the first time you open it you’ll need to approve it once in System Settings.'} <Link href="/releases#install">See the install steps</Link>.</p></details>
      <details><summary>Which Macs and apps does it work with?</summary><p>Nivlet needs a Mac with Apple silicon and macOS Sonoma or later. It works alongside any AI app or website, because you choose what to copy or drag into it. <Link href="/compatibility">See the requirements</Link>.</p></details>
      <details><summary>Does it connect to ChatGPT or Claude?</summary><p>You use your existing AI app. Nivlet has no model connection or API key. You choose when to paste or attach, and check upload completion yourself. External AI service fees remain separate.</p></details>
      <details><summary>How do I back up my work?</summary><p>Export one or all pockets with their files. Restoring an export adds its pockets alongside yours and never replaces anything. Before updating, it’s also worth making a full backup. <Link href="/support#recovery">Read the recovery steps</Link>.</p></details>
    </div></section>

    <CoffeeSupport />

    <section className="final-cta" aria-labelledby="final-title">
      <Beams variant="final" />
      <div className="wrap" data-reveal><h2 id="final-title">Keep your kit within reach.</h2><p>Free, offline and always right beside your AI app.</p><div className="hero-actions"><DownloadButton /><Link className="button secondary" href="/releases">Release notes</Link></div></div>
    </section>
  </main>;
}
