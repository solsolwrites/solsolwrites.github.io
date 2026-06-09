# Split Essay Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Load long essay content from per-author JSON files while preserving the existing `Exhibition` shape consumed by the app.

**Architecture:** Keep `/content/exhibition.json` as the metadata file for `intro` and `authors`. Add `/content/essays/{authorId}.json` files containing `Essay[]`, and have `loadExhibition()` fetch those files from `authors` in parallel and merge them into a single `essays` array.

**Tech Stack:** Vite, React, TypeScript, Vitest, public JSON assets served by Vite.

---

### Task 1: Loader Contract Test

**Files:**
- Modify: `src/content.test.ts`

- [ ] Add a Vitest test that stubs `globalThis.fetch`, returns exhibition metadata without essays, returns one essay per author file, and asserts `loadExhibition()` returns merged essays in author order.
- [ ] Run `pnpm test src/content.test.ts` and verify the new test fails because `loadExhibition()` currently only fetches `/content/exhibition.json`.

### Task 2: Content Loader

**Files:**
- Modify: `src/content.ts`

- [ ] Add an `ExhibitionMetadata` type for `intro` and `authors`.
- [ ] Update `loadExhibition()` to fetch metadata, then fetch `/content/essays/${author.id}.json` for each author.
- [ ] Throw a clear error if either metadata or an author essay file fails to load.
- [ ] Return `{ ...metadata, essays: essayFiles.flat() }`.
- [ ] Run `pnpm test src/content.test.ts` and verify it passes.

### Task 3: Content Files

**Files:**
- Modify: `public/content/exhibition.json`
- Create: `public/content/essays/sushell.json`
- Create: `public/content/essays/latte.json`
- Create: `public/content/essays/miya.json`

- [ ] Move each essay object into the JSON file matching its `author` id.
- [ ] Remove the top-level `essays` property from `public/content/exhibition.json`.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
