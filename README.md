# Nivlet website

Next.js App Router, TypeScript, Tailwind CSS and locally hosted **Geist**. Static export; no backend, analytics, forms or external font requests. Local review only; no public download or deployment.

```sh
cd website
npm ci
npm run dev
# Production export and checks:
npm run build
npm run typecheck
npm run verify
```

Development: http://127.0.0.1:4173. `npm run preview` serves the built `out/` directory with byte-range support for video seeking on the same port; stop the dev server first. The export uses trailing-slash routes so a static server can resolve them.

## Design

The owner selected the [Raycast capture](../references/ui-ux/marketing-sites/raycast-full.png) for the structure and dark presentation, then explicitly chose Geist and Nivlet’s own palette. The site uses near-black surfaces, amber/copper hero lighting, white actions, and native tool colors for icons. The navbar sticks 16 px from the top (10 px on narrow screens). Home-page copy names functions; the decorative eyebrow labels and repeated workflow slogans were removed.

Raycast’s live site was inspected: it uses Inter, but the owner’s later Geist instruction takes precedence. No Raycast artwork, text, logo or font files were copied. Geist is served by `next/font/local` from the pinned `@fontsource-variable/geist` package; its [OFL notice](public/fonts/geist-OFL.txt) is included. Lucide supplies consistent vector glyphs, with code-rendered app-icon tiles using Nivlet’s tool hues.

The header/footer and favicons use the owner’s existing assets from [nivlet-v1](../output/brand/nivlet-v1/README.md). The transparent original wordmark is rendered white with CSS, preserving its geometry and clearspace. Native app icon integration is separate from website use.

[Amber hero artwork](public/assets/amber-folds.png) was generated and palette-edited with the built-in image_gen tool; [exact prompt set](artwork/amber-folds-prompt.md). It is decorative. The panel screenshots and original 21-second recording are genuine isolated native app captures with synthetic content, not generated UI. The inline walkthrough is a 14.7-second edit of that recording, with separate desktop and mobile crops, chapter controls, optional descriptions and a transcript. It never autoplays or opens a modal. See [asset provenance and hashes](public/assets/provenance.json).

The support section uses the [official Buy Me a Coffee cup](https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg), stored locally without an embedded widget. The footer links to [Ashique](https://ashique.work) with the owner’s [actual site favicon](https://ashique.work/icon.png?icon.1qvn6x09mx0ct.png). Source URLs and asset hashes are retained in provenance.

## Structure and verification

- `app/`: shared layout, home page and supporting privacy/support/compatibility/terms/release routes.
- `components/native-demo.tsx`: screenshot/video selector; switching away unmounts and pauses playback.
- `components/demo-video.tsx`: inline, user-controlled recording with chapter navigation and a transcript.
- `components/coffee-support.tsx`: optional support section with the official Buy Me a Coffee cup.
- `components/tool-icon.tsx`: shared vector icons and app tiles.
- `lib/content.mjs`: repository-owned supporting copy.
- `app/globals.css` and `components/native-demo.module.css`: shared tokens and showcase geometry alongside Tailwind.
- `scripts/verify-export.mjs`: exported local links/anchors, native-media hashes, design-asset hashes, no external `src`/`poster` (the CSP would block it) and an unexpired `security.txt`.
- `vercel.json`: production security headers for `nivlet.ashique.work` (CSP, HSTS, nosniff, frame denial, referrer, permissions and cross-origin policies). A static export can't set headers from `next.config.ts`, and nonce CSP needs a server, so scripts allow Next's inline bootstrap while every source stays `'self'`. `npm run preview` sends the same headers, without the HTTPS-only parts.
- `public/.well-known/security.txt`: security contact; renew `Expires` before 1 November 2027.

Dependency versions are locked. `out/` and `.next/` are ignored. No full Swift regression is required for these website-only changes. Browser, build and design evidence is recorded in [the refinement review](../docs/implementation/phase8-release/website-refinement.md).

Research for the copy/layout pass: [NN/g’s aesthetic and minimalist design](https://www.nngroup.com/articles/aesthetic-minimalist-design/), [visual hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) and [AI design slop examples](https://www.scoremysite.dev/mistakes/ai-design-slop). Findings were applied to this page; they are references, not an aesthetic certification.

## Recording edit

`scripts/render_website_demo.py` creates both responsive versions from the hashed original. Idle time is removed; the fill-in segment plays at 1.25×. The edit demonstrates functions rather than measuring performance. No copy, upload or model interaction is staged. The exact edit decisions are in `public/assets/native-demo-guided-v2.json`.

Video research: [NN/g video usability](https://www.nngroup.com/articles/video-usability/), [Wistia controls and chapters](https://support.wistia.com/en/articles/8284255-customize-your-video), and [Screen Studio’s readable framing](https://screen.studio/). Applied as short, controlled playback, readable crops, a visible duration and textual alternatives.

## Before publication

`noindex` remains enabled. Finalize the supported-Mac list, publisher/support contact, hosting/privacy/terms, signed/notarized candidate and exact version/checksum/download URL before asking for publication approval. Keep actions pointed at the release-status page until those checks pass. No registration, signing submission, outreach or deployment was performed.

[Phase 8 evidence](../docs/implementation/phase8-release.md) · [Release checklist](../docs/release/checklist.md)
