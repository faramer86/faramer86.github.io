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

### Custom domain (nkolosov.bio)

`public/CNAME` holds the domain, so the build serves at the domain root. To make
it resolve:

1. Register `nkolosov.bio` at a registrar.
2. Add DNS records for the apex domain (point it at GitHub Pages):
   - `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - (optional) `CNAME` for `www` → `<user>.github.io`
3. In **Settings → Pages → Custom domain**, enter `nkolosov.bio` and save; once DNS
   verifies, tick **Enforce HTTPS**.

To change or remove the domain later, edit/delete `public/CNAME` (and update the
Pages setting).

### Manual build (any host)
`npm run build` → serve `dist/`. For a subpath, set the base first:
`VITE_BASE=/repo-name/ npm run build`.
