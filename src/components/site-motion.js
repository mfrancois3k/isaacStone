const clamp = (n) => Math.max(0, Math.min(1, n));
export function startSiteMotion(root, reduced) {
  const one = (s) => root.querySelector(s),
    all = (s) => [...root.querySelectorAll(s)];
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
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        countObserver.unobserve(target);
        if (target.dataset.counted) return;
        target.dataset.counted = "1";
        activeCounts.set(target, {
          start: performance.now(),
          target: Number(target.dataset.count),
          decimals: Number(target.dataset.decimals || 0),
        });
      });
    },
    { threshold: 0.12 },
  );
  all("[data-count]").forEach((el) => {
    if (reduced || el.dataset.counted) {
      el.textContent = Number(el.dataset.count).toFixed(
        Number(el.dataset.decimals || 0),
      );
      el.dataset.counted = "1";
    } else countObserver.observe(el);
  });
  const reveal = (el) => {
    el.dataset.revealed = "1";
    el.style.opacity = "1";
    el.style.transform = "none";
    el.querySelectorAll("[data-rv-line],[data-rv-item]").forEach((n) => {
      n.style.transform = "none";
      n.style.opacity = "1";
    });
    const images = [...el.querySelectorAll("[data-rv-img]")];
    if (el.matches("[data-rv-img]")) images.push(el);
    images.forEach((n) => {
      n.style.clipPath = "inset(0)";
      n.style.transform = "none";
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
          span.style.opacity = reduced ? "1" : ".14";
          return span;
        }),
      );
    }
  });
  const wordSpans = words.map((el) => [...el.querySelectorAll("[data-w]")]);
  [bar, rule, reelRule, line].filter(Boolean).forEach((el) => {
    el.style.transformOrigin = el === line ? "top" : "left";
    if (el !== line) el.style.width = "100%";
  });
  tickers.forEach(({ el }) => {
    el.style.animation = "none";
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
  const frame = (time) => {
    // READ PHASE: complete every layout read before any style mutation.
    const y = window.scrollY,
      vh = window.innerHeight,
      vw = window.innerWidth,
      docH = document.documentElement.scrollHeight - vh;
    const stackRect = rect(stack),
      stripRect = rect(strip),
      trackRect = rect(track),
      trackWidth = track?.scrollWidth || 0,
      trackScroll = track?.scrollLeft || 0;
    const cardCenters = cards.map((c) => c.offsetLeft + c.offsetWidth / 2);
    const reelWidth = reelTrack?.scrollWidth || 0,
      reelRect = rect(reelStrip),
      reelClient = reelTrack?.clientWidth || 1,
      reelScroll = reelTrack?.scrollLeft || 0,
      reelCenters = reelCards.map((c) => c.offsetLeft + c.offsetWidth / 2);
    const parallaxRects = parallax.map((e) => rect(e.parentElement)),
      wordRects = words.map(rect),
      processRect = rect(process),
      stepRects = steps.map(rect),
      footerRect = rect(footer);
    const panelHeights = panels.map((p) => p.offsetHeight),
      tickerWidths = tickers.map((t) => t.el.scrollWidth / 2);
    const dt = Math.min(3, (time - (lastTime || time)) / 16.667 || 1);
    lastTime = time;
    smoothY += (y - smoothY) * (reduced ? 1 : 1 - Math.pow(0.89, dt));
    if (Math.abs(y - smoothY) < 0.3) smoothY = y;
    velocity += (y - lastY - velocity) * 0.12;
    lastY = y;
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
    if (bar) bar.style.transform = `scaleX(${docH > 0 ? clamp(y / docH) : 1})`;
    if (!reduced) {
      if (y > 140 && y - directionY > 6) hidden = true;
      else if (y - directionY < -6 || y < 140) hidden = false;
      if (Math.abs(y - directionY) > 6) directionY = y;
      if (header) {
        header.style.transform = hidden ? "translateY(-110%)" : "translateY(0)";
        header.style.background =
          y > vh * 0.9 ? "rgba(28,26,23,.92)" : "rgba(28,26,23,.55)";
      }
      const hp = clamp(y / vh);
      if (hero) {
        hero.style.transform = `translateY(${hp * 90}px)`;
        hero.style.opacity = String(Math.max(0, 1 - hp * 1.1));
      }
      if (heroImage)
        heroImage.style.transform = `translateY(${-hp * 70}px) scale(${1 + hp * 0.06})`;
      parallax.forEach((el, i) => {
        const r = parallaxRects[i];
        if (r.bottom >= 0 && r.top <= vh)
          el.style.transform = `translateY(${((r.top + r.height / 2 - vh / 2) / vh) * -100 * parseFloat(el.dataset.plx)}%)`;
      });
      words.forEach((el, i) => {
        const r = wordRects[i],
          p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35)),
          spans = wordSpans[i];
        spans.forEach(
          (w, j) =>
            (w.style.opacity = String(
              0.14 + 0.86 * clamp((p * (spans.length + 3) - j) / 3),
            )),
        );
      });
      if (stackRect && vw > 768) {
        let offset = 0;
        panels.forEach((el, i) => {
          const p =
            i === panels.length - 1
              ? 0
              : clamp((-stackRect.top - offset) / panelHeights[i]);
          el.style.transform = `scale(${1 - p * 0.07}) translateY(${-p * 24}px)`;
          el.style.filter = "none";
          const shade = el.querySelector("[data-shade]");
          if (shade) shade.style.opacity = String(p * 0.5);
          offset += panelHeights[i];
        });
      }
      if (stripRect && track && vw > 768) {
        const max = Math.max(0, trackWidth - vw),
          p = clamp(
            (smoothY - y - stripRect.top) / Math.max(1, stripRect.height - vh),
          ),
          x = -max * p;
        track.style.transform = `translateX(${x}px)`;
        if (rule) rule.style.transform = `scaleX(${p})`;
        count(counter, nearest(cardCenters, vw / 2 - x));
      }
      if (reelRect && reelTrack && vw > 768) {
        const p = clamp(
          (smoothY - y - reelRect.top) / Math.max(1, reelRect.height - vh),
        );
        const tx = -p * Math.max(0, reelWidth - vw);
        reelTrack.style.transform = `translateX(${tx}px)`;
        if (reelRule) reelRule.style.transform = `scaleX(${p})`;
        if (reelGhost)
          reelGhost.style.transform = `translate(${4 - p * 18}vw,-50%)`;
        const enter = clamp((vh * 0.6 - reelRect.top) / (vh * 0.9));
        const skew = Math.max(-1, Math.min(1, velocity / 40));
        reelCards.forEach((card, i) => {
          const distance = (reelCenters[i] + tx - vw * 0.5) / vw;
          const edge = Math.min(1, Math.abs(distance));
          const entry = 1 - Math.pow(1 - clamp(enter * 1.6 - i * 0.12), 3);
          card.style.transform = `perspective(1400px) rotateY(${-distance * 18 - skew * 5}deg) rotateX(${(1 - entry) * 14}deg) translateY(${edge * 30 + (1 - entry) * 160}px) scale(${1 - edge * 0.16})`;
          card.style.opacity = String(entry * (1 - edge * 0.5));
          card.style.zIndex = String(10 - Math.round(edge * 9));
          const play = card.querySelector("[data-playring]");
          if (play) {
            play.style.transform = `scale(${1 + (1 - edge) * 0.35})`;
            play.style.background =
              edge < 0.18 ? "rgba(191,29,26,.85)" : "rgba(15,14,13,.35)";
          }
        });
        count(reelCount, nearest(reelCenters, vw * 0.5 - tx));
      }
      tickers.forEach((t, i) => {
        const half = tickerWidths[i];
        if (half) {
          t.x -=
            (0.9 +
              Math.min(Math.abs(velocity), 60) * 0.12 * Math.sign(velocity)) *
            dt;
          t.x = ((t.x % half) - half) % half;
          t.el.style.transform = `translateX(${t.x}px)`;
          t.el.style.fontStyle = Math.abs(velocity) > 25 ? "italic" : "normal";
        }
      });
      if (processRect && line)
        line.style.transform = `scaleY(${clamp((vh * 0.7 - processRect.top) / processRect.height)})`;
      steps.forEach((el, i) => {
        const on = stepRects[i].top < vh * 0.7;
        el.style.opacity = on ? "1" : ".35";
        const dot = el.firstElementChild;
        const number = dot?.nextElementSibling;
        if (number) {
          number.style.color = on ? "#a1563f" : "#857e72";
          number.style.transform = on ? "scale(1.04)" : "scale(1)";
        }
        if (dot) {
          dot.style.transform = on ? "scale(1.4)" : "scale(1)";
          dot.style.background = on ? "#a1563f" : "#d8d1c4";
          dot.style.color = on ? "#a1563f" : "";
        }
      });
      if (footerRect && mark) {
        const p = clamp(
          (vh - footerRect.top) / Math.min(footerRect.height, vh),
        );
        mark.style.transform = `translateY(${(1 - p) * 38}%)`;
        mark.style.opacity = String(0.15 + 0.85 * p);
      }
      if (cursorEnabled && dot && ring) {
        follow.x += (pointer.x - follow.x) * 0.16;
        follow.y += (pointer.y - follow.y) * 0.16;
        scale += ((hover ? 2.1 : 1) - scale) * 0.16;
        dot.style.transform = `translate(${pointer.x}px,${pointer.y}px)`;
        ring.style.transform = `translate(${follow.x}px,${follow.y}px) scale(${scale})`;
        dot.style.opacity = ring.style.opacity = pointer.seen ? "1" : "0";
        ring.style.background = hover ? "#a1563f" : "transparent";
        if (label) {
          label.textContent = hover?.dataset.cur || "";
          label.style.transform = `scale(${1 / scale})`;
        }
      }
    }
    if (track && (vw <= 768 || reduced)) {
      const p =
        trackScroll / Math.max(1, trackWidth - (trackRect?.width || vw));
      if (rule) rule.style.transform = `scaleX(${clamp(p)})`;
      count(counter, nearest(cardCenters, trackScroll + vw / 2));
    }
    if (reelTrack && (vw <= 768 || reduced)) {
      if (reelRule)
        reelRule.style.transform = `scaleX(${clamp(reelScroll / Math.max(1, reelWidth - reelClient))})`;
      count(reelCount, nearest(reelCenters, reelScroll + reelClient / 2));
    }
    if (!document.hidden) raf = requestAnimationFrame(frame);
  };
  const wake = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) raf = requestAnimationFrame(frame);
  };
  document.addEventListener("visibilitychange", wake);
  wake();
  return () => {
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
