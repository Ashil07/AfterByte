# AfterByte

Website for **AfterByte** — a creative technology studio building websites, apps,
business systems and automations. *Thoughtfully designed. Intelligently built.*

The site is a single scroll-driven story in nine chapters: from “Every big thing
starts somewhere” through the everyday complications of running a business, to what a
better system looks like, what AfterByte builds, and a contact form.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, GSAP
(ScrollTrigger + SplitText), Zod and Nodemailer.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional for local dev; needed for the contact form to send
npm run dev                  # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm test` | Vitest unit tests (contact schema, delivery, API route) |
| `npm run check` | lint + typecheck + test |
| `npm run assets` | Regenerate wordmark, icons, OG image and placeholder art from `brand/` (Python 3 + Pillow/NumPy/SciPy) |

## Contact form setup

The form posts to `/api/contact`. Until email delivery is configured, the API answers
`503 not_configured` and the form tells the visitor their message was **not** sent.

Set these server-side environment variables (never prefix with `NEXT_PUBLIC_`):

```
CONTACT_TO_EMAIL=you@yourdomain.com        # where inquiries arrive
CONTACT_FROM_EMAIL=website@yourdomain.com  # sender your provider allows

# Either SMTP (most mail hosts)…
SMTP_HOST=smtp.yourhost.com
SMTP_PORT=587
SMTP_USER=…
SMTP_PASS=…
# SMTP_SECURE=true   # for port 465

# …or Resend (takes precedence if set)
RESEND_API_KEY=…
```

Also set `NEXT_PUBLIC_SITE_URL` to the live URL (canonical links, sitemap, Open Graph).

## Editing content

All content lives in `src/content/`:

- `site.ts` — public email and social links (empty = hidden)
- `services.ts` — the four services
- `projects.ts` — portfolio (currently **placeholders**, clearly labelled on the page)
- `team.ts` — team members (currently **placeholders**)
- `approach.ts` — principles and the chapter 02 starting points
- `problems.ts` — chapter 03 problem/solution copy

Replace placeholders only with real, approved information. See `CLAUDE.md` for the full
content rules, design system and animation conventions.

## Deployment

Deploy anywhere that runs Next.js 16 on Node ≥ 20.9 (e.g. Vercel). The home page is
statically prerendered; only `/api/contact` runs on the server.
