import { useEffect, useState } from 'react';
import { PAGE_SECTIONS } from '../../../shared/config/sections';
import { getCurrentSection } from '../lib/getCurrentSection';

export function useSectionNavigation() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setCurrent(
        getCurrentSection({
          sectionTops: PAGE_SECTIONS.map(
            (section) => document.getElementById(section.id)?.getBoundingClientRect().top ?? Infinity,
          ),
          scrollY: window.scrollY,
          viewportHeight: window.innerHeight,
          scrollHeight: document.documentElement.scrollHeight,
        }),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
  return { previous: PAGE_SECTIONS[current - 1], next: PAGE_SECTIONS[current + 1] };
}
