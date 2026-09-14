import test from "node:test";
import assert from "node:assert/strict";
import { startSiteMotion } from "../src/components/site-motion.js";

test("entrance counters use elapsed time once; gallery maps its full sticky travel to horizontal overflow", () => {
  const names = [
    "window",
    "document",
    "matchMedia",
    "IntersectionObserver",
    "requestAnimationFrame",
    "cancelAnimationFrame",
  ];
  const saved = new Map(
    names.map((name) => [
      name,
      Object.getOwnPropertyDescriptor(globalThis, name),
    ]),
  );
  const observers = [];
  let frame;
  const stat = { dataset: { count: "25" }, textContent: "0" };
  const strip = {
    style: {},
    getBoundingClientRect: () => ({ top: -250, height: 9999 }),
  };
  const track = {
    style: {},
    scrollWidth: 2000,
    scrollLeft: 0,
    getBoundingClientRect: () => ({ width: 1000 }),
  };
  const root = {
    querySelector: (s) =>
      ({ "[data-hstrip]": strip, "[data-htrack]": track })[s] || null,
    querySelectorAll: (s) => (s === "[data-count]" ? [stat] : []),
  };
  const events = { addEventListener() {}, removeEventListener() {} };
  try {
    globalThis.window = {
      ...events,
      scrollY: 0,
      innerWidth: 1000,
      innerHeight: 720,
    };
    globalThis.document = {
      ...events,
      hidden: false,
      documentElement: { scrollHeight: 10000 },
      body: { style: {} },
    };
    globalThis.matchMedia = () => ({ matches: false });
    globalThis.IntersectionObserver = class {
      constructor(callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    globalThis.requestAnimationFrame = (callback) => {
      frame = callback;
      return 1;
    };
    globalThis.cancelAnimationFrame = () => {};
    const cleanup = startSiteMotion(root, false);
    const start = performance.now();
    frame(start);
    assert.equal(stat.textContent, "0", "offscreen stat must wait for entry");
    assert.ok(
      Math.abs(
        parseFloat(track.style.transform.slice(11)) -
          (-250 / (9999 - 720)) * 1000,
      ) < 0.01,
    );
    assert.equal(
      strip.style.height,
      undefined,
      "preserve the reference sticky-section height",
    );
    window.innerWidth = 662;
    frame(start + 16);
    assert.ok(Math.abs(parseFloat(track.style.transform.slice(11)) - (-250 / (9999 - 720)) * 1338) < 0.01,
      "narrow desktop panes retain scroll-driven horizontal movement");
    window.innerWidth = 1000;
    observers[0].callback([{ target: stat, isIntersecting: true }]);
    frame(start + 800);
    assert.ok(
      Number(stat.textContent) > 0 && Number(stat.textContent) < 25,
      "count advances without any scrolling",
    );
    window.scrollY = 4000;
    frame(start + 1700);
    assert.equal(stat.textContent, "25");
    observers[0].callback([{ target: stat, isIntersecting: true }]);
    frame(start + 1800);
    assert.equal(stat.textContent, "25", "re-entry does not restart the count");
    cleanup();
    stat.textContent = "0";
    delete stat.dataset.counted;
    const reducedCleanup = startSiteMotion(root, true);
    assert.equal(
      stat.textContent,
      "25",
      "reduced motion exposes final value immediately",
    );
    reducedCleanup();
  } finally {
    for (const [name, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});
