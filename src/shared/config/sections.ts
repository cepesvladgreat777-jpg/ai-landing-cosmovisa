/** DOM ids, arrow order and header links share this registry. */
export const PAGE_SECTIONS = [
  { id: 'top', label: 'Главный экран' },
  { id: 'about', label: 'О компании' },
  { id: 'achievements', label: 'Достижения' },
  { id: 'services', label: 'Сервисы' },
  { id: 'tariffs', label: 'Тарифы' },
  { id: 'contacts', label: 'Контакты' },
  { id: 'footer', label: 'Подвал страницы' },
] as const;

export type SectionId = (typeof PAGE_SECTIONS)[number]['id'];
const MENU_SECTIONS: readonly SectionId[] = ['about', 'services', 'tariffs', 'contacts'];
export const NAV_LINKS = MENU_SECTIONS.map((id) => {
  const section = PAGE_SECTIONS.find((section) => section.id === id)!;
  return { label: section.label, href: `#${section.id}` };
});
