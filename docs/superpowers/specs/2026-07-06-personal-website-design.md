# Personal Website — Design Spec

**Author:** Nikita Kolosov (PhD student, Clinical Genomics & Biomedical Informatics)
**Date:** 2026-07-06
**Status:** Approved design → ready for implementation planning

## 1. Purpose

A minimalist personal website that functions as a **scientific portfolio / resume** with a
built-in **writing section** for posting articles about ongoing work. Priorities, in order:

1. Quiet, professional, minimalist aesthetic — content first.
2. Zero-maintenance publishing: write a Markdown file, `git push`, done.
3. Reuse the stack the author already knows (React + TypeScript + Vite + Vitest).

Non-goals: no CMS, no database, no server, no authentication, no comments, no analytics
dashboard. The whole site is static and host-agnostic.

## 2. Aesthetic & Design Language

Direction: **Swiss / Clean minimalist**, light-first, with a dark mode.

- **Typography:**
  - **JetBrains Mono** — headings, nav, UI labels, buttons, metadata, code. The signature.
  - **Inter** — long-form body text (blog posts, About, any running prose) for reading comfort.
  - Fonts self-hosted via `@fontsource/jetbrains-mono` and `@fontsource/inter` (no external
    font requests — matches the pattern already used in the author's `clinvin` project).
- **Color:** near-white background in light mode, near-black in dark mode, high-contrast text,
  a single accent (blue: `#2563eb` light / softer `#5b9dff` dark). Amber/warm toggle icon.
- **Layout:** generous whitespace, centered content column, calm. No decorative imagery
  required; the design carries itself through type and spacing.
- **Motion:** subtle only — hover transitions, smooth theme transition. Respects
  `prefers-reduced-motion`.

### Design tokens (CSS custom properties)
Defined once on `:root` and overridden under `[data-theme="dark"]`. Covers: background,
surface, text-primary, text-muted, border, accent, accent-muted; a spacing scale; font
families; radius. All components consume tokens — no hard-coded colors in components.

## 3. Theme (light/dark)

- Default follows the visitor's OS via `prefers-color-scheme`.
- A toggle in the nav flips it; choice is persisted in `localStorage` and re-applied on load.
- Implemented by setting `data-theme="light|dark"` on `<html>`. A tiny inline script in
  `index.html` sets the attribute **before first paint** to avoid a flash of the wrong theme.
- A `useTheme` hook exposes current theme + a toggle function to the `ThemeToggle` component.

## 4. Information Architecture

Multiple pages with client-side routing (React Router):

| Route             | Page         | Content source                          |
|-------------------|--------------|-----------------------------------------|
| `/`               | Home         | `profile` data                          |
| `/about`          | About        | `content/about.md`                      |
| `/publications`   | Publications | `data/publications.ts` (structured)     |
| `/software`       | Software     | `data/projects.ts` (structured)         |
| `/writing`        | Writing list | Markdown post index (glob)              |
| `/writing/:slug`  | Post         | `content/posts/<slug>.md`               |
| `/cv`             | CV           | `data/cv.ts` (+ optional PDF download)  |
| `*`               | 404          | —                                       |

### Home (minimal index)
Centered nav bar: links flank an **"NK"** brand mark in the middle; **theme toggle** pinned
right. Centered hero: full name, role line, a one-line research summary, three quick links
(Writing / Publications / Software), and a row of profile links (GitHub, Google Scholar,
ORCID, Email). No content feeds on the home page — content lives on its own pages.

## 5. Content Model

### Blog posts — Markdown in repo
- Files live in `content/posts/<slug>.md`, each with YAML frontmatter:
  ```yaml
  ---
  title: Calibrating pathogenicity scores
  date: 2026-04-12
  summary: A per-gene calibration curve turns raw predictor scores into posteriors.
  tags: [genomics, statistics]
  draft: false
  ---
  ```
- The post index is built at bundle time with `import.meta.glob` (eager, raw import);
  frontmatter parsed with `gray-matter`. `draft: true` posts are excluded from the
  index/build. Posts sorted by `date` descending.
- **Rendering:** `react-markdown` with:
  - `remark-gfm` (tables, footnotes, strikethrough)
  - `remark-math` + `rehype-katex` (LaTeX math — expected for genomics/stats content)
  - syntax highlighting for code blocks (`rehype-highlight` or Shiki; final choice at plan time)
  - auto heading anchors (`rehype-slug` + `rehype-autolink-headings`)
- Derived per post: **reading time** (word count / 200 wpm) and formatted date, shown as metadata.
- Prose uses Inter; headings/code/metadata use JetBrains Mono (per §2).

### Publications — structured data
`data/publications.ts` — typed array of records: `{ title, authors, venue, year, doi?, url?,
pdf?, code?, tags? }`. Rendered as a clean reverse-chronological list; the author's own name
is emphasized in the author string. Links open DOI/PDF/code where present.

### Software — structured data
`data/projects.ts` — typed array: `{ name, blurb, stack[], repo?, url?, year }`. Rendered as
a simple list/cards.

### CV — structured data + optional PDF
`data/cv.ts` — sections (education, positions, awards, teaching, etc.) as typed data, rendered
as a clean single page. A "Download PDF" link points at a static `public/cv.pdf` if provided.

### Profile / config
`data/profile.ts` — single source of truth for name, role, one-line summary, and social/profile
links (GitHub, Google Scholar, ORCID, Email). Consumed by Home and the footer.

## 6. Component Structure

- `App` — router + `Layout`.
- `Layout` — `Nav` + `<main>` + `Footer`; owns theme application.
- `Nav` — centered brand + links + `ThemeToggle`; marks the active route.
- `ThemeToggle` — sun/moon button backed by `useTheme`.
- `Footer` — profile/social links from `profile` data.
- `Prose` — wraps `react-markdown` with the configured remark/rehype plugins and prose styles.
- Page components: `Home`, `About`, `Publications`, `Software`, `Writing` (list), `Post`, `CV`,
  `NotFound`.
- List item components: `PostCard`, `PublicationItem`, `ProjectItem`.

Each component consumes design tokens and typed data; each is independently testable.

## 7. Accessibility & SEO

- Semantic landmarks (`nav`, `main`, `article`, `footer`), visible focus states, keyboard-navigable.
- Respects `prefers-color-scheme` and `prefers-reduced-motion`.
- Per-page `<title>` and meta description (via `react-helmet-async` or equivalent), Open Graph
  tags for post sharing.
- Sufficient color contrast in both themes.

## 8. Tech Stack

- **React 18 + TypeScript + Vite** (matches `clinvin`).
- **React Router** for routing.
- **Vitest + React Testing Library** for tests (matches `clinvin`).
- **oxlint** for linting (matches `clinvin`).
- Markdown: `react-markdown`, `gray-matter`, `remark-gfm`, `remark-math`, `rehype-katex`,
  `rehype-slug`, `rehype-autolink-headings`, a syntax highlighter.
- Fonts: `@fontsource/jetbrains-mono`, `@fontsource/inter`.
- **Host-agnostic** static build (`vite build` → `dist/`). Deploy target chosen later
  (GitHub Pages / Vercel / Netlify all work); routing uses a base-path-friendly config.

## 9. Testing Strategy

Test-driven where practical:
- Routing renders the correct page per path; unknown paths render 404.
- Theme toggle flips `data-theme`, persists to `localStorage`, and hydrates from it on load.
- Post index excludes drafts and sorts by date descending.
- A post renders frontmatter title/date, computed reading time, code blocks, and math.
- Publications/projects render all records with correct links.
- Nav marks the active route.

## 10. Directory Layout (proposed)

```
personal_web/
  index.html                 # + pre-paint theme script
  public/                    # cv.pdf, favicon, og image
  src/
    main.tsx, App.tsx
    theme/useTheme.ts, theme/tokens.css
    components/ Nav, ThemeToggle, Footer, Layout, Prose, PostCard, ...
    pages/ Home, About, Publications, Software, Writing, Post, CV, NotFound
    data/ profile.ts, publications.ts, projects.ts, cv.ts
    content/ about.md, posts/*.md
    lib/ posts.ts            # glob + frontmatter + reading time
  vite.config.ts, tsconfig*, package.json
```

## 11. Out of Scope (candidate future work)

Deferred to keep the first build focused: tag filtering / archive views, full-text search,
RSS feed + sitemap generation, View Transitions API, a ⌘K command palette. Easy to add later;
not part of the initial plan.
