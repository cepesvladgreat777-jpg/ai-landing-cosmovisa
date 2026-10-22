interface SectionPosition {
  sectionTops: readonly number[];
  scrollY: number;
  viewportHeight: number;
  scrollHeight: number;
}

export function getCurrentSection({ sectionTops, scrollY, viewportHeight, scrollHeight }: SectionPosition) {
  if (scrollY <= 2 || sectionTops.length === 0) return 0;
  if (scrollY + viewportHeight >= scrollHeight - 2) return sectionTops.length - 1;
  let current = 0;
  sectionTops.forEach((top, index) => {
    if (top <= viewportHeight * 0.35) current = index;
  });
  return current;
}
