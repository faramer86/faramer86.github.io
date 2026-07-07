# Personal Website — Nikita Kolosov

Minimalist scientific portfolio + blog. React + TypeScript + Vite, fully static.

## Develop
- `npm install`
- `npm run dev` — local dev server
- `npm test` — run tests
- `npm run lint` — oxlint
- `npm run build` — production build to `dist/`

## Add a blog post
Create `src/content/posts/<slug>.md` with frontmatter:

    ---
    title: My post
    date: 2026-07-01
    summary: One-line summary.
    tags: [genomics]
    draft: false
    ---

    Body in Markdown. Supports GFM, LaTeX math ($...$ / $$...$$), and code
    highlighting.

Set `draft: true` to keep a post out of the build.

## Edit content
- `src/data/profile.ts` — name, role, social links
- `src/data/publications.ts` — publication list
- `src/data/projects.ts` — software list
- Replace `public/cv.pdf` with your real CV (linked from the Download CV button on the home page).

## Deploy
Host-agnostic static build. For a subpath (e.g. GitHub Pages project site):
`VITE_BASE=/repo-name/ npm run build`, then serve `dist/`.
