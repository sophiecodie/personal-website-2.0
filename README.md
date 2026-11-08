# Stage and Shelf

Sophie Shih's portfolio and personal site, staged as a ballet in two acts:

1. **Overture**: a particle dancer in pose-tracking style.
2. **Act I · Experience**: roles placed as spike marks on a stage plan.
3. **Entr'acte**: the stage bursts into falling pages.
4. **Contents**: a plain table of contents of every project.
5. **Act II · The Library**: projects as books. Pick a sorting algorithm and they shelve themselves once, then stay put. The last book opens a shelf of favorite books and written works.
6. **Curtain call**: contact, résumé, and a bow.

It's a single static page (`index.html`) with no build step. Particles are hand-written Canvas 2D, and `prefers-reduced-motion` is respected.

## Editing content

All project data lives in the `PROJECTS`, `COVERS` and `WRITING` arrays near the bottom of `index.html`. Experience entries are plain HTML in the `#exp` list. Images live in `assets/`.

## Running locally

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploying

GitHub Pages: Settings → Pages → Deploy from branch → `main` / root. To use a custom domain, add a `CNAME` file.
