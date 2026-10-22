const test = require('node:test');
const assert = require('node:assert/strict');
const { loadTs } = require('./helpers/load-ts.cjs');
const { publicAsset } = loadTs('src/shared/lib/publicAsset.ts');
const { HERO_MEDIA } = loadTs('src/features/hero/config.ts');
const { SERVICES } = loadTs('src/shared/content/services.ts');

test('all public media resolve at both localhost root and the GitHub Pages repository path', () => {
  const assets = [...Object.values(HERO_MEDIA), ...SERVICES.map((service) => service.image)];
  for (const asset of assets) {
    const relative = publicAsset(asset);
    assert.ok(relative.startsWith('./'));
    assert.equal(new URL(relative, 'http://127.0.0.1:5173/').pathname, asset);
    assert.equal(
      new URL(relative, 'https://cepesvladgreat777-jpg.github.io/ai-landing-cosmovisa/').pathname,
      `/ai-landing-cosmovisa${asset}`,
    );
  }
  assert.equal(publicAsset('cards/credit.png'), './cards/credit.png');
  assert.equal(publicAsset('./cards/credit.png'), './cards/credit.png');
});
