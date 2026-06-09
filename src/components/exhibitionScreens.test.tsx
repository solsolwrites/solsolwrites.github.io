import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import exhibition from '../../public/content/exhibition.json';
import latteEssays from '../../public/content/essays/latte.json';
import miyaEssays from '../../public/content/essays/miya.json';
import sushellEssays from '../../public/content/essays/sushell.json';
import type { Essay, Exhibition } from '../content';
import { Home } from './Home';
import { Reader } from './Reader';

type EssayManifestItem = Omit<Essay, 'paragraphs'> & { body: string };

function toEssayFixture(essay: EssayManifestItem): Essay {
  return {
    ...essay,
    paragraphs: [],
  };
}

const content: Exhibition = {
  ...exhibition,
  essays: [...sushellEssays, ...latteEssays, ...miyaEssays].map((essay) => toEssayFixture(essay)),
};

window.scrollTo = vi.fn();

afterEach(() => {
  cleanup();
});

describe('online exhibition screens', () => {
  it('presents the quieter home copy without decorative labels', () => {
    render(<Home exhibition={content} onOpen={vi.fn()} />);

    expect(screen.getByText('서로의 글을 가장 먼저 읽어준 다섯 해')).toBeInTheDocument();
    expect(screen.getByText(/2021년 가을, 양다솔 작가님의 북토크/)).toBeInTheDocument();
    expect(screen.getByText(/서로의 열렬한 독자/)).toBeInTheDocument();

    expect(screen.queryByText('溫')).not.toBeInTheDocument();
    expect(screen.queryByText('故')).not.toBeInTheDocument();
    expect(screen.queryByText('솔솔글방 5년의 기록')).not.toBeInTheDocument();
    expect(screen.queryByText('S C R O L L')).not.toBeInTheDocument();
    expect(screen.queryByText('FIVE PIECES · 다섯 편')).not.toBeInTheDocument();
  });

  it('keeps the reader focused on the essay without exhibition kicker or reading time', () => {
    const essay = content.essays.find((item) => item.author === 'miya') ?? content.essays[0];
    const author = content.authors.find((item) => item.id === essay.author) ?? content.authors[0];

    render(<Reader essay={essay} author={author} prev={null} next={null} onBack={vi.fn()} onNav={vi.fn()} />);

    expect(screen.queryByText(`솔솔글방 졸업전시 · ${author.name}`)).not.toBeInTheDocument();
    expect(screen.queryByText(`읽는 시간 ${essay.read}분`)).not.toBeInTheDocument();
    expect(screen.getByText(essay.date)).toBeInTheDocument();
  });

  it('renders markdown emphasis inside essay paragraphs', () => {
    const essay: Essay = {
      ...content.essays[0],
      paragraphs: [[
        { type: 'text', text: '본문의 ' },
        { type: 'emphasis', text: '기울임' },
        { type: 'text', text: ' 표현' },
      ]],
    };
    const author = content.authors.find((item) => item.id === essay.author) ?? content.authors[0];

    render(<Reader essay={essay} author={author} prev={null} next={null} onBack={vi.fn()} onNav={vi.fn()} />);

    expect(screen.getByText('기울임').tagName).toBe('EM');
  });
});
