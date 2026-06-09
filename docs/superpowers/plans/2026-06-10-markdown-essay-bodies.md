# Markdown Essay Bodies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let editors paste essay bodies into `.md` files with real line breaks and markdown emphasis.

**Architecture:** Keep `/content/exhibition.json` as exhibition metadata. Keep `/content/essays/{authorId}.json` as an author manifest of essay metadata, but replace `paragraphs` with a `body` markdown path. `loadExhibition()` fetches each markdown body and normalizes it into renderable paragraphs.

**Tech Stack:** Vite, React, TypeScript, Vitest, static public assets.

---

### Task 1: Markdown Loader Test

**Files:**
- Modify: `src/content.test.ts`

- [ ] Add a failing test proving `loadExhibition()` fetches markdown body files, splits blank-line separated paragraphs, and parses `*italic*` text.
- [ ] Run `pnpm test src/content.test.ts` and verify the test fails before implementation.

### Task 2: Markdown Normalization

**Files:**
- Modify: `src/content.ts`
- Modify: `src/components/Reader.tsx`

- [ ] Add markdown paragraph node types.
- [ ] Add `parseMarkdownBody()` that converts markdown body text into paragraph arrays with text and emphasis nodes.
- [ ] Update `loadExhibition()` to fetch `body` markdown files from each essay metadata object.
- [ ] Update `Reader` to render emphasis nodes as `<em>`.
- [ ] Run `pnpm test src/content.test.ts` and verify the test passes.

### Task 3: Content Conversion

**Files:**
- Modify: `public/content/essays/sushell.json`
- Modify: `public/content/essays/latte.json`
- Modify: `public/content/essays/miya.json`
- Create: `public/content/essays/*/*.md`

- [ ] Convert each existing `paragraphs` array into a markdown file with blank lines between paragraphs.
- [ ] Replace each essay's `paragraphs` field with a `body` path such as `sushell/s1.md`.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
