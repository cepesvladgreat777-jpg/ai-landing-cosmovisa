const test = require('node:test');
const assert = require('node:assert/strict');
const { loadTs } = require('./helpers/load-ts.cjs');

function setup(reduced = false) {
  const calls = [];
  let canceled = 0;
  const element = (dataset = {}) => ({
    dataset,
    animate(frames, options) {
      calls.push({ frames, options });
      return {
        cancel() {
          canceled++;
        },
      };
    },
  });
  const letters = Array.from({ length: 9 }, (_, index) => element({ letterIndex: index % 5 }));
  const orbits = [element(), element()];
  const sparks = Array.from({ length: 30 }, (_, index) => element({ sparkIndex: index % 15 }));
  const root = {
    querySelectorAll(selector) {
      return selector === '[data-letter-index]'
        ? letters
        : selector === '.rest-wordmark-ring'
          ? orbits
          : sparks;
    },
  };
  const { createHeroWordmarkController } = loadTs('src/features/hero/lib/createHeroWordmarkController.ts', {
    globals: {
      window: { matchMedia: () => ({ matches: reduced }) },
      getComputedStyle: () => ({ opacity: '0.5', transform: 'matrix(1, 0, 0, 1, 0, 5)' }),
      requestAnimationFrame() {
        throw Error('Wordmark must not own a JS frame loop');
      },
      setTimeout() {
        throw Error('Wordmark must not own timers');
      },
    },
  });
  return {
    controller: createHeroWordmarkController(root),
    calls,
    get canceled() {
      return canceled;
    },
  };
}

test('hero wordmark uses browser-only transforms and opacity, including orbit and particles', () => {
  const env = setup();
  env.controller.setVisible(true);
  assert.equal(env.calls.length, 9);
  env.controller.setVisible(true);
  assert.equal(env.calls.length, 9, 'Unchanged idle state creates no animation work');
  env.controller.setVisible(false);
  assert.equal(env.calls.length, 9 + 9 + 2 + 30);
  assert.equal(env.canceled, 9);
  for (const call of env.calls) {
    assert.equal(call.options.fill, 'both');
    for (const frame of call.frames) {
      assert.ok(Object.keys(frame).every((key) => ['opacity', 'transform', 'offset'].includes(key)));
    }
  }
  env.controller.setVisible(true);
  assert.equal(
    env.calls.at(-1).frames[0].opacity,
    '0.5',
    'Interrupted exits continue from the current visual state',
  );
  env.controller.destroy();
  assert.equal(env.canceled, env.calls.length, 'All native animations are canceled on cleanup');
});

test('reduced motion uses a short fade and skips orbit/particles', () => {
  const env = setup(true);
  env.controller.setVisible(true);
  env.controller.setVisible(false);
  assert.equal(env.calls.length, 18);
  for (const call of env.calls) {
    assert.equal(call.options.duration, 150);
    assert.equal(call.options.delay, 0);
  }
  env.controller.destroy();
});
