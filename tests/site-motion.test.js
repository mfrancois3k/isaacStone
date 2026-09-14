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
  let frame, focusHandler;
  const card={offsetLeft:1400,offsetWidth:400};
  let layoutReads=0, sizeReads=0;
  const stat = { dataset: { count: "25" }, textContent: "0" };
  const strip = {
    style: {},
    getBoundingClientRect: () => { layoutReads++; return { top: -250-window.scrollY, height: parseFloat(strip.style.height) || 9999 }; },
  };
  const track = {
    style: {},
    get scrollWidth() { sizeReads++; return 2000; },
    scrollLeft: 0,
    scrollTo({left}) { this.scrollLeft=left; },
    getBoundingClientRect: () => ({ width: 1000 }),
  };
  const root = {
    addEventListener(name,callback) { if(name==='focusin')focusHandler=callback; },
    removeEventListener() {},
    querySelector: (s) =>
      ({ "[data-hstrip]": strip, "[data-htrack]": track })[s] || null,
    querySelectorAll: (s) => (s === "[data-count]" ? [stat] : s === "[data-htrack]>figure" ? [card] : []),
  };
  const events = { addEventListener() {}, removeEventListener() {} };
  try {
    globalThis.window = {
      ...events,
      scrollY: 0,
      scrollTo({top}) { this.scrollY=top; },
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
    frame(start + 16);
    assert.equal(stat.textContent, "0", "offscreen stat must wait for entry");
    assert.equal(parseFloat(track.style.transform.slice(11)), -250,
      '250 vertical pixels produce 250 horizontal pixels');
    assert.equal(strip.style.height, '1720px', 'height is viewport plus actual overflow');
    const idleReads=layoutReads, idleSizes=sizeReads;
    frame(start + 32); frame(start + 48);
    assert.equal(layoutReads,idleReads,'idle frames do not read section geometry');
    assert.equal(sizeReads,idleSizes,'stable track size remains cached');
    window.innerWidth = 662;
    frame(start + 64); frame(start + 80);
    assert.equal(strip.style.height,'2058px','narrow desktop travel follows actual overflow');
    assert.equal(parseFloat(track.style.transform.slice(11)),-250);
    window.innerWidth = 1000;
    observers[0].callback([{ target: stat, isIntersecting: true }]);
    frame(start + 784);
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
    const beforeScrollSizes=sizeReads;
    window.scrollY=4500; frame(start+1900);
    assert.equal(sizeReads,beforeScrollSizes,'scroll does not remeasure stable track width');
    const focusEvent={target:{matches:()=>true,closest:()=>card}};
    focusHandler(focusEvent); frame(start+1916);
    assert.equal(window.scrollY,750,'keyboard focus moves the pinned gallery to the focused card');
    assert.equal(parseFloat(track.style.transform.slice(11)),-1000,'focused track snaps immediately, without scrub lag');
    cleanup();
    assert.equal(strip.style.height,'','cleanup restores author sizing');
    stat.textContent = "0";
    delete stat.dataset.counted;
    const reducedCleanup = startSiteMotion(root, true);
    assert.equal(
      stat.textContent,
      "25",
      "reduced motion exposes final value immediately",
    );
    focusHandler(focusEvent);
    assert.equal(track.scrollLeft,1000,'reduced-motion keyboard focus uses native horizontal scroll');
    reducedCleanup();
  } finally {
    for (const [name, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});
