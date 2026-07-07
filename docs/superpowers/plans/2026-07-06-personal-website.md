# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimalist, static scientific-portfolio website for Nikita Kolosov with an About page, structured Publications / Software / CV pages, and a Markdown-in-repo blog — light/dark themed, JetBrains Mono + Inter typography, no backend.

**Architecture:** A single-page React app (client-side routed) built by Vite to a static bundle. Blog posts are Markdown files under `src/content/posts/` discovered at build time via `import.meta.glob`; frontmatter is parsed by a small in-repo parser (no Buffer/YAML dependency). Publications, projects, CV, and profile are typed data modules. Theme is applied via a `data-theme` attribute on `<html>`, set before first paint and toggled from the nav. All colors/spacing come from CSS custom properties.

**Tech Stack:** React 19 + TypeScript + Vite 8 · React Router 7 · Vitest 4 + React Testing Library · oxlint · react-markdown 10 (remark-gfm, remark-math/rehype-katex, rehype-slug, rehype-autolink-headings, rehype-highlight) · self-hosted fonts via `@fontsource/jetbrains-mono` and `@fontsource/inter`.

**Note on deviation from spec §7/§8:** The spec named `react-helmet-async` for per-page metadata. React 19 supports native document metadata (rendering `<title>`/`<meta>` in a component hoists them to `<head>`), so this plan uses a small `Seo` component instead and drops that dependency. The spec's `data/cv.ts` etc. live under `src/data/`, and content under `src/content/` (so Vite's `import.meta.glob` and TS resolution work without extra config).

---

## File Structure

```
personal_web/
  index.html                     # root + pre-paint theme script
  package.json
  tsconfig.json, tsconfig.node.json
  vite.config.ts                 # react plugin + vitest config
  .oxlintrc.json
  public/
    favicon.svg
  src/
    main.tsx                     # mounts <App/> in <BrowserRouter>
    App.tsx                      # routes + <Layout>
    vite-env.d.ts
    types.ts                     # PostMeta, Post, Publication, Project, CvSection, Profile
    theme/
      tokens.css                 # :root + [data-theme="dark"] custom properties
      global.css                 # reset, base element styles, font imports, prose + code + katex
      useTheme.ts                # getInitialTheme / applyTheme / useTheme hook
      useTheme.test.ts
    lib/
      frontmatter.ts             # parseFrontmatter(raw) -> { data, content }
      frontmatter.test.ts
      readingTime.ts             # readingTime(text) -> { minutes, words }
      readingTime.test.ts
      posts.ts                   # allPosts, getPost(slug) via import.meta.glob
      posts.test.ts
    data/
      profile.ts
      publications.ts
      projects.ts
      cv.ts
    content/
      about.md
      posts/
        welcome.md
        calibrating-pathogenicity-scores.md
    components/
      Layout.tsx
      Nav.tsx        Nav.test.tsx
      ThemeToggle.tsx  ThemeToggle.test.tsx
      Footer.tsx
      Seo.tsx
      Prose.tsx
      PostCard.tsx
      PublicationItem.tsx
      ProjectItem.tsx
    pages/
      Home.tsx        Home.test.tsx
      About.tsx
      Publications.tsx  Publications.test.tsx
      Software.tsx      Software.test.tsx
      Writing.tsx       Writing.test.tsx
      Post.tsx          Post.test.tsx
      CV.tsx            CV.test.tsx
      NotFound.tsx
    test/
      setup.ts                   # jest-dom + localStorage reset
```

Each file has one responsibility: `theme/` owns theming, `lib/` owns the content pipeline (pure, unit-tested), `data/` is static typed content, `components/` are reusable UI, `pages/` compose them per route.

---

## Task 1: Project scaffold + tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `.oxlintrc.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `src/test/setup.ts`, `public/favicon.svg`, `src/smoke.test.ts`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "personal-web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "oxlint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "react-router-dom": "^7.18.1",
    "react-markdown": "^10.1.0",
    "remark-gfm": "^4.0.1",
    "remark-math": "^6.0.0",
    "rehype-katex": "^7.0.1",
    "rehype-slug": "^6.0.0",
    "rehype-autolink-headings": "^7.1.0",
    "rehype-highlight": "^7.0.2",
    "katex": "^0.17.0",
    "@fontsource/jetbrains-mono": "^5.2.8",
    "@fontsource/inter": "^5.2.8"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.7",
    "@vitejs/plugin-react": "^6.0.3",
    "jsdom": "^29.1.1",
    "oxlint": "^1.73.0",
    "typescript": "~6.0.3",
    "vite": "^8.1.3",
    "vitest": "^4.1.10"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create `vite.config.ts`** (Vitest config lives here via the `test` key)

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base can be overridden at build time for subpath hosting (e.g. GitHub Pages):
//   VITE_BASE=/repo/ npm run build
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
```

- [ ] **Step 5: Create `.oxlintrc.json`**

```json
{
  "$schema": "https://raw.githubusercontent.com/oxc-project/oxc/main/npm/oxlint/configuration_schema.json",
  "categories": { "correctness": "error" },
  "env": { "browser": true, "es2022": true }
}
```

- [ ] **Step 6: Create `src/vite-env.d.ts`**

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 7: Create `index.html`** (the inline script applies the theme before first paint — no flash)

```html
<!doctype html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nikita Kolosov</title>
    <script>
      (function () {
        try {
          var stored = localStorage.getItem('theme');
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          var theme = stored || (prefersDark ? 'dark' : 'light');
          document.documentElement.setAttribute('data-theme', theme);
        } catch (e) {}
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#2563eb"/><text x="16" y="22" font-family="monospace" font-size="15" font-weight="700" fill="#fff" text-anchor="middle">NK</text></svg>
```

- [ ] **Step 9: Create `src/App.tsx`** (placeholder, replaced in Task 11)

```tsx
export default function App() {
  return <div>Personal site — scaffold</div>
}
```

- [ ] **Step 10: Create `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './theme/tokens.css'
import './theme/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 11: Create empty CSS files so imports resolve**

Create `src/theme/tokens.css` and `src/theme/global.css` as empty files (filled in Task 2).

- [ ] **Step 12: Create `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})
```

- [ ] **Step 13: Create `src/smoke.test.ts`**

```ts
import { describe, it, expect } from 'vitest'

describe('smoke', () => {
  it('runs the test suite', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 14: Install dependencies**

Run: `npm install`
Expected: installs without peer-dependency errors.

- [ ] **Step 15: Run the smoke test**

Run: `npm test`
Expected: PASS (1 test).

- [ ] **Step 16: Verify the dev server boots and the build compiles**

Run: `npm run build`
Expected: `tsc -b` passes and `vite build` writes `dist/` with no errors.

- [ ] **Step 17: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TS project with vitest and oxlint"
```

---

## Task 2: Design tokens, global styles, fonts

**Files:**
- Modify: `src/theme/tokens.css`, `src/theme/global.css`

- [ ] **Step 1: Fill `src/theme/tokens.css`**

```css
:root {
  --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;

  --space-1: 0.25rem;  --space-2: 0.5rem;  --space-3: 0.75rem;
  --space-4: 1rem;     --space-6: 1.5rem;  --space-8: 2rem;
  --space-12: 3rem;    --space-16: 4rem;   --space-24: 6rem;

  --radius: 9px;
  --maxw: 44rem;
  --transition: 160ms ease;

  /* light theme (default) */
  --bg: #ffffff;
  --surface: #f5f6f8;
  --text: #111214;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --accent: #2563eb;
  --accent-muted: #93b4f5;
  --code-bg: #f3f4f6;
}

[data-theme='dark'] {
  --bg: #0d0f12;
  --surface: #15181d;
  --text: #f0f3f7;
  --text-muted: #8b93a1;
  --border: #232833;
  --accent: #5b9dff;
  --accent-muted: #2f4a73;
  --code-bg: #15181d;
}
```

- [ ] **Step 2: Fill `src/theme/global.css`**

```css
@import '@fontsource/jetbrains-mono/400.css';
@import '@fontsource/jetbrains-mono/500.css';
@import '@fontsource/jetbrains-mono/700.css';
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/700.css';
@import 'katex/dist/katex.min.css';
@import 'highlight.js/styles/github.css';

*, *::before, *::after { box-sizing: border-box; }

html { color-scheme: light dark; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  transition: background var(--transition), color var(--transition);
}

h1, h2, h3, h4, nav, .mono, code, pre, .meta, button {
  font-family: var(--font-mono);
}

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

main { max-width: var(--maxw); margin: 0 auto; padding: var(--space-16) var(--space-6) var(--space-24); }

code { background: var(--code-bg); border-radius: 4px; padding: 0.1em 0.35em; font-size: 0.88em; }
pre { background: var(--code-bg); border: 1px solid var(--border); border-radius: var(--radius); padding: var(--space-4); overflow-x: auto; }
pre code { background: none; padding: 0; }

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
```

- [ ] **Step 3: Add `highlight.js` availability check**

`rehype-highlight` depends on `highlight.js`, which provides the imported `github.css`. Confirm it resolves:
Run: `node -e "require.resolve('highlight.js/styles/github.css')"`
Expected: prints a path (it is a transitive dep of `rehype-highlight`). If it errors, run `npm install highlight.js` and add it to dependencies.

- [ ] **Step 4: Verify build still compiles with CSS imports**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add design tokens, global styles, and self-hosted fonts"
```

---

## Task 3: Shared types

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: Create `src/types.ts`**

```ts
export interface PostMeta {
  slug: string
  title: string
  date: string          // ISO 'YYYY-MM-DD'
  summary: string
  tags: string[]
  draft: boolean
  readingMinutes: number
}

export interface Post extends PostMeta {
  content: string       // markdown body (frontmatter stripped)
}

export interface Publication {
  title: string
  authors: string       // full author string; own name wrapped in **bold** is fine
  venue: string
  year: number
  doi?: string
  url?: string
  pdf?: string
  code?: string
  tags?: string[]
}

export interface Project {
  name: string
  blurb: string
  stack: string[]
  year: number
  repo?: string
  url?: string
}

export interface CvEntry {
  when: string
  what: string
  where?: string
  detail?: string
}

export interface CvSection {
  heading: string
  entries: CvEntry[]
}

export interface ProfileLink {
  label: string
  href: string
}

export interface Profile {
  name: string
  initials: string
  role: string
  affiliation: string
  summary: string
  links: ProfileLink[]
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx tsc -b`
Expected: PASS (no output).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add shared TypeScript types"
```

---

## Task 4: Frontmatter parser (TDD)

**Files:**
- Create: `src/lib/frontmatter.ts`, `src/lib/frontmatter.test.ts`

- [ ] **Step 1: Write the failing test — `src/lib/frontmatter.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { parseFrontmatter } from './frontmatter'

describe('parseFrontmatter', () => {
  it('splits frontmatter data from body content', () => {
    const raw = `---\ntitle: Hello World\ndraft: false\n---\nBody text here.`
    const { data, content } = parseFrontmatter(raw)
    expect(data.title).toBe('Hello World')
    expect(data.draft).toBe(false)
    expect(content.trim()).toBe('Body text here.')
  })

  it('parses booleans, numbers, and quoted strings', () => {
    const raw = `---\ndraft: true\nyear: 2026\nsummary: "A: colon inside"\n---\nx`
    const { data } = parseFrontmatter(raw)
    expect(data.draft).toBe(true)
    expect(data.year).toBe(2026)
    expect(data.summary).toBe('A: colon inside')
  })

  it('parses inline arrays into string arrays', () => {
    const raw = `---\ntags: [genomics, statistics]\n---\nx`
    const { data } = parseFrontmatter(raw)
    expect(data.tags).toEqual(['genomics', 'statistics'])
  })

  it('returns empty data when no frontmatter block is present', () => {
    const { data, content } = parseFrontmatter('Just body, no frontmatter.')
    expect(data).toEqual({})
    expect(content).toBe('Just body, no frontmatter.')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- frontmatter`
Expected: FAIL — cannot find module `./frontmatter`.

- [ ] **Step 3: Implement `src/lib/frontmatter.ts`**

```ts
export interface Frontmatter {
  data: Record<string, unknown>
  content: string
}

function parseScalar(raw: string): unknown {
  const v = raw.trim()
  if (v === 'true') return true
  if (v === 'false') return false
  if (v !== '' && !Number.isNaN(Number(v))) return Number(v)
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1)
  }
  return v
}

function parseValue(raw: string): unknown {
  const v = raw.trim()
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim()
    if (inner === '') return []
    return inner.split(',').map((item) => parseScalar(item))
  }
  return parseScalar(v)
}

export function parseFrontmatter(raw: string): Frontmatter {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
  if (!match) return { data: {}, content: raw }

  const [, block, content] = match
  const data: Record<string, unknown> = {}
  for (const line of block.split(/\r?\n/)) {
    if (line.trim() === '') continue
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    data[key] = parseValue(line.slice(idx + 1))
  }
  return { data, content }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- frontmatter`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add frontmatter parser"
```

---

## Task 5: Reading-time util (TDD)

**Files:**
- Create: `src/lib/readingTime.ts`, `src/lib/readingTime.test.ts`

- [ ] **Step 1: Write the failing test — `src/lib/readingTime.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { readingTime } from './readingTime'

describe('readingTime', () => {
  it('counts words', () => {
    expect(readingTime('one two three').words).toBe(3)
  })

  it('rounds up to at least 1 minute at 200 wpm', () => {
    expect(readingTime('a b c').minutes).toBe(1)
    const long = Array.from({ length: 401 }, () => 'word').join(' ')
    expect(readingTime(long).minutes).toBe(3)
  })

  it('strips markdown syntax from the count', () => {
    const md = '# Title\n\n`code` and [link](https://x.com) and **bold**'
    // words counted: Title, code, and, link, and, bold => 6
    expect(readingTime(md).words).toBe(6)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- readingTime`
Expected: FAIL — cannot find module `./readingTime`.

- [ ] **Step 3: Implement `src/lib/readingTime.ts`**

```ts
export interface ReadingTime {
  words: number
  minutes: number
}

const WPM = 200

export function readingTime(markdown: string): ReadingTime {
  const text = markdown
    .replace(/`{1,3}[^`]*`{1,3}/g, ' ')      // inline/fenced code
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links/images -> label
    .replace(/[#>*_~`-]/g, ' ')               // markdown punctuation
  const words = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / WPM))
  return { words, minutes }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- readingTime`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add reading-time util"
```

---

## Task 6: Sample content + posts index (TDD)

**Files:**
- Create: `src/content/posts/welcome.md`, `src/content/posts/calibrating-pathogenicity-scores.md`, `src/content/about.md`, `src/lib/posts.ts`, `src/lib/posts.test.ts`

- [ ] **Step 1: Create `src/content/posts/welcome.md`**

```markdown
---
title: Welcome
date: 2026-05-01
summary: First note on this site and what I plan to write about.
tags: [meta]
draft: false
---

This is where I'll write about my work in clinical genomics and biomedical
informatics — methods, results, and the occasional dead end.
```

- [ ] **Step 2: Create `src/content/posts/calibrating-pathogenicity-scores.md`**

```markdown
---
title: Calibrating pathogenicity scores
date: 2026-04-12
summary: A per-gene calibration curve turns raw predictor scores into posteriors.
tags: [genomics, statistics]
draft: false
---

Most pathogenicity predictors output an **uncalibrated** score. When you push
`REVEL` through a trio-aware prior, the raw number stops being comparable across
genes.

The posterior is

$$P(\text{pathogenic} \mid s) = \frac{s \cdot \pi}{s \cdot \pi + (1 - s)(1 - \pi)}$$

where $\pi$ is the per-gene prior.

```python
def calibrate(score: float, prior: float) -> float:
    return score * prior / (score * prior + (1 - score) * (1 - prior))
```
```

- [ ] **Step 3: Create `src/content/about.md`**

```markdown
I'm a PhD student in clinical genomics and biomedical informatics. I build
computational methods for interpreting rare-disease variants — turning genomic
signal into clinical answers.

My work focuses on trio-aware variant prioritization and the calibration of
pathogenicity predictors across ancestries.
```

- [ ] **Step 4: Write the failing test — `src/lib/posts.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { allPosts, getPost } from './posts'

describe('posts index', () => {
  it('returns published posts sorted by date descending', () => {
    expect(allPosts.length).toBeGreaterThanOrEqual(2)
    const dates = allPosts.map((p) => p.date)
    const sorted = [...dates].sort((a, b) => (a < b ? 1 : -1))
    expect(dates).toEqual(sorted)
  })

  it('excludes drafts', () => {
    expect(allPosts.every((p) => p.draft === false)).toBe(true)
  })

  it('derives slug and reading time', () => {
    const post = getPost('welcome')
    expect(post).toBeDefined()
    expect(post!.slug).toBe('welcome')
    expect(post!.readingMinutes).toBeGreaterThanOrEqual(1)
    expect(post!.content).toContain('clinical genomics')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getPost('does-not-exist')).toBeUndefined()
  })
})
```

- [ ] **Step 5: Run it to verify it fails**

Run: `npm test -- posts`
Expected: FAIL — cannot find module `./posts`.

- [ ] **Step 6: Implement `src/lib/posts.ts`**

```ts
import type { Post } from '../types'
import { parseFrontmatter } from './frontmatter'
import { readingTime } from './readingTime'

const modules = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function toSlug(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '')
}

function build(): Post[] {
  const posts: Post[] = []
  for (const [path, raw] of Object.entries(modules)) {
    const { data, content } = parseFrontmatter(raw)
    if (data.draft === true) continue
    posts.push({
      slug: toSlug(path),
      title: String(data.title ?? toSlug(path)),
      date: String(data.date ?? ''),
      summary: String(data.summary ?? ''),
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      draft: false,
      readingMinutes: readingTime(content).minutes,
      content,
    })
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export const allPosts: Post[] = build()

export function getPost(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug)
}
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm test -- posts`
Expected: PASS (4 tests).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add sample content and posts index"
```

---

## Task 7: Data modules (profile, publications, projects, cv)

**Files:**
- Create: `src/data/profile.ts`, `src/data/publications.ts`, `src/data/projects.ts`, `src/data/cv.ts`

- [ ] **Step 1: Create `src/data/profile.ts`**

```ts
import type { Profile } from '../types'

export const profile: Profile = {
  name: 'Nikita Kolosov',
  initials: 'NK',
  role: 'PhD student',
  affiliation: 'Clinical Genomics & Biomedical Informatics',
  summary:
    'I build computational methods for interpreting rare-disease variants — turning genomic signal into clinical answers.',
  links: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/' },
    { label: 'ORCID', href: 'https://orcid.org/' },
    { label: 'Email', href: 'mailto:nikolosov86@gmail.com' },
  ],
}
```

- [ ] **Step 2: Create `src/data/publications.ts`** (sample records; author edits later)

```ts
import type { Publication } from '../types'

export const publications: Publication[] = [
  {
    title: 'A trio-aware framework for de novo variant prioritization',
    authors: '**N. Kolosov**, A. Author, B. Author',
    venue: 'Nature Methods',
    year: 2025,
    doi: 'https://doi.org/10.0000/example',
  },
  {
    title: 'Benchmarking pathogenicity predictors across ancestries',
    authors: 'C. Author, **N. Kolosov**, D. Author',
    venue: 'Genome Biology',
    year: 2024,
    doi: 'https://doi.org/10.0000/example2',
  },
]
```

- [ ] **Step 3: Create `src/data/projects.ts`**

```ts
import type { Project } from '../types'

export const projects: Project[] = [
  {
    name: 'ClinVin',
    blurb: 'A variant-interpretation UI for trio and individual samples.',
    stack: ['React', 'TypeScript', 'FastAPI'],
    year: 2026,
    repo: 'https://github.com/',
  },
  {
    name: 'trio-prior',
    blurb: 'Inheritance-aware priors for de novo variant calling.',
    stack: ['Python'],
    year: 2025,
    repo: 'https://github.com/',
  },
]
```

- [ ] **Step 4: Create `src/data/cv.ts`**

```ts
import type { CvSection } from '../types'

export const cvPdf: string | null = null // set to '/cv.pdf' once public/cv.pdf exists

export const cv: CvSection[] = [
  {
    heading: 'Education',
    entries: [
      { when: '2023–', what: 'PhD, Clinical Genomics & Biomedical Informatics', where: '[Institution]' },
    ],
  },
  {
    heading: 'Positions',
    entries: [
      { when: '2023–', what: 'Graduate Researcher', where: '[Lab / Institution]' },
    ],
  },
  {
    heading: 'Awards',
    entries: [{ when: '2024', what: '[Award name]' }],
  },
]
```

- [ ] **Step 5: Verify types compile**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add profile, publications, projects, and cv data"
```

---

## Task 8: Theme hook (TDD)

**Files:**
- Create: `src/theme/useTheme.ts`, `src/theme/useTheme.test.ts`

- [ ] **Step 1: Write the failing test — `src/theme/useTheme.test.ts`**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme, getInitialTheme } from './useTheme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('getInitialTheme', () => {
  it('prefers a stored value over system preference', () => {
    localStorage.setItem('theme', 'dark')
    expect(getInitialTheme()).toBe('dark')
  })

  it('falls back to light when nothing is stored (jsdom has no dark preference)', () => {
    expect(getInitialTheme()).toBe('light')
  })
})

describe('useTheme', () => {
  it('toggles theme, persists it, and reflects it on <html>', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')

    act(() => result.current.toggle())

    expect(result.current.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- useTheme`
Expected: FAIL — cannot find module `./useTheme`.

- [ ] **Step 3: Implement `src/theme/useTheme.ts`**

```ts
import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

export function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  } catch {
    /* ignore */
  }
  return 'light'
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme)
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }, [])

  return { theme, toggle }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- useTheme`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add theme hook"
```

---

## Task 9: ThemeToggle component (TDD)

**Files:**
- Create: `src/components/ThemeToggle.tsx`, `src/components/ThemeToggle.test.tsx`

- [ ] **Step 1: Write the failing test — `src/components/ThemeToggle.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  it('exposes an accessible label and toggles the document theme on click', async () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /theme/i })
    await userEvent.click(button)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    await userEvent.click(button)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- ThemeToggle`
Expected: FAIL — cannot find module `./ThemeToggle`.

- [ ] **Step 3: Implement `src/components/ThemeToggle.tsx`**

```tsx
import { useTheme } from '../theme/useTheme'
import './ThemeToggle.css'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? '☀' : '☾'}
    </button>
  )
}
```

- [ ] **Step 4: Create `src/components/ThemeToggle.css`**

```css
.theme-toggle {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1;
  transition: background var(--transition);
}
.theme-toggle:hover { background: var(--border); }
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- ThemeToggle`
Expected: PASS (1 test).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add ThemeToggle component"
```

---

## Task 10: Nav, Footer, Layout (TDD for Nav)

**Files:**
- Create: `src/components/Nav.tsx`, `src/components/Nav.css`, `src/components/Nav.test.tsx`, `src/components/Footer.tsx`, `src/components/Footer.css`, `src/components/Layout.tsx`, `src/components/Layout.css`

- [ ] **Step 1: Write the failing test — `src/components/Nav.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Nav } from './Nav'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Nav />
    </MemoryRouter>,
  )
}

describe('Nav', () => {
  it('renders the brand initials and all section links', () => {
    renderAt('/')
    expect(screen.getByText('NK')).toBeInTheDocument()
    for (const label of ['About', 'Publications', 'Software', 'Writing', 'CV']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('marks the active route with aria-current', () => {
    renderAt('/publications')
    expect(screen.getByRole('link', { name: 'Publications' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- Nav`
Expected: FAIL — cannot find module `./Nav`.

- [ ] **Step 3: Implement `src/components/Nav.tsx`**

```tsx
import { Link, NavLink } from 'react-router-dom'
import { profile } from '../data/profile'
import { ThemeToggle } from './ThemeToggle'
import './Nav.css'

const links = [
  { to: '/about', label: 'About' },
  { to: '/publications', label: 'Publications' },
  { to: '/software', label: 'Software' },
  { to: '/writing', label: 'Writing' },
  { to: '/cv', label: 'CV' },
]

export function Nav() {
  const mid = Math.ceil(links.length / 2)
  const left = links.slice(0, mid)
  const right = links.slice(mid)

  return (
    <nav className="nav">
      <ul className="nav-group">
        {left.map((l) => (
          <li key={l.to}>
            <NavLink to={l.to}>{l.label}</NavLink>
          </li>
        ))}
      </ul>
      <Link to="/" className="nav-brand">{profile.initials}</Link>
      <ul className="nav-group">
        {right.map((l) => (
          <li key={l.to}>
            <NavLink to={l.to}>{l.label}</NavLink>
          </li>
        ))}
      </ul>
      <div className="nav-toggle"><ThemeToggle /></div>
    </nav>
  )
}
```

> `react-router-dom`'s `NavLink` sets `aria-current="page"` on the active route automatically, satisfying the test.

- [ ] **Step 4: Create `src/components/Nav.css`**

```css
.nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
  padding: var(--space-6) var(--space-6) 0;
  font-size: 0.85rem;
}
.nav-group { display: flex; gap: var(--space-6); list-style: none; margin: 0; padding: 0; }
.nav-group a { color: var(--text-muted); }
.nav-group a:hover, .nav-group a[aria-current='page'] { color: var(--text); text-decoration: none; }
.nav-brand { font-weight: 700; color: var(--text); }
.nav-toggle { position: absolute; right: var(--space-6); top: var(--space-4); }

@media (max-width: 640px) {
  .nav { flex-wrap: wrap; gap: var(--space-3); }
  .nav-toggle { position: static; }
}
```

- [ ] **Step 5: Implement `src/components/Footer.tsx`**

```tsx
import { profile } from '../data/profile'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <ul className="footer-links">
        {profile.links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
          </li>
        ))}
      </ul>
      <p className="footer-copy">© {new Date().getFullYear()} {profile.name}</p>
    </footer>
  )
}
```

- [ ] **Step 6: Create `src/components/Footer.css`**

```css
.footer {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: var(--space-12) var(--space-6);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-muted);
}
.footer-links { display: flex; gap: var(--space-4); list-style: none; margin: 0; padding: 0; }
.footer-copy { margin: 0; }
```

- [ ] **Step 7: Implement `src/components/Layout.tsx`**

```tsx
import type { ReactNode } from 'react'
import { Nav } from './Nav'
import { Footer } from './Footer'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 8: Create `src/components/Layout.css`** (empty placeholder for future layout tweaks)

Create an empty `src/components/Layout.css`. (Kept so a later layout change has a home without touching component logic.)

- [ ] **Step 9: Run tests to verify they pass**

Run: `npm test -- Nav`
Expected: PASS (2 tests).

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add Nav, Footer, and Layout"
```

---

## Task 11: Router wiring + Seo + Home page (TDD)

**Files:**
- Create: `src/components/Seo.tsx`, `src/pages/Home.tsx`, `src/pages/Home.css`, `src/pages/Home.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create `src/components/Seo.tsx`** (React 19 native metadata)

```tsx
export function Seo({ title, description }: { title: string; description?: string }) {
  return (
    <>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
    </>
  )
}
```

- [ ] **Step 2: Write the failing test — `src/pages/Home.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

describe('Home', () => {
  it('renders name, role, summary, and quick links', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nikita Kolosov')
    expect(screen.getByText(/PhD student/)).toBeInTheDocument()
    expect(screen.getByText(/rare-disease variants/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Writing/ })).toHaveAttribute('href', '/writing')
    expect(screen.getByRole('link', { name: /Publications/ })).toHaveAttribute('href', '/publications')
    expect(screen.getByRole('link', { name: /Software/ })).toHaveAttribute('href', '/software')
  })
})
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npm test -- Home`
Expected: FAIL — cannot find module `./Home`.

- [ ] **Step 4: Implement `src/pages/Home.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import { Seo } from '../components/Seo'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <Seo title={profile.name} description={profile.summary} />
      <h1 className="home-name">{profile.name}<span className="home-dot">.</span></h1>
      <p className="home-role">
        {profile.role} <span>· {profile.affiliation}</span>
      </p>
      <p className="home-summary">{profile.summary}</p>
      <div className="home-quick">
        <Link to="/writing">Writing →</Link>
        <Link to="/publications">Publications →</Link>
        <Link to="/software">Software →</Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create `src/pages/Home.css`**

```css
.home { text-align: center; padding-top: var(--space-16); }
.home-name { font-size: clamp(2rem, 6vw, 2.6rem); font-weight: 700; letter-spacing: -0.03em; margin: 0 0 var(--space-2); }
.home-dot { color: var(--accent); }
.home-role { font-family: var(--font-mono); font-size: 0.95rem; margin: 0 0 var(--space-6); }
.home-role span { color: var(--text-muted); }
.home-summary { max-width: 40ch; margin: 0 auto var(--space-8); color: var(--text-muted); }
.home-quick { display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap; }
.home-quick a {
  font-family: var(--font-mono); font-size: 0.85rem; color: var(--text);
  border: 1px solid var(--border); border-radius: var(--radius);
  padding: var(--space-3) var(--space-4);
}
.home-quick a:hover { text-decoration: none; border-color: var(--accent); }
```

- [ ] **Step 6: Replace `src/App.tsx` with the router**

```tsx
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Publications from './pages/Publications'
import Software from './pages/Software'
import Writing from './pages/Writing'
import Post from './pages/Post'
import CV from './pages/CV'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/software" element={<Software />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/writing/:slug" element={<Post />} />
        <Route path="/cv" element={<CV />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
```

> This import list references pages built in Tasks 12–17. Create minimal stubs now so the app compiles, then flesh each out in its task. Stub example for each missing page (`About`, `Publications`, `Software`, `Writing`, `Post`, `CV`, `NotFound`): `export default function X() { return null }` in its own file. Each subsequent task replaces the stub with the real implementation and its test.

- [ ] **Step 7: Create stub pages** so the app compiles

Create each of these files with a default-export component returning `null`:
`src/pages/About.tsx`, `src/pages/Publications.tsx`, `src/pages/Software.tsx`, `src/pages/Writing.tsx`, `src/pages/Post.tsx`, `src/pages/CV.tsx`, `src/pages/NotFound.tsx`.

Example (`src/pages/About.tsx`): `export default function About() { return null }`

- [ ] **Step 8: Run Home tests + full build**

Run: `npm test -- Home`
Expected: PASS (1 test).
Run: `npm run build`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: wire router, add Seo and Home page"
```

---

## Task 12: Prose renderer + About page

**Files:**
- Create: `src/components/Prose.tsx`, `src/components/Prose.css`
- Modify: `src/pages/About.tsx` (replace stub)

- [ ] **Step 1: Implement `src/components/Prose.tsx`**

```tsx
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import './Prose.css'

export function Prose({ children }: { children: string }) {
  return (
    <div className="prose">
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeKatex,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          rehypeHighlight,
        ]}
      >
        {children}
      </Markdown>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/Prose.css`**

```css
.prose { font-family: var(--font-sans); line-height: 1.75; }
.prose h1, .prose h2, .prose h3 { line-height: 1.25; margin-top: var(--space-8); }
.prose h2 { font-size: 1.3rem; }
.prose h3 { font-size: 1.1rem; }
.prose p, .prose ul, .prose ol { margin: var(--space-4) 0; }
.prose a { text-decoration: underline; }
.prose img { max-width: 100%; border-radius: var(--radius); }
.prose blockquote { margin: var(--space-4) 0; padding-left: var(--space-4); border-left: 3px solid var(--border); color: var(--text-muted); }
.prose table { border-collapse: collapse; width: 100%; font-size: 0.9rem; }
.prose th, .prose td { border: 1px solid var(--border); padding: var(--space-2) var(--space-3); text-align: left; }
```

- [ ] **Step 3: Replace `src/pages/About.tsx`**

```tsx
import aboutRaw from '../content/about.md?raw'
import { Prose } from '../components/Prose'
import { Seo } from '../components/Seo'

export default function About() {
  return (
    <article>
      <Seo title="About · Nikita Kolosov" />
      <h1>About</h1>
      <Prose>{aboutRaw}</Prose>
    </article>
  )
}
```

- [ ] **Step 4: Verify build + existing tests**

Run: `npm run build`
Expected: PASS (confirms `?raw` import and markdown plugin chain compile).
Run: `npm test`
Expected: PASS (all suites so far).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Prose renderer and About page"
```

---

## Task 13: Publications page (TDD)

**Files:**
- Create: `src/components/PublicationItem.tsx`, `src/components/PublicationItem.css`, `src/pages/Publications.test.tsx`
- Modify: `src/pages/Publications.tsx` (replace stub)

- [ ] **Step 1: Write the failing test — `src/pages/Publications.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Publications from './Publications'

describe('Publications', () => {
  it('lists every publication with its venue and a DOI link', () => {
    render(<Publications />)
    expect(screen.getByText(/trio-aware framework/)).toBeInTheDocument()
    expect(screen.getByText(/Benchmarking pathogenicity predictors/)).toBeInTheDocument()
    const dois = screen.getAllByRole('link', { name: /doi/i })
    expect(dois.length).toBeGreaterThanOrEqual(2)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- Publications`
Expected: FAIL — stub renders null.

- [ ] **Step 3: Implement `src/components/PublicationItem.tsx`**

```tsx
import type { Publication } from '../types'
import './PublicationItem.css'

function Authors({ authors }: { authors: string }) {
  // render **bold** segments as <strong> (author's own name)
  const parts = authors.split(/(\*\*[^*]+\*\*)/g)
  return (
    <span className="pub-authors">
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </span>
  )
}

export function PublicationItem({ pub }: { pub: Publication }) {
  const links: Array<[string, string | undefined]> = [
    ['DOI', pub.doi],
    ['PDF', pub.pdf],
    ['Code', pub.code],
    ['Link', pub.url],
  ]
  return (
    <li className="pub">
      <div className="pub-year">{pub.year}</div>
      <div className="pub-body">
        <h3 className="pub-title">{pub.title}</h3>
        <Authors authors={pub.authors} />
        <div className="pub-venue">{pub.venue}</div>
        <div className="pub-links">
          {links
            .filter(([, href]) => href)
            .map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>
            ))}
        </div>
      </div>
    </li>
  )
}
```

- [ ] **Step 4: Create `src/components/PublicationItem.css`**

```css
.pub { display: flex; gap: var(--space-4); padding: var(--space-6) 0; border-top: 1px solid var(--border); list-style: none; }
.pub-year { font-family: var(--font-mono); color: var(--text-muted); flex: 0 0 3.5rem; }
.pub-title { margin: 0 0 var(--space-2); font-size: 1.05rem; }
.pub-authors { font-size: 0.9rem; }
.pub-authors strong { color: var(--text); }
.pub-venue { font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent); margin-top: var(--space-1); }
.pub-links { display: flex; gap: var(--space-3); margin-top: var(--space-2); font-family: var(--font-mono); font-size: 0.8rem; }
```

- [ ] **Step 5: Replace `src/pages/Publications.tsx`**

```tsx
import { publications } from '../data/publications'
import { PublicationItem } from '../components/PublicationItem'
import { Seo } from '../components/Seo'

export default function Publications() {
  const sorted = [...publications].sort((a, b) => b.year - a.year)
  return (
    <section>
      <Seo title="Publications · Nikita Kolosov" />
      <h1>Publications</h1>
      <ul style={{ padding: 0, margin: 0 }}>
        {sorted.map((pub) => (
          <PublicationItem key={pub.title} pub={pub} />
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- Publications`
Expected: PASS (1 test).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Publications page"
```

---

## Task 14: Software page (TDD)

**Files:**
- Create: `src/components/ProjectItem.tsx`, `src/components/ProjectItem.css`, `src/pages/Software.test.tsx`
- Modify: `src/pages/Software.tsx` (replace stub)

- [ ] **Step 1: Write the failing test — `src/pages/Software.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Software from './Software'

describe('Software', () => {
  it('lists projects with their stack and a repo link', () => {
    render(<Software />)
    expect(screen.getByText('ClinVin')).toBeInTheDocument()
    expect(screen.getByText('trio-prior')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /repo/i }).length).toBeGreaterThanOrEqual(2)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- Software`
Expected: FAIL — stub renders null.

- [ ] **Step 3: Implement `src/components/ProjectItem.tsx`**

```tsx
import type { Project } from '../types'
import './ProjectItem.css'

export function ProjectItem({ project }: { project: Project }) {
  return (
    <li className="proj">
      <div className="proj-head">
        <h3 className="proj-name">{project.name}</h3>
        <span className="proj-year">{project.year}</span>
      </div>
      <p className="proj-blurb">{project.blurb}</p>
      <div className="proj-stack">
        {project.stack.map((s) => (
          <span key={s} className="proj-tag">{s}</span>
        ))}
      </div>
      <div className="proj-links">
        {project.repo && <a href={project.repo} target="_blank" rel="noreferrer">Repo</a>}
        {project.url && <a href={project.url} target="_blank" rel="noreferrer">Link</a>}
      </div>
    </li>
  )
}
```

- [ ] **Step 4: Create `src/components/ProjectItem.css`**

```css
.proj { padding: var(--space-6) 0; border-top: 1px solid var(--border); list-style: none; }
.proj-head { display: flex; align-items: baseline; justify-content: space-between; }
.proj-name { margin: 0; font-size: 1.05rem; }
.proj-year { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); }
.proj-blurb { margin: var(--space-2) 0; color: var(--text-muted); }
.proj-stack { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.proj-tag { font-family: var(--font-mono); font-size: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 0.1rem 0.5rem; }
.proj-links { display: flex; gap: var(--space-3); margin-top: var(--space-3); font-family: var(--font-mono); font-size: 0.8rem; }
```

- [ ] **Step 5: Replace `src/pages/Software.tsx`**

```tsx
import { projects } from '../data/projects'
import { ProjectItem } from '../components/ProjectItem'
import { Seo } from '../components/Seo'

export default function Software() {
  const sorted = [...projects].sort((a, b) => b.year - a.year)
  return (
    <section>
      <Seo title="Software · Nikita Kolosov" />
      <h1>Software</h1>
      <ul style={{ padding: 0, margin: 0 }}>
        {sorted.map((p) => (
          <ProjectItem key={p.name} project={p} />
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- Software`
Expected: PASS (1 test).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Software page"
```

---

## Task 15: Writing list page (TDD)

**Files:**
- Create: `src/components/PostCard.tsx`, `src/components/PostCard.css`, `src/pages/Writing.test.tsx`
- Modify: `src/pages/Writing.tsx` (replace stub)

- [ ] **Step 1: Write the failing test — `src/pages/Writing.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Writing from './Writing'

describe('Writing', () => {
  it('lists posts with titles linking to their slug and shows reading time', () => {
    render(
      <MemoryRouter>
        <Writing />
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: /Calibrating pathogenicity scores/ })
    expect(link).toHaveAttribute('href', '/writing/calibrating-pathogenicity-scores')
    expect(screen.getAllByText(/min read/).length).toBeGreaterThanOrEqual(2)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- Writing`
Expected: FAIL — stub renders null.

- [ ] **Step 3: Implement `src/components/PostCard.tsx`**

```tsx
import { Link } from 'react-router-dom'
import type { PostMeta } from '../types'
import './PostCard.css'

function formatDate(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <li className="post-card">
      <h3 className="post-card-title">
        <Link to={`/writing/${post.slug}`}>{post.title}</Link>
      </h3>
      <div className="post-card-meta">
        {formatDate(post.date)} · {post.readingMinutes} min read
      </div>
      <p className="post-card-summary">{post.summary}</p>
    </li>
  )
}
```

- [ ] **Step 4: Create `src/components/PostCard.css`**

```css
.post-card { padding: var(--space-6) 0; border-top: 1px solid var(--border); list-style: none; }
.post-card-title { margin: 0 0 var(--space-1); font-size: 1.1rem; }
.post-card-title a { color: var(--text); }
.post-card-title a:hover { color: var(--accent); text-decoration: none; }
.post-card-meta { font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); }
.post-card-summary { margin: var(--space-2) 0 0; color: var(--text-muted); }
```

- [ ] **Step 5: Replace `src/pages/Writing.tsx`**

```tsx
import { allPosts } from '../lib/posts'
import { PostCard } from '../components/PostCard'
import { Seo } from '../components/Seo'

export default function Writing() {
  return (
    <section>
      <Seo title="Writing · Nikita Kolosov" description="Notes on clinical genomics and biomedical informatics." />
      <h1>Writing</h1>
      <ul style={{ padding: 0, margin: 0 }}>
        {allPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- Writing`
Expected: PASS (1 test).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Writing list page"
```

---

## Task 16: Post page (TDD)

**Files:**
- Create: `src/pages/Post.css`, `src/pages/Post.test.tsx`
- Modify: `src/pages/Post.tsx` (replace stub)

- [ ] **Step 1: Write the failing test — `src/pages/Post.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Post from './Post'

function renderPost(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/writing/${slug}`]}>
      <Routes>
        <Route path="/writing/:slug" element={<Post />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Post', () => {
  it('renders the post title, metadata, and body', () => {
    renderPost('calibrating-pathogenicity-scores')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Calibrating pathogenicity scores',
    )
    expect(screen.getByText(/min read/)).toBeInTheDocument()
    expect(screen.getByText(/uncalibrated/)).toBeInTheDocument()
  })

  it('shows a not-found message for an unknown slug', () => {
    renderPost('nope')
    expect(screen.getByText(/not found/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- Post`
Expected: FAIL — stub renders null.

- [ ] **Step 3: Replace `src/pages/Post.tsx`**

```tsx
import { Link, useParams } from 'react-router-dom'
import { getPost } from '../lib/posts'
import { Prose } from '../components/Prose'
import { Seo } from '../components/Seo'
import './Post.css'

function formatDate(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function Post() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined

  if (!post) {
    return (
      <section>
        <Seo title="Not found · Nikita Kolosov" />
        <h1>Post not found</h1>
        <p><Link to="/writing">← Back to writing</Link></p>
      </section>
    )
  }

  return (
    <article className="post">
      <Seo title={`${post.title} · Nikita Kolosov`} description={post.summary} />
      <h1 className="post-title">{post.title}</h1>
      <div className="post-meta">
        {formatDate(post.date)} · {post.readingMinutes} min read
      </div>
      <Prose>{post.content}</Prose>
      <p className="post-back"><Link to="/writing">← Back to writing</Link></p>
    </article>
  )
}
```

- [ ] **Step 4: Create `src/pages/Post.css`**

```css
.post-title { margin-bottom: var(--space-2); }
.post-meta { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); margin-bottom: var(--space-8); }
.post-back { margin-top: var(--space-12); font-family: var(--font-mono); font-size: 0.85rem; }
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- Post`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Post page"
```

---

## Task 17: CV page + NotFound (TDD for CV)

**Files:**
- Create: `src/pages/CV.css`, `src/pages/CV.test.tsx`
- Modify: `src/pages/CV.tsx` (replace stub), `src/pages/NotFound.tsx` (replace stub)

- [ ] **Step 1: Write the failing test — `src/pages/CV.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CV from './CV'

describe('CV', () => {
  it('renders each section heading and its entries', () => {
    render(<CV />)
    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Positions' })).toBeInTheDocument()
    expect(screen.getByText(/PhD, Clinical Genomics/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- CV`
Expected: FAIL — stub renders null.

- [ ] **Step 3: Replace `src/pages/CV.tsx`**

```tsx
import { cv, cvPdf } from '../data/cv'
import { Seo } from '../components/Seo'
import './CV.css'

export default function CV() {
  return (
    <section>
      <Seo title="CV · Nikita Kolosov" />
      <div className="cv-head">
        <h1>CV</h1>
        {cvPdf && <a className="cv-pdf" href={cvPdf} download>Download PDF</a>}
      </div>
      {cv.map((section) => (
        <div key={section.heading} className="cv-section">
          <h2>{section.heading}</h2>
          {section.entries.map((e, i) => (
            <div key={i} className="cv-entry">
              <div className="cv-when">{e.when}</div>
              <div className="cv-what">
                <strong>{e.what}</strong>
                {e.where && <span className="cv-where"> · {e.where}</span>}
                {e.detail && <div className="cv-detail">{e.detail}</div>}
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}
```

- [ ] **Step 4: Create `src/pages/CV.css`**

```css
.cv-head { display: flex; align-items: baseline; justify-content: space-between; }
.cv-pdf { font-family: var(--font-mono); font-size: 0.8rem; }
.cv-section { margin-top: var(--space-8); }
.cv-section h2 { font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: var(--space-2); }
.cv-entry { display: flex; gap: var(--space-4); padding: var(--space-3) 0; }
.cv-when { font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted); flex: 0 0 5rem; }
.cv-where { color: var(--text-muted); }
.cv-detail { color: var(--text-muted); font-size: 0.9rem; margin-top: var(--space-1); }
```

- [ ] **Step 5: Replace `src/pages/NotFound.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'

export default function NotFound() {
  return (
    <section>
      <Seo title="Not found · Nikita Kolosov" />
      <h1>404</h1>
      <p>That page doesn’t exist.</p>
      <p><Link to="/">← Home</Link></p>
    </section>
  )
}
```

- [ ] **Step 6: Run CV tests + full suite**

Run: `npm test -- CV`
Expected: PASS (1 test).
Run: `npm test`
Expected: PASS (all suites).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add CV and NotFound pages"
```

---

## Task 18: Final verification, lint, README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create `README.md`**

```markdown
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
- `src/data/cv.ts` — CV sections (+ set `cvPdf = '/cv.pdf'` and add `public/cv.pdf`)
- `src/content/about.md` — About page

## Deploy
Host-agnostic static build. For a subpath (e.g. GitHub Pages project site):
`VITE_BASE=/repo-name/ npm run build`, then serve `dist/`.
```

- [ ] **Step 2: Run the linter and fix any correctness errors**

Run: `npm run lint`
Expected: no errors. Fix any reported.

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: PASS (all suites).

- [ ] **Step 4: Run the production build**

Run: `npm run build`
Expected: `tsc -b` and `vite build` both succeed; `dist/` produced.

- [ ] **Step 5: Manual smoke check in a real browser**

Run: `npm run dev`, open the printed URL, and verify:
- Home renders centered; nav toggle switches light/dark and the choice survives a refresh.
- `/writing` lists posts; a post renders math and a highlighted code block.
- `/publications`, `/software`, `/cv`, and a bad URL (404) all render.
Then stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "docs: add README and finalize build"
```

---

## Self-Review Notes (coverage vs spec)

- Spec §2 typography/tokens → Tasks 2, 9–17 (all components consume tokens; mono headings + Inter prose).
- Spec §3 theme (pre-paint, persisted, hook) → `index.html` script (Task 1), Task 8, Task 9.
- Spec §4 IA / routes → Task 11 router; every route has a page task (12–17).
- Spec §5 content model: Markdown posts + frontmatter + math + code + reading time → Tasks 4, 5, 6, 12, 16; publications/projects/cv/profile → Task 7, pages 13/14/17.
- Spec §6 components → Tasks 9–17 (one component per file).
- Spec §7 a11y/SEO → focus styles + reduced-motion (Task 2), `aria-current` nav (Task 10), `Seo` metadata (Task 11+), semantic landmarks throughout.
- Spec §8 stack → Task 1 (React 19 substituted for the deprecated helmet dep, documented above).
- Spec §9 testing → each behavior has a test task (theme, posts index/drafts/sort, post render, publications/projects render, nav active route).
- Spec §11 out-of-scope items intentionally omitted.
```
