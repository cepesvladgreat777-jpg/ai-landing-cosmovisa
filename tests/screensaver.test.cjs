const test = require('node:test');
const assert = require('node:assert/strict');
const { loadTs } = require('./helpers/load-ts.cjs');

function environment() {
  let now = 0,
    nextId = 0,
    heroVisible = true,
    locked = false;
  const timers = new Map(),
    events = new Map(),
    documentEvents = new Map();
  const document = {
    hidden: false,
    addEventListener(name, fn) {
      documentEvents.set(name, fn);
    },
    removeEventListener(name) {
      documentEvents.delete(name);
    },
  };
  const { createIdleController } = loadTs('src/features/screensaver/model/createIdleController.ts', {
    globals: {
      Date: { now: () => now },
      document,
      window: {
        addEventListener(name, fn) {
          events.set(name, fn);
        },
        removeEventListener(name) {
          events.delete(name);
        },
      },
      setTimeout(fn, delay) {
        const id = ++nextId;
        timers.set(id, { fn, due: now + delay });
        return id;
      },
      clearTimeout(id) {
        timers.delete(id);
      },
    },
  });
  const controller = createIdleController({
    isHeroVisible: () => heroVisible,
    onLock() {
      locked = true;
    },
    onReturnToHero() {
      locked = false;
    },
  });
  return {
    controller,
    document,
    timers,
    events,
    documentEvents,
    get locked() {
      return locked;
    },
    set heroVisible(value) {
      heroVisible = value;
    },
    send(type) {
      events.get(type)?.({ type });
    },
    activate() {
      controller.resume();
      locked = false;
    },
    advance(ms) {
      const end = now + ms;
      for (;;) {
        const next = [...timers.entries()]
          .filter(([, timer]) => timer.due <= end)
          .sort((a, b) => a[1].due - b[1].due)[0];
        if (!next) break;
        now = next[1].due;
        timers.delete(next[0]);
        next[1].fn();
      }
      now = end;
    },
  };
}

test('hero never locks; lower sections wait five idle seconds, then five minutes after activation', () => {
  const env = environment();
  env.advance(600_000);
  assert.equal(env.locked, false);
  env.heroVisible = false;
  env.send('scroll');
  env.advance(4_999);
  assert.equal(env.locked, false);
  env.send('pointermove');
  env.advance(4_999);
  assert.equal(env.locked, false);
  env.advance(1);
  assert.equal(env.locked, true);
  env.send('pointermove');
  assert.equal(env.locked, true, 'Movement cannot dismiss the lock');
  env.activate();
  env.advance(299_999);
  assert.equal(env.locked, false);
  env.advance(1);
  assert.equal(env.locked, true);
  env.activate();
  env.advance(240_000);
  env.send('keydown');
  env.advance(299_999);
  assert.equal(env.locked, false);
  env.advance(1);
  assert.equal(env.locked, true);
  env.heroVisible = true;
  env.send('scroll');
  assert.equal(env.locked, false);
  env.controller.destroy();
  assert.equal(env.timers.size, 0);
  assert.equal(env.events.size, 0);
  assert.equal(env.documentEvents.size, 0);
});

test('hidden-tab inactivity is applied when the page becomes visible', () => {
  const env = environment();
  env.heroVisible = false;
  env.send('scroll');
  env.document.hidden = true;
  env.advance(300_000);
  assert.equal(env.locked, false);
  env.document.hidden = false;
  env.documentEvents.get('visibilitychange')();
  assert.equal(env.locked, true);
  env.controller.destroy();
});

test('page lock restores overflow, inert state and prior focus', () => {
  let focused = 0;
  class Element {
    focus() {
      focused++;
    }
    get isConnected() {
      return true;
    }
  }
  const root = { inert: false },
    previous = new Element(),
    button = new Element();
  const document = {
    body: { style: { overflow: 'auto' } },
    activeElement: previous,
    getElementById: () => root,
  };
  const { lockPage } = loadTs('src/shared/lib/lockPage.ts', { globals: { document, HTMLElement: Element } });
  const unlock = lockPage(button);
  assert.equal(root.inert, true);
  assert.equal(document.body.style.overflow, 'hidden');
  assert.equal(focused, 1);
  unlock();
  assert.equal(root.inert, false);
  assert.equal(document.body.style.overflow, 'auto');
  assert.equal(focused, 2);
});

test('activation unlocks immediately, keeps the outro mounted, then finishes it', () => {
  const state = [],
    refs = [],
    effects = [],
    locks = [];
  let stateIndex = 0,
    refIndex = 0,
    mounted = false,
    callbacks,
    resumed = 0,
    destroyed = 0;
  const react = {
    useState(initial) {
      const i = stateIndex++;
      if (!(i in state)) state[i] = initial;
      return [
        state[i],
        (value) => {
          state[i] = typeof value === 'function' ? value(state[i]) : value;
        },
      ];
    },
    useRef(initial) {
      const i = refIndex++;
      return refs[i] ?? (refs[i] = { current: initial });
    },
    useCallback(fn) {
      return fn;
    },
    useEffect(fn) {
      if (!mounted) effects.push(fn);
    },
  };
  const { useScreensaver } = loadTs('src/features/screensaver/model/useScreensaver.ts', {
    mocks: {
      react,
      '../../../shared/lib/dom': { isHeroVisible: () => false },
      '../../../shared/hooks/usePageLock': {
        usePageLock(value) {
          locks.push(value);
        },
      },
      './createIdleController': {
        createIdleController(options) {
          callbacks = options;
          return {
            resume() {
              resumed++;
            },
            destroy() {
              destroyed++;
            },
          };
        },
      },
    },
  });
  const render = () => {
    stateIndex = refIndex = 0;
    return useScreensaver();
  };
  let view = render();
  const cleanup = effects[0]();
  mounted = true;
  assert.equal(view.phase, 'active');
  callbacks.onLock();
  view = render();
  assert.equal(view.phase, 'waiting');
  assert.equal(locks.at(-1), true);
  view.activate();
  view = render();
  assert.equal(view.phase, 'closing');
  assert.equal(locks.at(-1), false);
  assert.equal(resumed, 1);
  view.finishExit();
  view = render();
  assert.equal(view.phase, 'active');
  cleanup();
  assert.equal(destroyed, 1);
});
