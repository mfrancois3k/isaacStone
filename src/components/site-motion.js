import { frameAlpha, normalizedVelocity, galleryHeight } from './motion-math.js';
const clamp = (n) => Math.max(0, Math.min(1, n));
export function startSiteMotion(root, reduced) {
  const put = (el, property, value) => {
    if (el && el.style[property] !== value) el.style[property] = value;
  };
  const touchGallery = matchMedia('(max-width: 768px) and (pointer: coarse)');
  const one = (s) => root.querySelector(s),
    all = (s) => [...root.querySelectorAll(s)];
  let disposed = false, disposeHeadings, serviceMotion;
  let geometryDirty = true;
  const invalidate = () => { geometryDirty = true; };
  const headings = all('[data-panel] h2, #work h2, #reels h2, #owner h2, #why h2, #beforeafter h2, #faq h2, #contact h2');
  if (!reduced && headings.length) {
    import('./heading-motion.js').then(({startHeadingMotion}) => {
      if (!disposed) { disposeHeadings = startHeadingMotion(headings); invalidate(); }
    }).catch(() => { /* Copy remains visible if the optional animation chunk cannot load. */ });
  }
  const bar = one("#isv-progress"),
    header = one("#isv-header"),
    hero = one("[data-hero-text]"),
    heroImage = one("[data-hero-img]");
  const panels = all("[data-panel]"),
    stack = one("[data-stack]"),
    strip = one("[data-hstrip]"),
    track = one("[data-htrack]"),
    cards = all("[data-htrack]>figure"),
    rule = one("[data-hbar]"),
    counter = one("[data-hcount]");
  if (!reduced && panels.length) {
    import('./service-motion.js').then(({createServiceMotion}) => {
      if (!disposed) { serviceMotion = createServiceMotion(panels); invalidate(); }
    }).catch(() => { /* Sticky panels remain readable without the optional chunk. */ });
  }
  const reelTrack = one("[data-reeltrack]"),
    reelStrip = one("[data-reelstrip]"),
    reelGhost = one("[data-reelghost]"),
    reelCards = all("[data-reelcard]"),
    reelRule = one("[data-reelbar]"),
    reelCount = one("[data-reelcount]");
  const parallax = all("[data-plx]"),
    words = all("[data-words]"),
    process = one("[data-process] ol"),
    line = one("[data-pline]"),
    steps = all("[data-pstep]"),
    footer = one("[data-footer]"),
    mark = one("[data-fmark]");
  const craft = one('[data-craft-section]'), craftImage = one('[data-craft-image]'),
    craftDetail = one('[data-craft-detail]'), craftRule = one('[data-craft-rule]');
  if (reduced) { put(craftImage, 'transform', 'scale(1)'); put(craftDetail, 'opacity', '0'); put(craftRule, 'transform', 'scaleX(1)'); }
  // Process timeline: each stage owns a concise focus state while its portion
  // of the line is being drawn. These transitions are deliberately separate
  // from the page loader and hero choreography.
  steps.forEach((step) => {
    step.style.transition = "opacity .55s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1),background-color .55s ease";
    const marker = step.firstElementChild;
    const number = marker?.nextElementSibling;
    const content = step.lastElementChild;
    if (marker) marker.style.transition = "background-color .35s ease,transform .55s cubic-bezier(.16,1,.3,1),box-shadow .55s ease";
    if (number) number.style.transition = "color .45s ease,transform .7s cubic-bezier(.16,1,.3,1),-webkit-text-stroke .45s ease";
    if (content) content.style.transition = "transform .7s cubic-bezier(.16,1,.3,1),opacity .55s ease";
  });
  const tickers = all("[data-vmarq],[data-ticker]").map((el) => ({ el, x: 0 }));
  const dot = one("#isv-cur-dot"),
    ring = one("#isv-cur-ring"),
    label = one("#isv-cur-label");
  let cursorEnabled = !reduced && matchMedia("(pointer:fine)").matches,
    pointer = { x: 0, y: 0, seen: false },
    follow = { x: 0, y: 0 },
    hover = null,
    scale = 1;
  const move = (e) => {
    pointer = { x: e.clientX, y: e.clientY, seen: true };
  };
  const over = (e) => {
    hover = e.target.closest?.("[data-cur]") || null;
  };
  const activeCounts = new Map();
  const counts = all("[data-count]");
  const beginCount = (target) => {
    if (!target || target.dataset.counted) return;
    target.dataset.counted = "1";
    countObserver.unobserve(target);
    activeCounts.set(target, {
      start: performance.now(),
      target: Number(target.dataset.count),
      decimals: Number(target.dataset.decimals || 0),
    });
  };
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) beginCount(target);
      });
    },
    { threshold: 0.12 },
  );
  counts.forEach((el) => {
    if (reduced || el.dataset.counted) {
      el.textContent = Number(el.dataset.count).toFixed(
        Number(el.dataset.decimals || 0),
      );
      el.dataset.counted = "1";
    } else countObserver.observe(el);
  });
  const reveal = (el) => {
    el.dataset.revealed = "1";
    put(el, "opacity", "1");
    put(el, "transform", "none");
    el.querySelectorAll("[data-rv-line],[data-rv-item]").forEach((n) => {
      put(n, "transform", "none");
      put(n, "opacity", "1");
    });
    const images = [...el.querySelectorAll("[data-rv-img]")];
    if (el.matches("[data-rv-img]")) images.push(el);
    images.forEach((n) => {
      put(n, "clipPath", "inset(0)");
      put(n, "transform", "none");
    });
  };
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          reveal(e.target);
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  all("[data-rv]").forEach((el) =>
    reduced || el.dataset.revealed ? reveal(el) : io.observe(el),
  );
  // Hero starts with the loader's fill, not when the overlay finishes wiping.
  all("#top [data-rv]").forEach((el) => {
    reveal(el);
    io.unobserve(el);
  });
  const heroAnimations = [];
  // The H1 is the hero's main cinematic beat. Explicit WAAPI timing keeps
  // the three masked lines staggered even when the loader hands off mid-frame.
  if (!reduced) {
    const heroLines = all("#top h1 [data-rv-line]");
    heroLines.forEach((line, index) => {
      heroAnimations.push(
        line.animate(
          [
            { opacity: 0, transform: "translateY(112%) scale(.985)" },
            { opacity: 1, transform: "translateY(0) scale(1)" },
          ],
          {
            duration: 1600,
            delay: 500 + index * 350,
            easing: "cubic-bezier(.6,.01,-.05,.95)",
            fill: "both",
          },
        ),
      );
    });
  }
  if (heroImage && !reduced) {
    heroAnimations.push(
      heroImage.animate(
        [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0)" }],
        {
          duration: 1800,
          delay: 200,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "backwards",
        },
      ),
    );
    if (heroImage.firstElementChild)
      heroAnimations.push(
        heroImage.firstElementChild.animate(
          [{ transform: "scale(1.15)" }, { transform: "scale(1)" }],
          {
            duration: 1800,
            delay: 200,
            easing: "cubic-bezier(.16,1,.3,1)",
            fill: "backwards",
          },
        ),
      );
  }
  words.forEach((el) => {
    if (!el.dataset.split) {
      el.dataset.split = "1";
      const text = el.textContent;
      el.replaceChildren(
        ...text.split(/(\s+)/).map((t) => {
          if (/^\s+$/.test(t)) return document.createTextNode(t);
          const span = document.createElement("span");
          span.textContent = t;
          span.dataset.w = "1";
          put(span, "opacity", reduced ? "1" : ".14");
          return span;
        }),
      );
    }
  });
  const wordProgress = [];
  const wordSpans = words.map((el) => [...el.querySelectorAll("[data-w]")]);
  [bar, rule, reelRule, line].filter(Boolean).forEach((el) => {
    put(el, "transformOrigin", el === line ? "top" : "left");
    if (el !== line) el.style.width = "100%";
  });
  tickers.forEach(({ el }) => {
    put(el, "animation", "none");
  });
  if (cursorEnabled) {
    document.body.style.cursor = "none";
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
  }
  let raf = 0,
    lastY = window.scrollY,
    velocity = 0,
    lastTime = 0,
    directionY = lastY,
    hidden = false;
  let smoothY = lastY;
  const count = (el, index) => {
    const text = String(index + 1).padStart(2, "0") + " ";
    if (el?.firstChild && el.firstChild.nodeValue !== text)
      el.firstChild.nodeValue = text;
  };
  const nearest = (centers, target) =>
    centers.reduce(
      (best, c, i) =>
        Math.abs(c - target) < Math.abs(centers[best] - target) ? i : best,
      0,
    );
  const rect = (el) => el?.getBoundingClientRect();
  const originalHeights = [strip, reelStrip].map(el => el?.style.height || '');
  const playRings = reelCards.map(card => card.querySelector('[data-playring]'));
  let metrics, positions, measuredY, measuredVw, measuredVh, previousNative;
  let lastTrackScroll = -1, lastReelScroll = -1;
  const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(invalidate);
  [root, track, reelTrack, ...panels, ...cards, ...reelCards, ...tickers.map(t => t.el)]
    .filter(Boolean).forEach(el => resizeObserver?.observe(el));
  window.addEventListener('resize', invalidate, {passive:true});
  root.addEventListener?.('load', invalidate, true);
  document.fonts?.addEventListener('loadingdone', invalidate);
  document.fonts?.ready.then(() => { if (!disposed) invalidate(); });
  touchGallery.addEventListener?.('change', invalidate);
  const focusGallery = event => {
    const target = event.target;
    if (!target.matches?.(':focus-visible')) return;
    const card = target.closest?.('[data-reelcard], [data-htrack] > figure');
    const isReel = reelCards.includes(card);
    const gallery = isReel ? reelTrack : track;
    const section = isReel ? reelStrip : strip;
    if (!card || !gallery || !section || (!isReel && !cards.includes(card))) return;
    const viewport = window.innerWidth;
    const x = Math.max(0, Math.min(gallery.scrollWidth - viewport,
      card.offsetLeft + card.offsetWidth / 2 - viewport / 2));
    if (reduced) {
      gallery.scrollTo({left:x, behavior:'instant'});
    } else {
      // Keyboard navigation must reveal the focused card immediately. Setting
      // smoothY as well prevents the visual track lagging behind browser focus.
      const top = section.getBoundingClientRect().top + window.scrollY + x;
      smoothY = top;
      window.scrollTo({top, behavior:'instant'});
    }
    invalidate();
  };
  root.addEventListener?.('focusin', focusGallery);
  const frame = (time) => {
    // Stable sizes are cached. Scroll only refreshes viewport-relative positions;
    // idle ticker/cursor frames never remeasure the page.
    const y = window.scrollY, vh = window.innerHeight, vw = window.innerWidth;
    const native = reduced;
    const resized = measuredVw !== vw || measuredVh !== vh || previousNative !== native;
    const refresh = geometryDirty || resized || !metrics;
    const moved = measuredY !== y;
    const dt = Math.max(.01, Math.min(3, (time - (lastTime || time)) / (1000 / 60) || 1));
    lastTime = time;
    const previousSmooth = smoothY;
    smoothY += (y - smoothY) * (reduced ? 1 : frameAlpha(.11, dt));
    if (Math.abs(y - smoothY) < .3) smoothY = y;
    const previousVelocity = velocity;
    velocity = normalizedVelocity(velocity, y - lastY, dt);
    if (Math.abs(velocity) < .01) velocity = 0;
    lastY = y;
    if (refresh) {
      metrics = {
        trackWidth: track?.scrollWidth || 0,
        trackClient: track?.clientWidth || vw,
        cardCenters: cards.map(c => c.offsetLeft + c.offsetWidth / 2),
        reelWidth: reelTrack?.scrollWidth || 0,
        reelClient: reelTrack?.clientWidth || vw,
        reelCenters: reelCards.map(c => c.offsetLeft + c.offsetWidth / 2),
        panelHeights: panels.map(p => p.offsetHeight),
        tickerWidths: tickers.map(t => t.el.scrollWidth / 2),
      };
      measuredVw = vw; measuredVh = vh; previousNative = native;
    }
    if (refresh || moved || !positions) {
      positions = {
        stackRect: rect(stack), stripRect: rect(strip), reelRect: rect(reelStrip),
        parallaxRects: parallax.map(e => rect(e.parentElement)),
        wordRects: words.map(rect), processRect: rect(process), stepRects: steps.map(rect),
        footerRect: rect(footer), craftRect: rect(craft), tickerRects: tickers.map(t => rect(t.el.parentElement || t.el)),
        docH: document.documentElement.scrollHeight - vh,
      };
      measuredY = y;
    }
    const {trackWidth, trackClient, cardCenters, reelWidth, reelClient, reelCenters, panelHeights, tickerWidths} = metrics;
    const {stackRect, stripRect, reelRect, parallaxRects, wordRects, processRect, stepRects, footerRect, craftRect, tickerRects, docH} = positions;
    const trackScroll = native ? track?.scrollLeft || 0 : 0;
    const reelScroll = native ? reelTrack?.scrollLeft || 0 : 0;
    // All reads are complete before sizing or motion writes.
    if (refresh) {
      geometryDirty = false;
      let resizedSections = false;
      [[strip, trackWidth, 0], [reelStrip, reelWidth, 1]].forEach(([el, width, i]) => {
        if (!el) return;
        const height = native ? originalHeights[i] : `${galleryHeight(width, vw, vh)}px`;
        if (el.style.height !== height) { el.style.height = height; resizedSections = true; }
      });
      if (resizedSections) {
        // Section sizing affects all following positions. Remeasure next frame,
        // never force a second layout in this frame's write phase.
        geometryDirty = true;
        raf = requestAnimationFrame(frame);
        return;
      }
    }
    const scrollChanged = refresh || moved;
    // IntersectionObserver is the fast path. This scroll fallback covers mobile
    // browser handoffs where the observer can miss a section already in view.
    if (!reduced && scrollChanged) {
      counts.forEach((el) => {
        if (el.dataset.counted) return;
        const r = rect(el);
        if (r && r.top < vh * .82 && r.bottom > vh * .1) beginCount(el);
      });
    }
    const scrubChanged = scrollChanged || smoothY !== previousSmooth;
    const visible = r => r && r.bottom >= 0 && r.top <= vh;
    // WRITE PHASE: one loop owns every continuously scrubbed effect, including the cursor.
    // Entrance counters use elapsed time, independently of scroll, in the shared frame scheduler.
    activeCounts.forEach((value, el) => {
      const progress = clamp((time - value.start) / 1600);
      const text = (value.target * (1 - Math.pow(1 - progress, 3))).toFixed(
        value.decimals,
      );
      if (el.textContent !== text) el.textContent = text;
      if (progress === 1) activeCounts.delete(el);
    });
    if (bar && scrollChanged) bar.style.transform = `scaleX(${docH > 0 ? clamp(y / docH) : 1})`;
    if (!reduced) {
      if (scrollChanged) {
        if (y > 140 && y - directionY > 6) hidden = true;
        else if (y - directionY < -6 || y < 140) hidden = false;
        if (Math.abs(y - directionY) > 6) directionY = y;
        if (header) {
          put(header, "transform", hidden ? "translateY(-110%)" : "translateY(0)");
          put(header, 'background', y > vh * .9 ? 'rgba(28,26,23,.92)' : 'rgba(28,26,23,.55)');
        }
        const hp = clamp(y / vh);
        if (hero) {
          put(hero, "transform", `translateY(${hp * 90}px)`);
          put(hero, "opacity", String(Math.max(0, 1 - hp * 1.1)));
        }
        if (heroImage)
          put(heroImage, "transform", `translateY(${-hp * 70}px) scale(${1 + hp * 0.06})`);
        parallax.forEach((el, i) => {
          const r = parallaxRects[i];
          if (r.bottom >= 0 && r.top <= vh)
            put(el, "transform", `translateY(${((r.top + r.height / 2 - vh / 2) / vh) * -100 * parseFloat(el.dataset.plx)}%)`);
        });
        words.forEach((el, i) => {
          const r = wordRects[i],
            p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35)),
            spans = wordSpans[i];
          if (wordProgress[i] === p) return;
          wordProgress[i] = p;
          spans.forEach((w, j) => put(w, 'opacity', String(
            .14 + .86 * clamp((p * (spans.length + 3) - j) / 3))));
        });
        if (stackRect) {
          let offset = 0;
          panels.forEach((el, i) => {
            const p =
              i === panels.length - 1
                ? 0
                : clamp((-stackRect.top - offset - Math.max(0, panelHeights[i] - vh)) / vh);
            const pinTop = `${Math.min(0, vh - panelHeights[i])}px`;
            if (el.style.top !== pinTop) el.style.top = pinTop;
            serviceMotion?.update(i, p);
            offset += panelHeights[i];
          });
        }
      }
      if (scrubChanged && stripRect && track && !native) {
        const max = Math.max(0, trackWidth - vw),
          p = clamp(
            (smoothY - y - stripRect.top) / Math.max(1, stripRect.height - vh),
          ),
          x = -max * p;
        put(track, "transform", `translateX(${x}px)`);
        put(rule, "transform", `scaleX(${p})`);
        count(counter, nearest(cardCenters, vw / 2 - x));
      }
      if ((scrubChanged || previousVelocity !== velocity) && reelRect && reelTrack && !native) {
        const p = clamp(
          (smoothY - y - reelRect.top) / Math.max(1, reelRect.height - vh),
        );
        const tx = -p * Math.max(0, reelWidth - vw);
        put(reelTrack, "transform", `translateX(${tx}px)`);
        put(reelRule, "transform", `scaleX(${p})`);
        if (reelGhost)
          put(reelGhost, "transform", `translate(${4 - p * 18}vw,-50%)`);
        const enter = clamp((vh * 0.6 - reelRect.top) / (vh * 0.9));
        const skew = visible(reelRect) ? Math.max(-1, Math.min(1, velocity / 40)) : 0;
        reelCards.forEach((card, i) => {
          const distance = (reelCenters[i] + tx - vw * 0.5) / vw;
          const edge = Math.min(1, Math.abs(distance));
          const entry = 1 - Math.pow(1 - clamp(enter * 1.6 - i * 0.12), 3);
          put(card, "transform", `perspective(1400px) rotateY(${-distance * 18 - skew * 5}deg) rotateX(${(1 - entry) * 14}deg) translateY(${edge * 30 + (1 - entry) * 160}px) scale(${1 - edge * 0.16})`);
          put(card, "opacity", String(entry * (1 - edge * 0.5)));
          put(card, "zIndex", String(10 - Math.round(edge * 9)));
          const play = playRings[i];
          if (play) {
            put(play, "transform", `scale(${1 + (1 - edge) * 0.35})`);
            put(play, 'background', edge < .18 ? 'rgba(191,29,26,.85)' : 'rgba(15,14,13,.35)');
          }
        });
        count(reelCount, nearest(reelCenters, vw * 0.5 - tx));
      }
      tickers.forEach((t, i) => {
        const half = tickerWidths[i];
        if (half && visible(tickerRects[i])) {
          t.x -=
            (0.9 +
              Math.min(Math.abs(velocity), 60) * 0.12 * Math.sign(velocity)) *
            dt;
          t.x = ((t.x % half) - half) % half;
          t.el.style.transform = `translateX(${t.x}px)`;
          const italic = Math.abs(velocity) > 25 ? 'italic' : 'normal';
          if (t.el.style.fontStyle !== italic) { put(t.el, 'fontStyle', italic); invalidate(); }
        }
      });
      if (scrollChanged) {
        if (processRect && line) {
          const lineProgress = clamp((vh * 0.72 - processRect.top) / Math.max(1, processRect.height * .86));
          put(line, "transform", `scaleY(${lineProgress})`);
          const currentStep = Math.max(0, steps.reduce((active, step, index) =>
            stepRects[index].top < vh * .62 ? index : active, -1));
          steps.forEach((el, i) => {
            const rect = stepRects[i];
            const enter = clamp((vh * .88 - rect.top) / Math.max(1, vh * .45));
            const isActive = i === currentStep && rect.bottom > vh * .18;
            const isPast = i < currentStep;
            el.toggleAttribute("data-active", isActive);
            if (isActive) el.setAttribute("aria-current", "step");
            else el.removeAttribute("aria-current");
            put(el, "opacity", isActive ? "1" : isPast ? ".62" : String(.25 + enter * .28));
            put(el, "transform", `translateY(${(1 - enter) * 24}px)`);
            put(el, "background", isActive ? "linear-gradient(90deg,rgba(161,86,63,.11),rgba(161,86,63,0) 72%)" : "transparent");
            const marker = el.firstElementChild;
            const number = marker?.nextElementSibling;
            const content = el.lastElementChild;
            if (number) {
              put(number, "color", isActive ? "#a1563f" : isPast ? "#857e72" : "transparent");
              put(number, "WebkitTextStroke", isActive ? "0" : "1px #2a2825");
              put(number, "transform", `translateY(${(1 - enter) * 12}px) scale(${isActive ? 1.06 : 1})`);
            }
            if (content) {
              put(content, "opacity", isActive ? "1" : isPast ? ".72" : String(.34 + enter * .36));
              put(content, "transform", `translateY(${(1 - enter) * 18}px)`);
            }
            if (marker) {
              put(marker, "transform", `scale(${isActive ? 1.7 : isPast ? 1.12 : 1})`);
              put(marker, "background", isActive ? "#a1563f" : isPast ? "#b77c69" : "#d8d1c4");
              put(marker, "boxShadow", isActive ? "0 0 0 7px rgba(161,86,63,.12)" : "none");
            }
          });
        }
        if (craftRect) {
          const p = clamp(-craftRect.top / Math.max(1, craftRect.height - vh));
          put(craftImage, 'transform', `scale(${1.65 - p * .65})`);
          put(craftDetail, 'opacity', String(1 - clamp((p - .15) / .3)));
          put(craftRule, 'transform', `scaleX(${p})`);
        }
        if (footerRect && mark) {
          const p = clamp(
            (vh - footerRect.top) / Math.min(footerRect.height, vh),
          );
          put(mark, "transform", `translateY(${(1 - p) * 38}%)`);
          put(mark, "opacity", String(0.15 + 0.85 * p));
        }
      }
      if (cursorEnabled && dot && ring) {
        follow.x += (pointer.x - follow.x) * frameAlpha(.16, dt);
        follow.y += (pointer.y - follow.y) * frameAlpha(.16, dt);
        scale += ((hover ? 2.1 : 1) - scale) * frameAlpha(.16, dt);
        if (Math.abs(pointer.x-follow.x)<.01) follow.x=pointer.x;
        if (Math.abs(pointer.y-follow.y)<.01) follow.y=pointer.y;
        if (Math.abs((hover?2.1:1)-scale)<.001) scale=hover?2.1:1;
        put(dot, "transform", `translate(${pointer.x}px,${pointer.y}px)`);
        put(ring, "transform", `translate(${follow.x}px,${follow.y}px) scale(${scale})`);
        put(dot, 'opacity', pointer.seen ? '1' : '0');
        put(ring, 'opacity', pointer.seen ? '1' : '0');
        put(ring, "background", hover ? "#a1563f" : "transparent");
        if (label) {
          const text = hover?.dataset.cur || "";
          if (label.textContent !== text) label.textContent = text;
          put(label, "transform", `scale(${1 / scale})`);
        }
      }
    }
    if (track && native && (scrollChanged || trackScroll !== lastTrackScroll)) {
      const p =
        trackScroll / Math.max(1, trackWidth - trackClient);
      if (rule) rule.style.transform = `scaleX(${clamp(p)})`;
      count(counter, nearest(cardCenters, trackScroll + vw / 2));
    }
    if (reelTrack && native && (scrollChanged || reelScroll !== lastReelScroll)) {
      if (reelRule)
        put(reelRule, "transform", `scaleX(${clamp(reelScroll / Math.max(1, reelWidth - reelClient))})`);
      count(reelCount, nearest(reelCenters, reelScroll + reelClient / 2));
    }
    lastTrackScroll = trackScroll; lastReelScroll = reelScroll;
    if (!document.hidden) raf = requestAnimationFrame(frame);
  };
  const wake = () => {
    invalidate(); lastTime = 0;
    cancelAnimationFrame(raf);
    if (!document.hidden) raf = requestAnimationFrame(frame);
  };
  document.addEventListener("visibilitychange", wake);
  wake();
  return () => {
    disposed = true;
    resizeObserver?.disconnect();
    window.removeEventListener('resize', invalidate);
    root.removeEventListener?.('load', invalidate, true);
    root.removeEventListener?.('focusin', focusGallery);
    document.fonts?.removeEventListener('loadingdone', invalidate);
    touchGallery.removeEventListener?.('change', invalidate);
    [strip, reelStrip].forEach((el, i) => { if (el) el.style.height = originalHeights[i]; });
    disposeHeadings?.();
    serviceMotion?.destroy();
    panels.forEach(panel => { panel.style.top = '0px'; });
    cancelAnimationFrame(raf);
    heroAnimations.forEach((a) => a.cancel());
    io.disconnect();
    countObserver.disconnect();
    activeCounts.clear();
    window.removeEventListener("pointermove", move);
    document.removeEventListener("pointerover", over);
    document.removeEventListener("visibilitychange", wake);
    document.body.style.cursor = "";
  };
}
