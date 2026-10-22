const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require('./helpers/register-ts.cjs');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { ROOT } = require('./helpers/load-ts.cjs');
const baseline = require('./fixtures/landing-contract.json');
const App = require('../src/app/App.tsx').default;
const html = renderToStaticMarkup(React.createElement(App));
const matches = (regex) => [...html.matchAll(regex)].map((match) => match[1]);

// The native hero effect stays mounted but is decorative and aria-hidden.
function withoutNativeWordmark(markup) {
  const start = markup.search(/<div\b[^>]*data-native-wordmark[^>]*>/);
  if (start < 0) return markup;
  const tags = /<div\b[^>]*>|<\/div>/g;
  tags.lastIndex = start;
  let depth = 0;
  for (let match; (match = tags.exec(markup)); ) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return markup.slice(0, start) + markup.slice(tags.lastIndex);
  }
  throw new Error('Unclosed decorative wordmark');
}

test('refactoring preserves page text, section IDs, anchors and service images', () => {
  assert.equal(
    withoutNativeWordmark(html)
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
    baseline.text,
  );
  const ids = matches(/\bid="([^"]+)"/g);
  const links = matches(/\bhref="([^"]+)"/g);
  assert.deepEqual(ids, baseline.ids);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(links, baseline.links);
  for (const link of links)
    if (link.startsWith('#')) assert.ok(ids.includes(link.slice(1)), `Missing anchor: ${link}`);
  assert.deepEqual(
    [...html.matchAll(/<img[^>]+>/g)].map((match) => match[0]),
    baseline.images.map((image) => image.replace('src="/', 'src="./')),
  );
  assert.ok(
    !html.includes('mailto:') && !html.includes('tel:'),
    'Contact placeholders remain non-actionable',
  );
});

test('media sources exist and autoplay background stays separate from scrubbed foreground', () => {
  const { SERVICES } = require('../src/shared/content/services.ts');
  const { HERO_MEDIA } = require('../src/features/hero/config.ts');
  for (const asset of [...SERVICES.map((service) => service.image), ...Object.values(HERO_MEDIA)]) {
    assert.ok(fs.statSync(path.join(ROOT, 'public', asset.slice(1))).size > 0, `Missing asset: ${asset}`);
  }
  const videos = [...html.matchAll(/<video[^>]+>/g)].map((match) => match[0]);
  assert.equal(videos.length, 2);
  assert.ok(videos[0].includes('autoplay') && videos[0].includes('loop'));
  assert.ok(!videos[1].includes('autoplay') && videos[1].includes('hero-sharp.mp4'));
});
