# AfterByte — website

> Read this file before modifying the project. It is the source of truth for what the
> site is, how it is built, and the rules it must keep. Update it whenever the
> architecture, content model or conventions change.

## 1. Project overview

**AfterByte** is a creative technology agency. It designs and builds websites, apps,
business systems and automations for small businesses, startups and individuals at
accessible prices.

- **Brand line:** AfterByte — Thoughtfully designed. Intelligently built.
- **Audience:** owners of small and growing businesses, first-time founders and
  individuals with an idea. Many are not technical. They arrive with a problem
  (“I think I need a website”) rather than a spec.
- **Positioning:** premium craft at practical prices. Clear scope, direct
  communication, maintainable software. Never “cheap”, never “enterprise”.
- **Goal of the site:** a visitor arrives thinking they need a website and leaves seeing
  how AfterByte could make their business work better, then sends a project inquiry.

It is a single-page, story-driven site (`/`) plus a contact API (`/api/contact`).

## 2. Interactive narrative

The visitor is the protagonist, their business is the challenge, AfterByte is the
guide. Sections are numbered chapters; the desktop header shows the current one.

**Currently hidden:** `work` and `team` are switched off (`enabled: false` in
`src/content/chapters.ts`) until real projects and profiles are ready, and
`turning-point` is switched off because its closing line (“Where we come in”) now
ends chapter 03. Their components and content are intact. Chapter numbers are
assigned to enabled chapters only, so the live page runs 01–06 (Services = 04,
Approach = 05, Contact = 06), and navigation links
to hidden chapters are dropped automatically. The numbers in the table below are the
full nine-chapter sequence.

| # | id | Story beat | What happens | Component |
|---|----|-----------|--------------|-----------|
| 01 | `top` | Possibility | Living version of the logo. Halftone light sweeps in from bottom-left while the wordmark gathers out of halftone dots drifting in along the light (`halftone/wordmarkAssembly.ts`, a plain rise if the image is not decoded yet; the footer reverses it), headline lines unmask, CTAs follow. Pointer light on desktop. Scene recedes on scroll. | `chapters/Opening.tsx` |
| 02 | `vision` | Possibility | “You’ve got the vision.” Second line inks in word by word (scrub). Three starting points reshape a halftone figure (seed / growth / order; desktop only — on mobile each choice expands inline). Optional. | `chapters/Vision.tsx` |
| 03 | `friction` | Friction | **Main moment.** Desktop: pinned ~3.4 viewports. Five UI fragments (search, messages, spreadsheet, reminders, idea note) pile up in disarray with their problem captions; headline yields to “You don’t need more complexity. You need a better system.”; fragments straighten into a row, swap messy faces for clean ones, joined by a line; the statement then fades up and out and “Where we come in — We design and build digital solutions around the way your business actually works.” rises into its place. Mobile: one shorter sentence after the cards instead (“You need a better system, built around how your business actually works.”); desktop reduced motion: both full lines in natural flow. | `chapters/friction/*` |
| 04 | `turning-point` | Discovery | **Hidden.** “What if everything just worked?” Scattered halftone resolves into three bands aligned with three rows of copy (website / software / automation). AfterByte introduced. On mobile/reduced motion it also shows the clean fragments (`.system-fallback`). | `chapters/TurningPoint.tsx` |
| 05 | `services` | Transformation | Desktop: the heading and service copy share the left column, sticky panel right (it starts beside the heading) shows the matching demo assembled by scroll progress (website wireframe → site; app skeleton → screen; loose records → dashboard). Automation follows as a full-width four-step flow. Below lg: a swipeable deck, one card per service (tagline, one line, demo, “What’s included” on tap), with a tab row that sticks under the header and follows the swipe; native scroll-snap, demos play when their card is first shown; compact automation flow and narrower app demo keep card heights close. | `chapters/Services.tsx`, `chapters/ServiceDeck.tsx`, `chapters/demos/*` |
| 06 | `work` | Proof | Editorial portfolio, three rotating compositions, clip-path image reveals, different hover per layout. | `chapters/Work.tsx` |
| 07 | `team` | Connection | Staggered portraits from content data. | `chapters/Team.tsx` |
| 08 | `approach` | Connection | Quiet: CSS-sticky statement + four principles on the main ink background (so it reads as a new chapter after the ink-2 Services section). Still on desktop by design; on mobile each principle enters as reached (rule draws, numeral rises, copy follows). Below lg each principle shows only its title; tapping it opens the explanation (`ApproachPrinciple`). | `chapters/Approach.tsx`, `chapters/ApproachMotion.tsx`, `chapters/ApproachPrinciple.tsx` |
| 09 | `contact` | Action | Closing halftone mirrors the opening and brightens on arrival; process steps; form. Footer carries the large wordmark as a bookend; on hover (fine pointer) it reverses the opening — the letters dissolve into halftone dots around the cursor and bulge away from it (`halftone/WordmarkHalftone.tsx`). | `chapters/contact/*`, `layout/SiteFooter.tsx` |

The story must read correctly with all animation disabled (verified with
`prefers-reduced-motion: reduce`).

## 3. Visual identity / design system

Source artwork: `brand/afterbyte-logo-original.jpg`. High-contrast Didone wordmark
with swash ligatures, white on black, over a regular grid of warm-white and pale-blue
halftone dots in diagonal light bands.

- **Wordmark:** `public/brand/wordmark.png` (white on transparent, 1706×514), extracted
  from the artwork by `scripts/generate-assets.py`. Never substitute a font for it.
- **Halftone grid** is the recurring motif: hero, Vision figure, scattered → ordered in
  04 (hidden), portfolio placeholders, closing. Rendered live by `components/halftone`.

### Colours — tokens in `src/app/globals.css` `@theme` (use as Tailwind classes)

| Token | Value | Use |
|---|---|---|
| `ink` | `#08090B` | page background |
| `ink-2` | `#111318` | secondary surfaces (Services, demo panels, fragment cards) |
| `ink-3` | `#181B21` | chat bubbles and small raised details |
| `paper` | `#F5F5F2` | primary text, primary button |
| `mute` | `#92949D` | secondary text (≈6.8:1 on ink) |
| `ice` | `#A7C8E8` | accent: focus ring, emphasis italics, active states, solutions |
| `warm` | `#EDE6DA` | warm dot tone; the paper note in chapter 03 |
| `error` | `#F0B9A8` | form error text and the failure notice |
| `line` / `line-strong` | white 10% / 18% | hairlines and borders |

No gradient text, glow blobs, glassmorphism or purple. The only gradients are
fades from a halftone into the page background.

### Typography
- **Instrument Serif** 400 roman + italic (`font-serif`) — headlines and statements.
  Italic marks one emphasised phrase per headline.
- **Geist** (`font-sans`) — body and UI. **Geist Mono** (`font-mono`, `label` utility) — small metadata only.
- Display utilities: `display-xl`, `display-l`, `display-m` (fluid clamp sizes, tight leading).
- Use typographic apostrophes (’) in copy, never `'` or `&apos;`.

### Layout
- `frame` utility = max 100rem, side padding `clamp(1.25rem, 4vw, 4rem)`.
- `grid-12` utility = 12-column grid. Compositions are asymmetric and differ per
  chapter; avoid centering everything and repeated card grids.
- Buttons (`ui/Button.tsx`) are rectangular (2px radius): `primary`, `outline`, `text`.
  Primary/outline press down to `scale(0.97)` in 150ms.
  Arrows nudge on hover; primary lifts 1px. No pills.
- Breakpoints: Tailwind defaults plus `xs` (30rem). Desktop storytelling starts at `lg` (1024px).

## 4. Architecture

- **Next.js 16.4 App Router** (Turbopack, `cacheComponents` on), React 19.3, TypeScript strict.
- **Tailwind CSS v4** via `@tailwindcss/turbopack` (configured in `next.config.ts`; no PostCSS file).
- **GSAP 3.15** + ScrollTrigger + SplitText via `@gsap/react`. Motion for React is
  intentionally **not** installed — GSAP + CSS cover everything.
- **Zod 4** (shared validation), **Nodemailer** (SMTP), **lucide-react** (a few icons),
  **server-only**, **Vitest** (tests).

```
brand/                     supplied logo (source artwork)
scripts/generate-assets.py wordmark, icons, OG image, halftone placeholders
public/brand|work|team/    generated images
src/
  app/
    layout.tsx             fonts, metadata, JSON-LD, html.js flag, skip link, header/footer
    page.tsx               chapters in order
    globals.css            tokens, utilities, intro gating, pinned-scene CSS, panel crossfade
    api/contact/route.ts   POST handler (+ route.test.ts)
    sitemap.ts robots.ts icon.png apple-icon.png opengraph-image.jpg
    error.tsx not-found.tsx loading.tsx
  components/
    chapters/              one component per chapter; friction/ and contact/ subfolders
    chapters/demos/        DemoShell + Web/App/Systems demos + AutomationFlow, each exporting assemble*(el)
    halftone/              field.ts (pure light fields), engine.ts (canvas renderer), Halftone.tsx (React wrapper),
                           WordmarkHalftone.tsx (footer wordmark hover effect), wordmarkAssembly.ts
                           (hero intro), coverage.ts (wordmark alpha → dot sizes, shared by both)
    layout/                SiteHeader (nav with active section, rolling chapter indicator, animated
                           mobile menu), SiteFooter, Year,
                           MobileActionBar (fixed “Start a project” + “Call” below lg)
    motion/                gsap.ts (registration + MOTION queries), RevealText, Magnetic
    ui/                    Button/ButtonLink, ChapterMark
  content/                 site, chapters, services, problems, projects, team, approach
  lib/                     cn.ts; contact/{schema, deliver, rate-limit, events}.ts
```

**Server vs client:** `page.tsx`, `Approach`, `SiteFooter`, `ChapterMark`, `Button` are
server components. Chapters with animation are client components.

**Data:** all copy-heavy data lives in `src/content`. Layout components never hard-code
projects, team, services or problems.

## 5. Animation conventions

- Import gsap only from `components/motion/gsap.ts` (registers plugins once).
- Every animated component uses `useGSAP(fn, { scope })` + `gsap.matchMedia()` with
  `MOTION.desktop` / `MOTION.mobile` / `MOTION.reduced`, and returns `() => mm.revert()`.
- **Gotcha:** with `scope`, selector strings resolve *inside* the scope element. To
  reference something outside (e.g. `#top` from the header) pass an element, or use
  an IntersectionObserver as the header does.
- **Natural CSS state = final state.** Use `from`/`fromTo`; without JS, under reduced
  motion, or after a revert, everything is visible. Demo timelines are “primed”
  (`tl.progress(1).progress(0)`) so start states render before playback.
- Reveals run once (`once: true`). Scrubbed timelines only for: hero recede, Vision ink,
  Friction pin, 04 halftone morph (hidden), service demos (desktop), automation flow (desktop),
  closing illumination.
- **Pinning:** only chapter 03, desktop only. It sets `data-pinned` on the section,
  which switches CSS to the pinned grid (see `globals.css`). Services uses CSS `sticky`.
  Header chapter indicator and solid-header state use IntersectionObservers (immune
  to pin spacing).
- Animate `transform`, `opacity`, `clip-path`, canvas draws. No blur filters.
- **Tailwind 4 gotcha:** `translate-*`, `scale-*` and `rotate-*` set the separate CSS
  `translate` / `scale` / `rotate` properties, not `transform`. A custom
  `transition-[…]` list must name `translate`/`scale` (e.g.
  `transition-[background-color,translate,scale]`), or the change snaps.
  `transition-transform` already includes them.
- **Halftone engine** draws on demand (intro sweep, transitions, pointer, morph,
  resize) via a single rAF request, skips work off-screen (IntersectionObserver),
  caps DPR at 2, batches dots into 12 colour paths. No perpetual loop. Pointer light
  needs `(hover: hover) and (pointer: fine)` and motion allowed. The footer wordmark
  uses the same rules: a canvas of dots sampled from the wordmark's alpha, plus a radial
  mask set inline on the image from JS (not in globals.css). The engine is created
  in a layout effect so parents’ `useGSAP` callbacks can drive it immediately.
- **Hero intro gating:** `html.js` (inline script) hides `[data-intro]` elements; GSAP
  reveals them and adds `.is-revealed`. A CSS fallback shows them after 3s regardless.
- **Mobile (<1024px):** no pinning or scrub-driven demos; short, triggered entrances.
  A fixed bottom action bar (`MobileActionBar`) keeps “Start a project” and “Call”
  on screen; it hides (IntersectionObserver) while `#contact` or the footer is
  visible so it never covers the form. The hero has extra bottom padding below `lg`
  so its own CTAs sit above the bar.
- **Reduced motion:** no transforms; halftone fields show their final shapes; the
  Services panel still switches demos (opacity only).
- Never store per-frame scroll values in React state.

## 6. Contact form

- Client: `chapters/contact/ContactForm.tsx`. Validates with the shared schema on submit
  and on blur, marks `aria-invalid`, links errors via `aria-describedby`, focuses the
  first invalid field, keeps values on failure, and shows success **only** when the API
  returns `{ ok: true }`. Service CTAs preselect the service via a window event
  (`lib/contact/events.ts`).
- Server: `app/api/contact/route.ts` → same-origin check → 20 KB limit → JSON parse →
  honeypot (`website`, silently accepted and dropped) → Zod → in-memory rate limit
  (5 per 10 min per IP, per instance) → `deliver()`.
- `lib/contact/deliver.ts` (server-only): Resend (HTTPS, no SDK) if `RESEND_API_KEY`
  is set, else SMTP via Nodemailer. Both need `CONTACT_TO_EMAIL` + `CONTACT_FROM_EMAIL`.
  Reply-To is the visitor. Subject is single-line; HTML body is escaped.
- Responses: 200 ok · 400 invalid/bad_request · 403 forbidden · 413 too large ·
  429 rate_limited · **503 not_configured** · 502 delivery_failed. Each maps to honest UI copy.
- Fields: name, email, company (optional), service, message. There is deliberately no
  budget field. Phone, email, Instagram and location live in the footer's Contact
  column, not beside the form.

## 7. Content management

- **Showing / hiding chapters:** set `enabled` in `src/content/chapters.ts`. To bring
  back Selected Work or the Team, flip `work` / `team` to `true` — `page.tsx`, the
  numbering, header indicator, mobile menu and nav all follow. Turning point, Work
  and Team render through `chapters/OptionalChapter.tsx` (client-side dynamic
  imports), so their code is only downloaded when they are enabled.
- **Projects:** edit `src/content/projects.ts`. Add images to `public/work/` (≈1600px
  wide, webp/jpg). Remove `placeholder: true` once every field is real. `outcome` only
  if client-verified. Order in the array = order on the page; layouts rotate every 3.
  `problem`, `solution` and `technologies` are optional: a real project without a
  written case study (e.g. Dulhan) shows “Case study details to be added”.
  Prefer a screenshot of the live product over a logo; set `image.position` (CSS
  object-position) when the important part of a screenshot is off-centre. When
  replacing an image, use a new filename — the Next image optimiser caches by URL.
- **Team:** edit `src/content/team.ts`. Portraits in `public/team/` at 4:5. Real people,
  with consent, bios in their words.
- **Services:** `src/content/services.ts` (title, `short` tab name for the phone deck, tagline, summary, capabilities, CTA).
  The four ids are referenced by demos and the form; adding a fifth needs a demo or a
  layout decision in `Services.tsx`.
- **Contact details / socials:** `src/content/site.ts` (`email`, `phone` {display, tel},
  `socials`). Empty values are hidden everywhere (footer, contact, form failure
  message, JSON-LD). Current: email afterbytestudio.business@gmail.com, phone
  +91 98456 35981, Instagram @afterbyte.studio.
- **SEO:** `src/content/site.ts` holds `seoTitle` (search-result title), `description`
  (keep ≈155–160 characters), `location` (Mangaluru / Mangalore, Karnataka) and
  `keywords`. `app/layout.tsx` turns these into metadata, `en-IN` locale, geo tags and
  JSON-LD (`ProfessionalService` with city-level address, areaServed, services, plus
  `WebSite`). The same location and service words appear in visible copy — hero label,
  service titles and lists, the footer paragraph and the footer Contact column (“Based in …”) — because Google
  ranks on what people can read. Keep them consistent with the Google Business
  Profile (same name, phone, city). Never add ratings, prices or a street address to
  structured data unless they are real and shown on the page. `GOOGLE_SITE_VERIFICATION`
  (env) emits the Search Console meta tag. `app/manifest.ts` serves the web manifest.
- **Chapter 03 fragments:** `src/content/problems.ts` (copy + chaos positions) and
  `chapters/friction/faces.tsx` (UI). Demo data is fictional and labelled as such.
- **Placeholders** render a visible “Placeholder” label. Search for `placeholder: true`.
- **Never invent** clients, projects, metrics, testimonials, awards, prices, team
  members, bios, response times or policies.

## 8. Commands and deployment

```bash
npm install            # Node >= 20.9 (developed on Node 24)
npm run dev            # http://localhost:3000
npm run lint           # ESLint (next core-web-vitals + typescript)
npm run typecheck      # tsc --noEmit
npm test               # Vitest: schema, delivery helpers, contact route
npm run check          # lint + typecheck + test
npm run build && npm start
npm run assets         # regenerate brand/placeholder images (needs Python 3 + Pillow, NumPy, SciPy)
```

**Environment** (see `.env.example`; set in the host’s dashboard, never commit):
`NEXT_PUBLIC_SITE_URL`, `GOOGLE_SITE_VERIFICATION` (optional), `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, and either
`RESEND_API_KEY` or `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_SECURE`.

**Hosting:** any Node host that runs Next.js 16 (Vercel works with zero config; without
`NEXT_PUBLIC_SITE_URL`, `site.url` falls back to Vercel’s
`NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL`). The
home page is fully static; only `/api/contact` runs on the server (Node runtime — it is
the default; `export const runtime` is not allowed with `cacheComponents`).

## 9. Development standards

- TypeScript strict; type content with exported types; no `any`.
- Components PascalCase, one main component per file; hooks/utilities camelCase;
  data attributes (`data-card`, `data-demo`…) are animation hooks — keep them when editing markup.
- Accessibility: one `h1` (hero headline), `h2` per chapter, `h3` inside. Decorative
  canvases/demos are `aria-hidden` with meaning carried by text. Visible focus ring
  (`:focus-visible` ice outline). Tap targets ≥ 40px. Skip link first in tab order.
- Security: secrets only in server env; `deliver.ts` imports `server-only`; escape any
  user content placed in HTML; keep the origin check and honeypot.
- Errors: route handler never throws to the client; failures are logged without PII
  beyond what is needed.
- Testing: add Vitest specs next to the code (`*.test.ts`). Browser behaviour was
  verified manually with headless Chrome (desktop 1440, tablet 768, mobile 375,
  reduced motion) — re-check those after layout or animation changes.

## 10. Instructions for future Claude sessions

- Read this file before modifying the project; inspect existing code before changing it.
- Preserve the visual identity (wordmark, halftone, serif/sans pairing, palette) and the chapter narrative.
- Do not add decorative animation without a narrative or functional purpose.
- Do not expose secrets or move credentials to client code.
- Do not remove working functionality without justification.
- Do not claim lint/tests/build passed without running them.
- Update this file when architecture, content model or commands change.
