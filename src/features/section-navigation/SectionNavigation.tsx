import { ArrowDown, ArrowUp } from 'lucide-react';
import { useSectionNavigation } from './model/useSectionNavigation';

export function SectionNavigation() {
  const { previous, next } = useSectionNavigation();
  const style =
    'flex h-12 w-10 items-center justify-center rounded-full border border-brand-accent/60 bg-brand-deep/70 text-brand-ink backdrop-blur-md shadow-lg hover:bg-brand-soft hover:text-brand-accent transition-colors';

  return (
    <nav
      aria-label="Переход между блоками"
      className="fixed bottom-6 right-5 md:bottom-10 md:right-14 z-[70] flex flex-col gap-2"
    >
      {previous && (
        <a
          href={`#${previous.id}`}
          aria-label={`Вверх: ${previous.label}`}
          title={`Вверх: ${previous.label}`}
          className={style}
        >
          <ArrowUp className="w-4 h-4" aria-hidden="true" />
        </a>
      )}
      {next && (
        <a
          href={`#${next.id}`}
          aria-label={`Вниз: ${next.label}`}
          title={`Вниз: ${next.label}`}
          className={style}
        >
          <ArrowDown className="w-4 h-4" aria-hidden="true" />
        </a>
      )}
    </nav>
  );
}
