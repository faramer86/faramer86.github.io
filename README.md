# Personal Website — Nikita Kolosov

Minimalist scientific portfolio. React + TypeScript + Vite, fully static.
Live at **https://faramer86.github.io**.

## Develop
- `npm install`
- `npm run dev` — local dev server
- `npm test` — run tests
- `npm run lint` — oxlint
- `npm run build` — production build to `dist/`

## Edit content
- `src/data/profile.ts` — name, bio, badges, social links
- `src/data/publications.ts` — publications (sorted by `date`, newest first)
- `src/data/projects.ts` — software / projects
- `src/data/writing.ts` — external posts (Medium / Substack); the Posts page links out
- Replace `public/cv.pdf` with your CV (linked from the Download CV button)

## Deploy
Hosted on GitHub Pages via `.github/workflows/deploy.yml` — every push to `main`
runs tests, builds, and deploys automatically. The workflow auto-detects the base
path and adds a `404.html` so client-side routes work.

Manual build for any host: `npm run build` → serve `dist/`.
