// @ts-expect-error This test runs in Vitest's Node process; the app build does not include Node types.
import { readFileSync } from 'node:fs';
// @ts-expect-error This test runs in Vitest's Node process; the app build does not include Node types.
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

declare const process: {
  cwd(): string;
};

const homeCss = readFileSync(join(process.cwd(), 'src/styles/home.css'), 'utf8');

describe('home layout styles', () => {
  it('gives the mobile intro copy extra side breathing room', () => {
    expect(homeCss).toMatch(/@media\s*\(max-width:\s*720px\)\s*\{[\s\S]*\.intro\.wrap\s*\{[^}]*padding-left:\s*34px\b/s);
    expect(homeCss).toMatch(/@media\s*\(max-width:\s*720px\)\s*\{[\s\S]*\.intro\.wrap\s*\{[^}]*padding-right:\s*34px\b/s);
  });

  it('keeps mobile essay thumbnails compact instead of full-width', () => {
    expect(homeCss).toMatch(/@media\s*\(max-width:\s*720px\)\s*\{[\s\S]*\.card\s*\{[^}]*grid-template-columns:\s*92px\s+minmax\(0,\s*1fr\)/s);
    expect(homeCss).toMatch(/@media\s*\(max-width:\s*720px\)\s*\{[\s\S]*\.card-thumb\s*\{[^}]*width:\s*92px\b/s);
  });
});
