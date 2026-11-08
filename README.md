# Stage and Shelf

Sophie Shih's portfolio and personal site, staged as a ballet in two acts.

**Stack:** Next.js 14 (App Router, static export) · React 18 · TypeScript · Tailwind CSS · GSAP + ScrollTrigger · Lenis smooth scrolling · hand-written Canvas 2D particles · `next/font` (Bodoni Moda, Jost, IBM Plex Mono).

1. **Overture**: a particle dancer in pose-tracking style.
2. **Act I · Experience**: roles placed as spike marks on a stage plan.
3. **Entr'acte**: the stage bursts into falling pages.
4. **Contents**: a plain table of contents of every project.
5. **Act II · The Library**: projects as books. Pick a sorting algorithm and they shelve themselves once, then stay put. The last book opens a shelf of favorite books and written works.
6. **Curtain call**: contact, résumé, and a bow.

## Run it

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

## Edit content

| What | Where |
| --- | --- |
| Projects (books on the shelf) | `data/projects.ts` |
| Experience (stage plan) | `data/experience.ts` |
| Favorite books and writing | `data/library.ts` |
| Name, bio, email, links | `data/site.ts` |
| Images and résumé | `public/assets/` |

## Code map

- `app/` — layout (fonts, metadata), page, global styles.
- `components/` — one component per act. `Library.tsx` owns the shelf and sorting; `BookDetail.tsx` renders an open book.
- `lib/choreography.ts` — the particle engine. It reads positions from the DOM and never writes React state.
- `lib/sorting.ts` — records each step of insertion, merge, quick and bubble sort so the shelf can replay it.
- `components/SmoothScroll.tsx` — Lenis + GSAP ScrollTrigger (headline reveal, fade-ups, progress bar, sticky nav).

Motion respects `prefers-reduced-motion`.

## Deploy

- **Vercel:** import the repo; the defaults work.
- **GitHub Pages:** `npm run build` and publish `./out` (for a project page under `/repo-name`, set `basePath` in `next.config.mjs`).
