// @ts-expect-error This test runs in Vitest's Node process; the app build does not include Node types.
import { readFileSync } from 'node:fs';
// @ts-expect-error This test runs in Vitest's Node process; the app build does not include Node types.
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

declare const process: {
  cwd(): string;
};

const readerCss = readFileSync(join(process.cwd(), 'src/styles/reader.css'), 'utf8');

describe('reader layout styles', () => {
  it('keeps the desktop essay aside fixed to the viewport while long essays scroll', () => {
    expect(readerCss).toMatch(/\.reader-aside\s*\{[^}]*position:\s*fixed\b/s);
    expect(readerCss).toMatch(/\.reader-aside\s*\{[^}]*width:\s*380px\b/s);
    expect(readerCss).toMatch(/\.reader-aside\s*\{[^}]*height:\s*100dvh\b/s);
  });

  it('keeps the desktop essay body in the second grid column beside the fixed aside', () => {
    expect(readerCss).toMatch(/\.reader-main\s*\{[^}]*grid-column:\s*2\b/s);
  });

  it('gives desktop essays a wider reading measure and keeps Korean words intact', () => {
    expect(readerCss).toMatch(/\.reader-body\s*\{[^}]*max-width:\s*750px\b/s);
    expect(readerCss).toMatch(/\.reader-body\s+p\.para\s*\{[^}]*word-break:\s*keep-all\b/s);
    expect(readerCss).toMatch(/\.reader-excerpt\s*\{[^}]*word-break:\s*keep-all\b/s);
    expect(readerCss).not.toMatch(/\.reader-excerpt\s*\{[^}]*overflow-wrap:\s*anywhere\b/s);
  });

  it('keeps Korean words intact in essay detail titles', () => {
    expect(readerCss).toMatch(/\.aside-title\s*\{[^}]*word-break:\s*keep-all\b/s);
    expect(readerCss).not.toMatch(/\.aside-title\s*\{[^}]*overflow-wrap:\s*anywhere\b/s);
  });

  it('returns the essay aside to document flow on narrow screens', () => {
    expect(readerCss).toMatch(/@media\s*\(max-width:\s*860px\)\s*\{[\s\S]*\.reader-aside\s*\{[^}]*position:\s*relative\b/s);
    expect(readerCss).toMatch(/@media\s*\(max-width:\s*860px\)\s*\{[\s\S]*\.reader-aside\s*\{[^}]*width:\s*auto\b/s);
    expect(readerCss).toMatch(/@media\s*\(max-width:\s*860px\)\s*\{[\s\S]*\.reader-main\s*\{[^}]*grid-column:\s*1\b/s);
  });

  it('keeps mobile essay text centered with symmetric readable gutters', () => {
    expect(readerCss).toMatch(/@media\s*\(max-width:\s*560px\)\s*\{[\s\S]*\.reader-body\s*\{[^}]*max-width:\s*34rem\b/s);
    expect(readerCss).toMatch(/@media\s*\(max-width:\s*560px\)\s*\{[\s\S]*\.reader-body\s*\{[^}]*padding-left:\s*30px\b/s);
    expect(readerCss).toMatch(/@media\s*\(max-width:\s*560px\)\s*\{[\s\S]*\.reader-body\s*\{[^}]*padding-right:\s*30px\b/s);
    expect(readerCss).toMatch(/@media\s*\(max-width:\s*560px\)\s*\{[\s\S]*\.reader-excerpt\s*\{[^}]*padding-right:\s*18px\b/s);
  });
});
