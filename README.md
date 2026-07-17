# Malmoa — Hangul & Hanja for foreign learners

English-first MVP site for **Malmoa**: brand story, Hangul → Hanja curriculum, two interactive sample lessons, and an early-access waitlist.

Based on Malmoa’s picture · sticker · story method (Wadiz campaign completed; textbooks live). This repo is **Phase 0** — marketing + demos + waitlist, not a full LMS.

## Run locally

```bash
npm install
npm run dev
```

Build for static hosting:

```bash
npm run build
npm run preview
```

## Site map

| Path | Purpose |
|------|---------|
| `/` | Brand hero, method teaser, path, demos, CTA |
| `/program` | Four-stage curriculum + pilot notes |
| `/method` | Picture–story methodology |
| `/lesson/hangul-demo` | Interactive Hangul story + quiz |
| `/lesson/hanja-demo` | Interactive 木 story + meaning/vocab quiz |
| `/waitlist` | Early access form |

## Waitlist storage

Submissions are saved in the browser under `localStorage` key `malmoa-waitlist` (JSON array). Enough for demos; for real ops, replace the submit handler in `src/pages/WaitlistPage.tsx` with Formspree, Google Sheets, or your backend.

## Operating roadmap

### Phase 0 — Launch (now ~4 weeks)

- [x] MVP site live locally
- [ ] Deploy (Vercel / Cloudflare Pages / Netlify)
- [ ] Share Wadiz backers + social links → waitlist
- [ ] Export waitlist weekly; personal outreach
- [ ] Gather feedback from Hangul/Hanja demos

### Phase 1 — Pilot (weeks 5–10)

- Cohort 20–40 learners
- 2× weekly live or async sessions + textbook alignment
- Paid early-access invite (price at invite time)
- Hangul Foundations → Everyday Korean → Hanja Bridge

### Phase 2 — Product (months 3–6)

- Accounts, progress, SRS review
- Full lesson library (not only demos)
- Payments and cohort management
- Optional UI languages beyond English

## Stack

- Vite + React 19 + TypeScript
- React Router
- Plain CSS design tokens (no UI kit)

## Brand notes

Ink `#1A2332`, hanji/cool paper gradients, teal `#0D7377`, dancheong accent `#C45C26`. Display: Fraunces. Body: Source Sans 3.
