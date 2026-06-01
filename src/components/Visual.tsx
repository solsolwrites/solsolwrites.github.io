import { AuthorMotif } from './Forest';
import type { Author, Essay } from '../content';

type VisualProps = {
  author: Author;
  essay?: Essay;
  className?: string;
};

export function ExhibitionVisual({ author, essay, className }: VisualProps) {
  const image = essay?.image?.src ? essay.image : author.image;

  if (image?.src) {
    return <img className={className} src={image.src} alt={image.alt || `${author.name} 전시 이미지`} loading="lazy" />;
  }

  return <AuthorMotif className={className} motif={author.motif} />;
}
