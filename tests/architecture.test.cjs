const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('./helpers/load-ts.cjs');

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? sourceFiles(target) : /\.tsx?$/.test(target) ? [target] : [];
  });
}

test('shared modules stay independent and features do not import other features or pages', () => {
  for (const file of sourceFiles(path.join(ROOT, 'src'))) {
    const owner = path.relative(path.join(ROOT, 'src'), file).replaceAll('\\', '/');
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
      const target = path
        .relative(path.join(ROOT, 'src'), path.resolve(path.dirname(file), match[1]))
        .replaceAll('\\', '/');
      if (owner.startsWith('shared/')) assert.ok(target.startsWith('shared/'), `${owner} imports ${target}`);
      if (owner.startsWith('features/')) {
        const feature = owner.split('/')[1];
        assert.ok(
          target.startsWith('shared/') || target.startsWith(`features/${feature}/`),
          `${owner} imports ${target}`,
        );
      }
      if (owner.startsWith('pages/')) assert.ok(!target.startsWith('app/'), `${owner} imports app code`);
    }
  }
});
