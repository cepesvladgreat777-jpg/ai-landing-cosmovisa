import { PAGE_SECTIONS } from '../config/sections';

/** Hero is excluded from page-wide idle locking, including partial visibility. */
export function isHeroVisible() {
  const hero = document.getElementById(PAGE_SECTIONS[0].id);
  return !!hero && hero.getBoundingClientRect().bottom > 0;
}
