# Stage and Shelf

The personal site and project portfolio of **Sophie Suzuki Shih**, a Computer Science and Neuroscience student at Duke. The site is staged as a short ballet: a particle dancer opens the show, her experience is blocked out on a stage plan, and her projects end up as books on a shelf that you sort yourself.

The theme comes from three things Sophie loves: dancing, reading, and building.

## The show, in order

| Act | Component | What happens |
| --- | --- | --- |
| **Overture** | `Hero.tsx` | Name, a one-line intro, and a dancer drawn in particles, styled like pose tracking (`pose · arabesque`, `confidence 0.97`). She moves through a sequence of poses on her own. |
| **Act I · Experience** | `Experience.tsx` | The dancer bursts apart and the particles redraw as a stage plan. Each role sits on a spike mark (stage right, downstage center, upstage left and so on). |
| **Entr'acte** | `Interlude.tsx` | A stretch of scroll where the stage scatters into falling pages. |
| **Contents** | `Contents.tsx` | The pages gather into a paper stack around a plain table of contents, so every project is visible at once. Each entry links straight to its book. |
| **Act II · The Project Library** | `Library.tsx`, `BookDetail.tsx` | Projects as books. Pick a sorting algorithm (insertion, merge, quick or bubble) and press shelve: the shelf replays every comparison and swap once, by date, then stays still so the books are easy to open. The last book, *Reading & Writing*, opens a small shelf of favorite books and written work. |
| **Curtain call** | `Curtain.tsx` | Contact links, résumé, and a bow. |

## Built with

- **Next.js 14** (App Router, static export) with **React 18** and **TypeScript**
- **Tailwind CSS** plus hand-written styles in `app/globals.css`
- **GSAP + ScrollTrigger** for scroll-driven reveals, and **Lenis** for smooth scrolling
- A hand-written **Canvas 2D particle engine** for the dancer, stage plan, pages and gold foil (no Three.js or other graphics library)
- Fonts via `next/font`: Bodoni Moda, Jost and IBM Plex Mono

### Reduced motion

If the visitor's system asks for reduced motion (`prefers-reduced-motion: reduce`), the dancer holds a single pose, the particle bursts and twinkle are switched off, the canvas only redraws on scroll and resize, and the shelf jumps straight to its sorted order.

## Run it locally

You need Node.js 18.17 or newer.

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # writes the finished static site to ./out
```

## Change the content

All the words, links and images live in `data/` and `public/assets/`, so you rarely need to touch a component.

| To change | Edit |
| --- | --- |
| Name, intro line, email, LinkedIn, GitHub, résumé, headshot | `data/site.ts` |
| Roles on the stage plan (title, dates, stage mark, x/y position) | `data/experience.ts` |
| Projects on the shelf | `data/projects.ts` |
| Favorite books and written works | `data/library.ts` |
| Images, book covers and the résumé PDF | `public/assets/` |

The shapes of these entries are defined in `data/types.ts`.

### Adding a project

Add an entry to `data/projects.ts`. The fields that matter most:

- `id`: a short slug. It also makes a deep link, so `/#book-folio` opens the Folio book.
- `spine`: the short title printed on the book's spine.
- `sort`: the date as `year.month` (for example `2026.04`). This is what the sorting algorithms sort by.
- `color`: the spine color as a hex value.
- `image`: optional, a path under `public/`, such as `/assets/projects/folio.jpg`.

Keep the *Reading & Writing* entry (`isReadingShelf: true`) last; it always shelves at the end.

## Project layout

```
app/          layout (fonts, metadata), the page that stacks the acts, global styles
components/   one component per act, plus Nav, ExtLink, SmoothScroll and the particle canvas
data/         all site content (see above)
lib/
  choreography.ts    the particle engine: poses, stage plan, pages, foil
  sorting.ts         records each step of insertion, merge, quick and bubble sort for replay
  useReducedMotion.ts
public/assets/       headshot, résumé, project images, book covers
```

A few notes on how the pieces fit together:

- `Choreography.tsx` mounts one fixed `<canvas>` behind the whole page. `lib/choreography.ts` reads section positions from the DOM on every frame and never writes React state, so scrolling stays smooth.
- `SmoothScroll.tsx` wires Lenis into GSAP ScrollTrigger and runs the headline reveal, fade-ups, progress bar and sticky nav. It leaves `#book-…` links to the library.
- `lib/sorting.ts` runs the chosen algorithm ahead of time and records a frame for every comparison and swap. `Library.tsx` plays those frames back on the shelf and reports the comparison count when it finishes.

## Deploy

`next.config.mjs` is set to `output: "export"`, so the build is a plain folder of static files.

- **Vercel:** import the repository. The default settings work.
- **GitHub Pages:** run `npm run build` and publish the `./out` folder. If the site is served from a subpath such as `/personal-website-2.0`, set `basePath` in `next.config.mjs` first.
