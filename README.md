# Personal Website — Nikita Kolosov

Minimalist scientific portfolio. React + TypeScript + Vite, fully static.

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

## Deploy — GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and deploys on every push to
`main`. It **auto-detects the base path**: `/` for a `<user>.github.io` repo, or
`/<repo>/` for a project repo — no config needed.

One-time setup:

1. Create a **public** GitHub repo:
   - User site (root URL `https://<user>.github.io`): name it `<user>.github.io`.
   - Project repo (subpath `https://<user>.github.io/<repo>/`): any name.
2. Point this project at it and push:
   ```bash
   git remote add origin git@github.com:<user>/<repo>.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. The workflow runs on the push; the live URL appears in the Actions run and under Settings → Pages.

Every later `git push` to `main` redeploys automatically.

### Manual build (any host)
`npm run build` → serve `dist/`. For a subpath, set the base first:
`VITE_BASE=/repo-name/ npm run build`.
