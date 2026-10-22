const test = require('node:test');
const assert = require('node:assert/strict');
const { loadTs } = require('./helpers/load-ts.cjs');

test('video poses, pending seeks, first-frame response, hover, exits, touch, smoothing and cleanup', () => {
  const scrub = loadTs('src/features/hero/lib/scrub.ts');
  const { left, center, right } = loadTs('src/features/hero/config.ts').HERO_SCRUB_RANGE;
  for (const width of [320, 375, 390, 1425, 1440, 1920]) {
    assert.equal(scrub.scrubTimeFromX(0, width), left);
    assert.equal(scrub.scrubTimeFromX((width - 1) / 2, width), center);
    assert.equal(scrub.scrubTimeFromX(width - 1, width), right);
    assert.equal(scrub.scrubTimeFromX(-20, width), left);
    assert.equal(scrub.scrubTimeFromX(width + 20, width), right);
    let previous = left;
    for (let x = 0; x < width; x++) {
      const time = scrub.scrubTimeFromX(x, width);
      assert.ok(time >= previous && time <= right);
      previous = time;
    }
  }

  function settle(hz) {
    let time = left;
    for (let i = 0; i < hz; i++) time = scrub.smoothScrubTime(time, right, 1000 / hz);
    return time;
  }
  assert.ok(Math.abs(settle(60) - settle(144)) < 1e-10);
  assert.ok(scrub.smoothScrubTime(left, right, 1000 / 60) - left < (right - left) * 0.1);
  assert.ok(scrub.smoothScrubTime(left, right, 10000) < left + (right - left) * 0.2);

  const windowListeners = new Map();
  const videoListeners = new Map();
  const heroListeners = new Map();
  let heroBounds = { left: 0, right: 1425, top: 0, bottom: 900 };
  let videoBounds = { left: 500, right: 925, top: 67, bottom: 832 };
  const hero = {
    getBoundingClientRect() {
      return heroBounds;
    },
    addEventListener(type, handler) {
      heroListeners.set(type, handler);
    },
    removeEventListener(type) {
      heroListeners.delete(type);
    },
  };
  const raf = new Map();
  const seekTimes = [];
  let nextRafId = 0;
  let clock = 0;
  let mediaTime = 0;
  let paused = false;
  const video = {
    duration: 10.005,
    readyState: 4,
    seeking: false,
    getBoundingClientRect() {
      return videoBounds;
    },
    pause() {
      paused = true;
    },
    get currentTime() {
      return mediaTime;
    },
    set currentTime(time) {
      assert.ok(time >= left && time <= right, `Seek escaped active turn: ${time}`);
      mediaTime = time;
      video.seeking = true;
      seekTimes.push(time);
    },
    addEventListener(type, handler) {
      videoListeners.set(type, handler);
    },
    removeEventListener(type) {
      videoListeners.delete(type);
    },
  };
  const fakeWindow = {
    innerWidth: 1440,
    innerHeight: 900,
    addEventListener(type, handler, options) {
      windowListeners.set(type, { handler, options });
    },
    removeEventListener(type) {
      windowListeners.delete(type);
    },
  };
  const fakeDocument = { documentElement: { clientWidth: 1425 } };
  const states = [false, false];
  const stateChanges = [];
  const { createHeroVideoController } = loadTs('src/features/hero/lib/createHeroVideoController.ts', {
    globals: {
      window: fakeWindow,
      document: fakeDocument,
      requestAnimationFrame(callback) {
        const id = ++nextRafId;
        raf.set(id, callback);
        return id;
      },
      cancelAnimationFrame(id) {
        raf.delete(id);
      },
    },
  });
  const cleanup = createHeroVideoController({
    hero,
    video,
    onReady() {
      states[0] = true;
    },
    onRestChange(value) {
      states[1] = value;
      stateChanges.push([1, value]);
    },
  });
  function completeSeek() {
    if (!video.seeking) return;
    video.seeking = false;
    videoListeners.get('seeked')?.();
  }
  function step(count, finishSeek = true) {
    for (let i = 0; i < count; i++) {
      clock += 1000 / 60;
      const callbacks = [...raf.values()];
      raf.clear();
      callbacks.forEach((callback) => callback(clock));
      if (finishSeek) completeSeek();
    }
  }
  function send(type, event) {
    const listener = windowListeners.get(type);
    assert.ok(listener?.options.capture && listener.options.passive);
    listener.handler(event);
  }
  function expectPose(time) {
    assert.ok(Math.abs(mediaTime - time) < 0.006, `${mediaTime} != ${time}`);
  }

  completeSeek();
  assert.ok(paused);
  expectPose(center);
  send('pointermove', { clientX: 1424, clientY: 1 });
  step(180);
  expectPose(right);
  step(300);
  expectPose(right); // Holding the edge never reaches the clip's return-to-center tail.
  send('pointermove', { clientX: 0, clientY: 899 });
  step(180);
  expectPose(left);
  send('pointermove', { clientX: 712, clientY: 450 });
  step(180);
  expectPose(center);
  send('pointerout', { clientX: 1440, clientY: 450, relatedTarget: null });
  step(180);
  expectPose(right);
  send('pointerout', { clientX: -1, clientY: 450, relatedTarget: null });
  step(180);
  expectPose(left);

  send('touchstart', { touches: [{ clientX: 1424, clientY: 450 }] });
  step(180);
  expectPose(right);
  send('touchmove', { touches: [] }); // Empty/cancelled touch input is harmless.
  send('pointerdown', { clientX: 0, clientY: 450 });
  step(1, false);
  assert.ok(video.seeking);
  send('pointermove', { clientX: 1424, clientY: 450 });
  step(2, false);
  completeSeek(); // New targets received during a pending seek must still be applied.
  step(180);
  expectPose(right);

  // Hovering any part of the video returns to the exact home frame and stops seeking.
  videoListeners.get('pointerenter')({ pointerType: 'mouse' });
  step(180);
  assert.equal(mediaTime, center);
  assert.ok(paused);
  for (const [clientX, clientY] of [
    [501, 100],
    [600, 350],
    [924, 831],
  ]) {
    send('pointermove', { clientX, clientY, pointerType: 'mouse' });
    step(60);
    assert.equal(mediaTime, center);
  }
  assert.equal(states[1], true, 'Hovering girl shows title at rest');
  const restingStateCount = stateChanges.length;
  const restingSeekCount = seekTimes.length;
  step(300);
  assert.equal(seekTimes.length, restingSeekCount);
  assert.equal(stateChanges.length, restingStateCount, 'No repeated React updates at rest');

  // Scrubbing resumes on either side of the video.
  send('pointermove', { clientX: 0, clientY: 450 });
  step(180);
  expectPose(left);
  send('pointermove', { clientX: 1424, clientY: 450 });
  step(180);
  expectPose(right);

  // Leaving the hero or viewport vertically resets even at the left/right corners.
  heroListeners.get('pointerleave')({ clientX: 1400, clientY: 901 });
  step(180);
  assert.equal(mediaTime, center);
  send('pointermove', { clientX: 1424, clientY: 1100 });
  step(60);
  assert.equal(mediaTime, center);
  send('pointermove', { clientX: 0, clientY: 450 });
  step(180);
  send('pointerout', { clientX: -1, clientY: -1, relatedTarget: null });
  step(180);
  assert.equal(mediaTime, center);
  send('pointermove', { clientX: 1424, clientY: 450 });
  step(180);
  send('pointerout', { clientX: 1440, clientY: 900, relatedTarget: null });
  step(180);
  assert.equal(mediaTime, center);

  // Scrolling away must reset without needing another mouse movement.
  send('pointermove', { clientX: 0, clientY: 450 });
  step(180);
  heroBounds = { ...heroBounds, top: -1000, bottom: -100 };
  windowListeners.get('scroll').handler();
  step(180);
  assert.equal(mediaTime, center);
  send('pointermove', { clientX: 1424, clientY: 450 });
  step(60);
  assert.equal(mediaTime, center);
  heroBounds = { left: 0, right: 1425, top: 0, bottom: 900 };

  // A hover reset received while a seek is pending must override the old target.
  send('pointermove', { clientX: 1424, clientY: 450 });
  step(1, false);
  assert.ok(video.seeking);
  videoListeners.get('pointerenter')({ pointerType: 'mouse' });
  step(2, false);
  completeSeek();
  step(180);
  assert.equal(mediaTime, center);

  fakeWindow.innerWidth = 390;
  fakeWindow.innerHeight = 844;
  fakeDocument.documentElement.clientWidth = 375;
  heroBounds = { left: 0, right: 375, top: 0, bottom: 844 };
  videoBounds = { left: -172, right: 548, top: 212, bottom: 1492 };
  windowListeners.get('resize').handler();
  step(180);
  assert.equal(mediaTime, center);
  send('touchmove', { touches: [{ clientX: 0, clientY: 500 }] });
  step(180);
  expectPose(left);
  videoListeners.get('pointerenter')({ pointerType: 'touch' });
  step(60);
  expectPose(left); // Touch scrubbing over the video remains available.
  send('pointermove', { clientX: 374, clientY: 843, pointerType: 'touch' });
  step(180);
  expectPose(right);
  send('pointermove', { clientX: 374, clientY: 843, pointerType: 'mouse' });
  step(180);
  assert.equal(mediaTime, center);
  send('pointermove', { clientX: 374, clientY: 100 });
  step(180);
  expectPose(right);
  windowListeners.get('blur').handler();
  step(180);
  assert.equal(mediaTime, center);
  assert.equal(states[1], true, 'Title returns after blur reset');
  cleanup();
  assert.equal(windowListeners.size, 0);
  assert.equal(videoListeners.size, 0);
  assert.equal(heroListeners.size, 0);
  assert.equal(raf.size, 0);
});
