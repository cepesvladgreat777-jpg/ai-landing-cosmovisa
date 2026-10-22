const test = require('node:test');
const assert = require('node:assert/strict');
const { loadTs } = require('./helpers/load-ts.cjs');
const { getCurrentSection } = loadTs('src/features/section-navigation/lib/getCurrentSection.ts');
const { PAGE_SECTIONS, NAV_LINKS } = loadTs('src/shared/config/sections.ts');

test('top, middle and footer resolve the correct neighboring sections', () => {
  const tops = [0, 900, 1800, 2500, 3600, 4300, 5000];
  const current = (scrollY) =>
    getCurrentSection({
      sectionTops: tops.map((top) => top - scrollY),
      scrollY,
      viewportHeight: 900,
      scrollHeight: 5600,
    });
  assert.equal(current(0), 0);
  assert.equal(current(1000), 1);
  assert.equal(current(2600), 3);
  assert.equal(current(4700), 6);
  assert.equal(current(0), 0);
  for (const link of NAV_LINKS) assert.ok(PAGE_SECTIONS.some((section) => `#${section.id}` === link.href));
});
