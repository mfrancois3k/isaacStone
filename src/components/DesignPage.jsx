import { startSiteMotion } from "./site-motion";
import React from "react";
import "./design-page.css";
const ASSETS = {
  img13: "/assets/design/img13.png",
  img30: "/assets/design/img30.png",
  img40: "/assets/design/img40.png",
  img41: "/assets/design/img41.png",
  img42: "/assets/design/img42.png",
  img43: "/assets/design/img43.png",
  img44: "/assets/design/img44.png",
  img5: "/assets/design/img5.jpg",
  img0: "/assets/design/img0.jpg",
  img2: "/assets/design/img2.jpg",
  img1: "/assets/design/img1.jpg",
  img32: "/assets/design/img32.png",
  img14: "/assets/design/img14.jpg",
  vid3: "/assets/design/vid3.jpg",
  vid5: "/assets/design/vid5.jpg",
  img31: "/assets/design/img31.png",
  vid4: "/assets/design/vid4.jpg",
  img4: "/assets/design/img4.jpg",
  vid1: "/assets/design/vid1.jpg",
  img3: "/assets/design/img3.jpg",
  vid6: "/assets/design/vid6.jpg",
  vid2: "/assets/design/vid2.jpg",
  vid7: "/assets/design/vid7.jpg",
  img8: "/assets/design/img8.jpg",
  img17: "/assets/design/img17.jpg",
  img19: "/assets/design/img19.jpg",
  img9: "/assets/design/img9.jpg",
  vid0: "/assets/design/vid0.jpg",
  img16: "/assets/design/img16.jpg",
  img11: "/assets/design/img11.jpg",
  img15: "/assets/design/img15.jpg",
  img12: "/assets/design/img12.jpg",
  img25: "/assets/design/img25.jpg",
  img23: "/assets/design/img23.jpg",
  img33: "/assets/design/img33.png",
  img24: "/assets/design/img24.jpg",
  img7: "/assets/design/img7.jpg",
  img22: "/assets/design/img22.jpg",
  img20: "/assets/design/img20.jpg",
  img10: "/assets/design/img10.jpg",
  img18: "/assets/design/img18.jpg",
  img21: "/assets/design/img21.jpg",
  img6: "/assets/design/img6.jpg",
};

const QUESTIONS = [
  "What room or space are you looking to update?",
  "Roughly how many square feet is it?",
  "Do you have a material in mind — tile, marble, granite, or not sure yet?",
  "When would you like the work done?",
  "Which town or ZIP code is the project in?",
  "What name should the team use?",
  "What phone number should the team call?",
  "Would you prefer a call or a text?",
];
const FIELDS = [
  "room",
  "size",
  "material",
  "timeline",
  "town",
  "name",
  "phone",
  "contact",
];
const FRAMES = [
  {
    k: "TRAVERTINE · FLOOR TO CEILING",
    t: "Fireplace wall & polished floor",
    s: "LIVING ROOM",
  },
  {
    k: "CALACATTA MARBLE · KITCHEN",
    t: "Waterfall island & range wall",
    s: "KITCHEN",
  },
  {
    k: "BOOKMATCHED MARBLE · BATHROOM",
    t: "Slab shower & floating vanity",
    s: "BATHROOM",
  },
  {
    k: "QUARTZITE & SLATE · EXTERIOR",
    t: "Patio pavers & stepped entry",
    s: "PATIO",
  },
  {
    k: "MATERIALS · SLATE & MOSAIC",
    t: "Samples we bring to the visit",
    s: "SAMPLES",
  },
];
const LOADER_LINES = [
  "TILES TAILORED TO YOUR HOME — BESPOKE STONEWORK",
  "LOADING COMPLETED PROJECT PHOTOGRAPHY (@jafettile____com)…",
  "BRENTWOOD · NASSAU · SUFFOLK · NYC · THE HAMPTONS",
  "TWENTY-FIVE YEARS OF TILE, GRANITE AND MARBLE",
  "TILES TAILORED TO YOUR HOME — ISAAC STONE AND TILE LLC VERIFIED",
];
// proactive agent prompts, keyed by the section the visitor is reading
const HINTS = {
  reels: {
    tag: "JOB SITE",
    text: "These are live from the Instagram account: real cuts and sets, posted the day they happened.",
  },
  why: {
    tag: "WHY US",
    text: "Owner-led work, one point of contact, and a written estimate before anything starts.",
  },
  faq: {
    tag: "FAQ",
    text: "Quick answers to the usual questions. If yours is not here, the number at the top goes straight to the installer.",
  },
  owner: {
    tag: "THE CREW",
    text: "Want someone from the team to call you instead? Tell me the best time.",
    seed: "When is a good time for the team to call you?",
  },
  beforeafter: {
    tag: "BEFORE & AFTER",
    text: "Have a photo of your room right now? I can pass it straight to the crew.",
    seed: "Describe the room as it is today and I will note it for the visit.",
  },
  firm: {
    tag: "THE FIRM",
    text: "Owner-led, one point of contact. Want to hear how a job runs?",
    seed: null,
  },
  services: {
    tag: "SERVICES",
    text: "Not sure whether you need granite or marble? Tell me the room and I will help.",
    seed: "Tile, granite or marble?",
  },
  work: {
    tag: "OUR WORK",
    text: "Like one of these? I can ask the team for the details of that job.",
    seed: null,
  },
  reviews: {
    tag: "REVIEWS",
    text: "Every one of these reviews names the team directly.",
    seed: null,
  },
  process: {
    tag: "PROCESS",
    text: "Want a price range before anyone drives out? Tell me the room and the size.",
    seed: "What room are you looking at?",
  },
  contact: {
    tag: "CONTACT",
    text: "I can fill this form in from a thirty-second chat. Want to try?",
    seed: null,
  },
};
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const loaderVisited = () => {
  try {
    return sessionStorage.getItem("isaac-loader-visit") === "1";
  } catch {
    return false;
  }
};
const markLoaderVisited = () => {
  try {
    sessionStorage.setItem("isaac-loader-visit", "1");
  } catch {
    /* Storage can be unavailable in private embeds. */
  }
};

export default class DesignPage extends React.Component {
  state = {
    lb: null,
    faq: 0,
    sent: false,
    formDetails: "",
    voiceOpen: false,
    listening: false,
    micDenied: false,
    draft: "",
    step: 0,
    answers: {},
    wTyping: false,
    wPerm: false,
    wReviewOn: false,
    wSubmitting: false,
    wSuccess: false,
    wError: "",
    wSpeaking: false,
    speakOn: false,
    log: [
      {
        who: "bot",
        text:
          "Hi, I’m Wamy, Isaac Stone and Tile’s voice assistant. I’ll ask a few questions to help the team understand your project. " +
          QUESTIONS[0],
      },
    ],
    progress: 0,
    loaderExiting: false,
    loaderDone: false,
    loaderIn: false,
    expanding: false,
    frame: 0,
    ba: 50,
    photoName: "",
    hint: null,
    hintDismissed: {},
  };

  componentDidMount() {
    this._motionStarted = false;
    const R = (id) => ASSETS[id];
    document.title =
      "Isaac Stone and Tile — Tile, Granite & Marble Installation · Brentwood, NY";
    document.documentElement.lang = "en";
    const head = document.head,
      add = (tag, attrs) => {
        const el = document.createElement(tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        head.appendChild(el);
      };
    if (!document.querySelector('link[rel="icon"]'))
      add("link", {
        rel: "icon",
        href: R("img32", "uploads/brand/favicon.png"),
      });
    if (!document.querySelector('meta[property="og:title"]')) {
      add("meta", {
        property: "og:title",
        content: "Isaac Stone and Tile — Tile, Granite & Marble Installation",
      });
      add("meta", {
        property: "og:description",
        content:
          "Owner-led tile, marble and stone installation for bathrooms, kitchens and floors across Long Island and New York City.",
      });
      add("meta", {
        property: "og:image",
        content: R("img33", "uploads/brand/og.png"),
      });
      add("meta", { property: "og:type", content: "website" });
      add("meta", { name: "theme-color", content: "#2a2825" });
    }
    if (!document.getElementById("isv-ld")) {
      const ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.id = "isv-ld";
      ld.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HomeAndConstructionBusiness",
        name: "Isaac Stone and Tile",
        telephone: "+1-631-530-5883",
        email: "jafet.tile@gmail.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Brentwood",
          addressRegion: "NY",
          addressCountry: "US",
        },
        areaServed: ["Suffolk County NY", "Nassau County NY", "New York City"],
        openingHours: "Mo-Sa 07:00-18:30",
        sameAs: ["https://www.instagram.com/jafettile____com/"],
      });
      head.appendChild(ld);
    }
    if (!document.querySelector('meta[name="description"]')) {
      const m = document.createElement("meta");
      m.name = "description";
      m.content =
        "Owner-led tile, marble and stone installation for bathrooms, kitchens and floors across Long Island and New York City. Clear written estimates before work begins. Call (631) 530-5883.";
      document.head.appendChild(m);
    }
    this.reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this._keys = (e) => {
      if (e.key !== "Escape") return;
      if (this.state.lb) {
        this.setState({ lb: null });
        return;
      }
      if (this.state.lb) {
        this.setState({ lb: null, lbVideo: "", lbVideoFailed: false });
        return;
      }
      if (!this.state.loaderDone) this.finishLoader();
      else if (this.state.hint) this.dismissHint();
    };
    window.addEventListener("keydown", this._keys);
    document.body.style.overflow = "hidden";

    this._loaded = document.readyState === "complete";
    this._onLoad = () => {
      this._loaded = true;
    };
    window.addEventListener("load", this._onLoad, { once: true });
    this._motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
    this._onMotionPreference = () => {
      this.reduced = this._motionPreference.matches;
      this._disposeMotion?.();
      this._motionStarted = false;
      if (this.reduced) this.finishLoader();
      this.startMotion();
    };
    this._motionPreference.addEventListener("change", this._onMotionPreference);
    if (
      this.reduced ||
      (this.props.loaderMode === "once per session" && loaderVisited()) ||
      this.props.loaderMode === "off"
    ) {
      markLoaderVisited();
      this.setState({ loaderDone: true, progress: 100 }, () => {
        document.body.style.overflow = "";
        this.startMotion();
      });
    } else {
      this._inT = setTimeout(() => this.setState({ loaderIn: true }), 20);
      this._t0 = performance.now();
      this._tick = setInterval(() => {
        const t = clamp01((performance.now() - this._t0 - 300) / 3900);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const progress = Math.min(
          this._loaded ? 100 : 99,
          Math.round(eased * 100),
        );
        if (progress !== this.state.progress) this.setState({ progress });
        if (progress === 100) this.finishLoader();
      }, 32);
    }
  }

  componentWillUnmount() {
    this._disposeMotion?.();
    window.removeEventListener("load", this._onLoad);
    this._motionPreference?.removeEventListener(
      "change",
      this._onMotionPreference,
    );
    window.removeEventListener("resize", this._remeasure);
    this._motionStarted = false;
    if (this._slotObs) this._slotObs.disconnect();
    window.removeEventListener("keydown", this._keys);
    clearInterval(this._tick);
    clearTimeout(this._exit);
    clearTimeout(this._unmount);
    clearTimeout(this._inT);
    clearTimeout(this._hintT);
    if (this._io) this._io.disconnect();
    if (this._ro) this._ro.disconnect();
    if (this._ioA) this._ioA.disconnect();
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._raf2) cancelAnimationFrame(this._raf2);
    window.removeEventListener("mousemove", this._move);
    document.removeEventListener("mouseover", this._over);
    document.removeEventListener("mouseout", this._out);
    document.body.style.cursor = "";
    document.body.style.overflow = "";
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  finishLoader() {
    markLoaderVisited();
    if (this.reduced) {
      clearInterval(this._tick);
      clearTimeout(this._exit);
      clearTimeout(this._unmount);
      document.body.style.overflow = "";
      this.setState({ loaderDone: true, progress: 100 }, () =>
        this.startMotion(),
      );
      return;
    }
    if (this.state.expanding || this.state.loaderDone) return;
    clearInterval(this._tick);
    clearTimeout(this._exit);
    // FLIP: measure the centre piece and compute the transform that fills the viewport
    const c = document.querySelector("[data-center]");
    let tf = "scale(1)";
    if (c) {
      const parent = c.offsetParent.getBoundingClientRect(),
        width = c.offsetWidth,
        height = c.offsetHeight,
        vw = window.innerWidth,
        vh = window.innerHeight;
      const s = Math.max(vw / width, vh / height);
      const dx = vw / 2 - (parent.left + c.offsetLeft + width / 2),
        dy = vh / 2 - (parent.top + c.offsetTop + height / 2);
      tf =
        "translate(" +
        dx.toFixed(1) +
        "px," +
        dy.toFixed(1) +
        "px) scale(" +
        s.toFixed(4) +
        ")";
    }
    this._centerFill = tf;
    document.querySelectorAll("[data-stag]").forEach((el) => {
      el.style.transition =
        "opacity .2s ease, transform .35s cubic-bezier(.76,0,.24,1)";
    });
    this.setState({ progress: 100, expanding: true, loaderIn: true }, () => {
      document.body.style.overflow = "";
      this.startMotion();
      // once the image fills the screen, lift it to reveal the hero
      this._exit = setTimeout(() => {
        this.setState({ loaderExiting: true }, () => {
          document.body.style.overflow = "";
          this.startMotion();
          const h1 = document.querySelector("h1");
          if (h1) {
            h1.setAttribute("tabindex", "-1");
            h1.focus({ preventScroll: true });
          }
          this._unmount = setTimeout(
            () => this.setState({ loaderDone: true }),
            600,
          );
        });
      }, 450);
    });
  }

  showHint() {}
  dismissHint() {}
  splitLines(el) {
    el.dataset.lines = "1";
    const nodes = Array.from(el.childNodes),
      words = [];
    el.textContent = "";
    nodes.forEach((n) => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach((t) => {
          if (!t) return;
          if (/^\s+$/.test(t)) {
            el.appendChild(document.createTextNode(" "));
            return;
          }
          const s = document.createElement("span");
          s.textContent = t;
          s.style.display = "inline-block";
          words.push(s);
          el.appendChild(s);
        });
      } else if (n.nodeType === 1) {
        const s = document.createElement("span");
        s.style.display = "inline-block";
        s.appendChild(n);
        words.push(s);
        el.appendChild(s);
      }
    });
    const lines = [];
    let cur = null,
      top = null;
    words.forEach((w) => {
      const t = w.offsetTop;
      if (top === null || Math.abs(t - top) > 2) {
        cur = [];
        lines.push(cur);
        top = t;
      }
      cur.push(w);
    });
    el.textContent = "";
    lines.forEach((ws, i) => {
      const mask = document.createElement("span");
      mask.style.cssText =
        "display:block;overflow:hidden;padding-bottom:.1em;margin-bottom:-.1em";
      const inner = document.createElement("span");
      inner.dataset.rvLine = "1";
      inner.style.cssText =
        "display:block;transform:translateY(110%);transition:transform 1.1s cubic-bezier(.16,1,.3,1) " +
        (i * 0.09).toFixed(2) +
        "s";
      ws.forEach((w, j) => {
        inner.appendChild(w);
        if (j < ws.length - 1) inner.appendChild(document.createTextNode(" "));
      });
      mask.appendChild(inner);
      el.appendChild(mask);
    });
  }

  splitWords(el) {
    if (el.dataset.split) return;
    el.dataset.split = "1";
    const text = el.textContent;
    el.textContent = "";
    text.split(/(\s+)/).forEach((tok) => {
      if (!tok) return;
      if (/^\s+$/.test(tok)) {
        el.appendChild(document.createTextNode(" "));
        return;
      }
      const s = document.createElement("span");
      s.textContent = tok;
      s.style.display = "inline-block";
      s.style.opacity = "0.14";
      s.style.transition = "opacity .35s linear";
      s.dataset.w = "1";
      el.appendChild(s);
    });
  }

  startMotion() {
    if (this._motionStarted) return;
    this._motionStarted = true;
    this._disposeMotion = startSiteMotion(document.body, this.reduced);
  }

  renderVals() {
    const s = this.state,
      a = s.answers;
    const faqVals = {};
    for (let i = 0; i < 5; i++) {
      const open = s.faq === i;
      faqVals["faq" + i] = () => this.setState({ faq: open ? -1 : i });
      faqVals["faqOpen" + i] = open;
      faqVals["faqRot" + i] = open ? "rotate(45deg)" : "rotate(0)";
      faqVals["faqRows" + i] = open ? "1fr" : "0fr";
    }
    // auto-advance with the counter unless the visitor took over
    const fr = s.frameManual
      ? s.frame
      : Math.min(
          FRAMES.length - 1,
          Math.floor((s.progress / 100) * FRAMES.length),
        );
    const parts = [a.room, a.size, a.material, a.town].filter(Boolean);
    const li = Math.min(
      LOADER_LINES.length - 1,
      Math.floor((s.progress / 100) * LOADER_LINES.length),
    );
    const hint = s.hint ? HINTS[s.hint] : null;
    return {
      ...faqVals,
      lbOpen: !!s.lb,
      lbSrc: s.lb || "",
      lbLink: (s.lb || "").replace("/embed/", "/"),
      lbVideo: s.lbVideo || "",
      lbHasVideo: !!s.lbVideo && !s.lbVideoFailed,
      lbShowEmbed: !s.lbVideo || !!s.lbVideoFailed,
      lbAspect:
        s.lbVideo && s.lbVideo.indexOf("01-raising") > 0 ? "3/4" : "9/16",
      lbVideoEl:
        s.lbVideo && !s.lbVideoFailed
          ? React.createElement("video", {
              key: s.lbVideo,
              src: s.lbVideo,
              controls: true,
              autoPlay: true,
              playsInline: true,
              preload: "metadata",
              onError: () => this.setState({ lbVideoFailed: true }),
              style: {
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                background: "#000",
              },
            })
          : null,
      openReel: (e) => {
        const v = e.currentTarget.getAttribute("data-video");
        const t = e.currentTarget.getAttribute("data-title") || "";
        if (v && !s.lb)
          this.setState({
            lb: v,
            lbVideo: v,
            lbTitle: t,
            lbVideoFailed: false,
          });
      },
      lbTitle: s.lbTitle || "",
      previewOn: (e) => {
        if (
          this.reduced ||
          !matchMedia("(hover:hover) and (pointer:fine)").matches
        )
          return;
        const v = e.currentTarget.querySelector("video[data-preview]");
        if (!v) return;
        if (!v.src) v.src = v.getAttribute("data-src");
        v.currentTime = 0;
        v.play()
          .then(() => {
            v.style.opacity = "1";
          })
          .catch(() => {});
      },
      previewOff: (e) => {
        const v = e.currentTarget.querySelector("video[data-preview]");
        if (!v) return;
        v.pause();
        v.style.opacity = "0";
      },
      closeReel: () => {
        try {
          const v = document.querySelector('[role="dialog"] video');
          if (v) v.pause();
        } catch (err) {}
        this.setState({ lb: null, lbVideo: "", lbVideoFailed: false });
      },
      stop: (e) => e.stopPropagation(),
      loaderActive: !s.loaderDone,
      loaderPointer: s.expanding ? "none" : "auto",
      pieceOpacity: s.expanding ? 0 : s.loaderIn ? 1 : 0,
      pieceShift: s.expanding
        ? "translateY(-40px) scale(.96)"
        : s.loaderIn
          ? "translateY(0) scale(1)"
          : "translateY(46px) scale(.96)",
      titleShift: s.loaderIn ? "translateY(0)" : "translateY(110%)",
      collageOverflow: s.expanding ? "visible" : "hidden",
      centerShift: s.expanding
        ? this._centerFill || "scale(1)"
        : s.loaderIn
          ? "translateY(0) scale(1)"
          : "translateY(46px) scale(.96)",
      shellClip: s.loaderExiting ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
      centerDur: s.expanding ? "0.45s" : "0.3s",
      centerEase: s.expanding
        ? "cubic-bezier(.76,0,.24,1)"
        : "cubic-bezier(.16,1,.3,1)",
      centerOpacity: s.loaderIn ? 1 : 0,
      progress: Math.round(s.progress),
      progressPct: s.progress + "%",
      loaderMessage: LOADER_LINES[li],
      skipLoader: () => this.finishLoader(),

      magnet: (e) => {
        if (
          this.reduced ||
          !matchMedia("(hover:hover) and (pointer:fine)").matches
        )
          return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = Math.max(
            -18,
            Math.min(18, (e.clientX - r.left - r.width / 2) * 0.22),
          ),
          y = Math.max(
            -12,
            Math.min(12, (e.clientY - r.top - r.height / 2) * 0.22),
          );
        e.currentTarget.style.transform =
          "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      },
      unmagnet: (e) => {
        e.currentTarget.style.transform = "translate(0,0)";
      },

      formDetails: s.formDetails,
      onDetails: (e) => this.setState({ formDetails: e.target.value }),
      formNote:
        s.formError ||
        (s.sent
          ? "Your email app has opened with the details. Send the email there to complete your request."
          : "This opens an email draft for the team. You can also speak with Wamy to arrange a visit."),
      baPct: s.ba + "%",
      baClip: "inset(0 " + (100 - s.ba) + "% 0 0)",
      baDown: (e) => {
        this._baDrag = true;
        e.currentTarget.setPointerCapture &&
          e.currentTarget.setPointerCapture(e.pointerId);
        const r = e.currentTarget.getBoundingClientRect();
        this.setState({
          ba: Math.max(2, Math.min(98, ((e.clientX - r.left) / r.width) * 100)),
        });
      },
      baMove: (e) => {
        if (!this._baDrag) return;
        const r = e.currentTarget.getBoundingClientRect();
        this.setState({
          ba: Math.max(2, Math.min(98, ((e.clientX - r.left) / r.width) * 100)),
        });
      },
      baUp: () => {
        this._baDrag = false;
      },
      onPhoto: (e) =>
        this.setState({
          photoName:
            e.target.files && e.target.files[0] ? e.target.files[0].name : "",
        }),
      onSubmit: (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const body = [
          "Name: " + (fd.get("name") || ""),
          "Phone: " + (fd.get("phone") || ""),
          "Email: " + (fd.get("email") || ""),
          "Service: " + (fd.get("service") || ""),
          "Details: " + (fd.get("details") || ""),
          s.photoName ? "Photo attached separately: " + s.photoName : "",
        ]
          .filter(Boolean)
          .join("\n");
        // prototype: hands the request to the client's inbox; swap for a form endpoint at launch
        window.location.href =
          "mailto:jafet.tile@gmail.com?subject=" +
          encodeURIComponent(
            "Estimate request — " + (fd.get("service") || "stone work"),
          ) +
          "&body=" +
          encodeURIComponent(body);
        this.setState({ sent: true });
      },

      menuOpen: !!s.menuOpen,
      menuLabel: s.menuOpen ? "CLOSE ×" : "MENU ☰",
      toggleMenu: () => this.setState({ menuOpen: !s.menuOpen }),
      closeMenu: () => this.setState({ menuOpen: false }),
      toggleVoice: () => window.dispatchEvent(new Event("open-voice-bot")),
    };
  }
  render() {
    const v = this.renderVals();
    return (
      <>
        <div
          data-mobilebar={""}
          style={{
            position: "fixed",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: "96",
            gap: "1px",
            background: "#322e28",
            borderTop: "1px solid #322e28",
          }}
        >
          <a
            href={"tel:+16315305883"}
            style={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "14px",
              minHeight: "56px",
              background: "#1c1a17",
              color: "#f6efdd",
              font: "700 15px 'Source Sans 3',sans-serif",
              textDecoration: "none",
            }}
          >
            {"Call (631) 530-5883"}
          </a>
          <a
            href={"#contact"}
            style={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px",
              minHeight: "56px",
              background: "#a1563f",
              color: "#fff",
              font: "700 15px 'Source Sans 3',sans-serif",
              textDecoration: "none",
            }}
          >
            {"Free estimate"}
          </a>
        </div>
        <div
          id={"isv-progress"}
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            height: "2px",
            width: "0",
            background: "#a1563f",
            zIndex: "95",
            pointerEvents: "none",
          }}
        ></div>
        <div
          style={{
            position: "fixed",
            inset: "0",
            zIndex: "94",
            pointerEvents: "none",
            opacity: ".035",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' sc-camel-base-frequency='.9' sc-camel-num-octaves='3' sc-camel-stitch-tiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        ></div>
        <div
          id={"isv-cur-dot"}
          style={{
            position: "fixed",
            left: "0",
            top: "0",
            width: "8px",
            height: "8px",
            margin: "-4px 0 0 -4px",
            borderRadius: "50%",
            background: "#a1563f",
            zIndex: "99",
            pointerEvents: "none",
            opacity: "0",
            transition: "opacity .3s",
          }}
        ></div>
        <div
          id={"isv-cur-ring"}
          style={{
            position: "fixed",
            left: "0",
            top: "0",
            width: "40px",
            height: "40px",
            margin: "-20px 0 0 -20px",
            borderRadius: "50%",
            border: "1px solid #a1563f",
            zIndex: "99",
            pointerEvents: "none",
            opacity: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            font: "400 9px 'JetBrains Mono',monospace",
            letterSpacing: "1.6px",
            color: "#fff",
            willChange: "transform",
            transition: "background .35s,border-color .35s,opacity .3s",
          }}
        >
          <span
            id={"isv-cur-label"}
            style={{
              display: "block",
              transform: "scale(1)",
              whiteSpace: "nowrap",
            }}
          ></span>
        </div>
        {v.loaderActive && (
          <>
            <div
              style={{
                position: "fixed",
                inset: "0",
                zIndex: "90",
                overflow: "hidden",
                background: "#f6efdd",
                pointerEvents: v.loaderPointer,
                cursor: "default",
                userSelect: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                clipPath: v.shellClip,
                transition: "clip-path .6s cubic-bezier(.76,0,.24,1)",
              }}
            >
              <div
                data-collage={""}
                draggable={"false"}
                style={{
                  position: "relative",
                  width: "min(92vw,calc((100vh - 48px) * 16 / 9))",
                  aspectRatio: "16/9",
                  background: "#f6efdd",
                  overflow: v.collageOverflow,
                  cursor: "default",
                  userSelect: "none",
                }}
              >
                <div
                  data-piece={""}
                  data-stag={""}
                  style={{
                    position: "absolute",
                    left: "14%",
                    top: "17%",
                    width: "14%",
                    height: "37%",
                    overflow: "hidden",
                    background: "#e9e7e2",
                    opacity: v.pieceOpacity,
                    transform: v.pieceShift,
                    transition:
                      "opacity .8s cubic-bezier(.16,1,.3,1) .1s,transform 1s cubic-bezier(.16,1,.3,1) .1s",
                  }}
                >
                  <img
                    id={"isv2-pre-kitchen"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img16.jpg"}
                    alt={"Calacatta gold bath"}
                    decoding={"async"}
                  />
                </div>
                <div
                  data-piece={""}
                  data-stag={""}
                  style={{
                    position: "absolute",
                    left: "72%",
                    top: "14%",
                    width: "14%",
                    height: "38%",
                    overflow: "hidden",
                    background: "#e9e7e2",
                    opacity: v.pieceOpacity,
                    transform: v.pieceShift,
                    transition:
                      "opacity .8s cubic-bezier(.16,1,.3,1) .28s,transform 1s cubic-bezier(.16,1,.3,1) .28s",
                  }}
                >
                  <img
                    id={"isv2-pre-bath"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img15.jpg"}
                    alt={"Black marble bath"}
                    decoding={"async"}
                  />
                </div>
                <div
                  data-piece={""}
                  data-stag={""}
                  style={{
                    position: "absolute",
                    left: "9%",
                    top: "62%",
                    width: "30.5%",
                    height: "22%",
                    overflow: "hidden",
                    background: "#e9e7e2",
                    opacity: v.pieceOpacity,
                    transform: v.pieceShift,
                    transition:
                      "opacity .8s cubic-bezier(.16,1,.3,1) .45s,transform 1s cubic-bezier(.16,1,.3,1) .45s",
                  }}
                >
                  <img
                    id={"isv2-pre-samples"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img21.jpg"}
                    alt={"Slab veining"}
                    decoding={"async"}
                  />
                </div>
                <div
                  data-piece={""}
                  data-stag={""}
                  style={{
                    position: "absolute",
                    left: "59%",
                    top: "67%",
                    width: "20%",
                    height: "20%",
                    overflow: "hidden",
                    background: "#e9e7e2",
                    opacity: v.pieceOpacity,
                    transform: v.pieceShift,
                    transition:
                      "opacity .8s cubic-bezier(.16,1,.3,1) .62s,transform 1s cubic-bezier(.16,1,.3,1) .62s",
                  }}
                >
                  <img
                    id={"isv2-pre-patio"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img17.jpg"}
                    alt={"Marble foyer inlay"}
                    decoding={"async"}
                  />
                </div>
                <div
                  data-center={""}
                  style={{
                    position: "absolute",
                    left: "32%",
                    top: "29%",
                    width: "39%",
                    height: "47%",
                    overflow: "hidden",
                    background: "#e9e7e2",
                    opacity: v.centerOpacity,
                    transform: v.centerShift,
                    transformOrigin: "50% 50%",
                    transition:
                      "opacity .9s cubic-bezier(.16,1,.3,1),transform " +
                      v.centerDur +
                      " " +
                      v.centerEase,
                    willChange: "transform",
                    zIndex: "2",
                  }}
                >
                  <img
                    id={"isv2-pre-living"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img9.jpg"}
                    alt={"Marble vessel sinks — completed job"}
                    decoding={"async"}
                  />
                </div>
                <h2
                  style={{
                    position: "absolute",
                    left: "0",
                    right: "0",
                    top: "14.5%",
                    margin: "0",
                    textAlign: "center",
                    font: "400 clamp(20px,4.2vw,58px)/1 'Instrument Serif',serif",
                    letterSpacing: "-0.02em",
                    color: "#2a2825",
                    overflow: "hidden",
                    paddingBottom: ".1em",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    data-stag={""}
                    style={{
                      display: "inline-block",
                      transform: v.titleShift,
                      opacity: v.pieceOpacity,
                      transition:
                        "transform .9s cubic-bezier(.16,1,.3,1) .75s,opacity .6s ease .75s",
                    }}
                  >
                    {"Tiles"}
                  </span>
                  <span
                    data-stag={""}
                    style={{
                      display: "inline-block",
                      transform: v.titleShift,
                      opacity: v.pieceOpacity,
                      transition:
                        "transform .9s cubic-bezier(.16,1,.3,1) .85s,opacity .6s ease .85s",
                    }}
                  >
                    {"Tailored"}
                  </span>
                  <span
                    data-stag={""}
                    style={{
                      display: "inline-block",
                      transform: v.titleShift,
                      opacity: v.pieceOpacity,
                      transition:
                        "transform .9s cubic-bezier(.16,1,.3,1) .95s,opacity .6s ease .95s",
                    }}
                  >
                    {"to"}
                  </span>
                  <span
                    data-stag={""}
                    style={{
                      display: "inline-block",
                      transform: v.titleShift,
                      opacity: v.pieceOpacity,
                      transition:
                        "transform .9s cubic-bezier(.16,1,.3,1) 1.02s,opacity .6s ease 1.02s",
                    }}
                  >
                    {"Your"}
                  </span>
                  <span
                    data-stag={""}
                    style={{
                      display: "inline-block",
                      transform: v.titleShift,
                      opacity: v.pieceOpacity,
                      transition:
                        "transform .9s cubic-bezier(.16,1,.3,1) 1.1s,opacity .6s ease 1.1s",
                    }}
                  >
                    {"Home"}
                  </span>
                </h2>
                <div
                  data-stag={""}
                  style={{
                    position: "absolute",
                    left: "3%",
                    bottom: "4%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    font: "400 clamp(9px,.8vw,11px) 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#6b6459",
                    opacity: v.pieceOpacity,
                    transition: "opacity .6s ease 1.2s",
                    pointerEvents: "none",
                  }}
                >
                  <img
                    src={"/assets/design/img13.png"}
                    alt={""}
                    width={"96"}
                    height={"34"}
                    style={{
                      display: "block",
                      height: "34px",
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                  <span>{"BRENTWOOD, NY"}</span>
                </div>
                <div
                  data-stag={""}
                  style={{
                    position: "absolute",
                    right: "3%",
                    bottom: "4%",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "6px",
                    font: "400 clamp(22px,2.6vw,36px)/1 'Instrument Serif',serif",
                    letterSpacing: "-0.03em",
                    color: "#2a2825",
                    opacity: v.pieceOpacity,
                    transition: "opacity .6s ease 1.2s",
                    pointerEvents: "none",
                  }}
                >
                  {v.progress}
                  <span
                    style={{
                      font: "400 clamp(9px,.8vw,11px) 'JetBrains Mono',monospace",
                      color: "#a1563f",
                      letterSpacing: "1px",
                    }}
                  >
                    {"%"}
                  </span>
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: "0",
                    right: "0",
                    bottom: "0",
                    height: "2px",
                    background: "rgba(26,24,21,.08)",
                  }}
                >
                  <div
                    style={{
                      height: "2px",
                      width: "100%",
                      transform: `scaleX(${v.progress / 100})`,
                      transformOrigin: "left",
                      background: "#a1563f",
                      transition: "transform .1s linear",
                    }}
                  ></div>
                </div>
              </div>
              <button
                type={"button"}
                onClick={v.skipLoader}
                data-cur={"SKIP"}
                data-stag={""}
                style={{
                  position: "absolute",
                  top: "18px",
                  right: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 14px",
                  minHeight: "40px",
                  background: "transparent",
                  border: "1px solid rgba(26,24,21,.3)",
                  color: "#2a2825",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.4px",
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                  opacity: v.pieceOpacity,
                  transition: "opacity .5s ease .4s",
                }}
              >
                {"SKIP [ESC] →"}
              </button>
              <a
                href={"tel:+16315305883"}
                style={{
                  position: "absolute",
                  top: "18px",
                  left: "20px",
                  display: "flex",
                  alignItems: "center",
                  padding: "9px 14px",
                  minHeight: "40px",
                  border: "1px solid rgba(26,24,21,.3)",
                  color: "#2a2825",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.6px",
                  textDecoration: "none",
                  backdropFilter: "blur(4px)",
                }}
              >
                {"(631) 530-5883"}
              </a>
            </div>
          </>
        )}
        <header
          id={"isv-header"}
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            zIndex: "30",
            background: "rgba(28,26,23,.86)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(246,239,221,.08)",
            color: "#fff",
            transition: "transform .6s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "16px 28px",
              display: "flex",
              flexWrap: "nowrap",
              gap: "16px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <a
              href={"#top"}
              data-cur={"TOP"}
              aria-label={"Isaac Stone and Tile — home"}
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                flex: "none",
              }}
            >
              <img
                src={"/assets/design/img30.png"}
                alt={"Isaac Stone and Tile"}
                width={"110"}
                height={"44"}
                style={{
                  display: "block",
                  height: "44px",
                  width: "auto",
                  maxWidth: "130px",
                  objectFit: "contain",
                }}
              />
            </a>
            <nav
              data-topnav={""}
              style={{
                display: "flex",
                flex: "1",
                minWidth: "0",
                justifyContent: "center",
                gap: "clamp(12px,1.8vw,26px)",
                alignItems: "center",
                whiteSpace: "nowrap",
                font: "400 10px 'JetBrains Mono',monospace",
                letterSpacing: "1.6px",
              }}
            >
              <a
                href={"#services"}
                style={{ color: "#fff", textDecoration: "none" }}
              >
                {"[01] SERVICES"}
              </a>
              <a
                href={"#work"}
                style={{ color: "#fff", textDecoration: "none" }}
              >
                {"[02] WORK"}
              </a>
              <a
                href={"#reels"}
                style={{ color: "#fff", textDecoration: "none" }}
              >
                {"[02b] REELS"}
              </a>
              <a
                href={"#reviews"}
                style={{ color: "#fff", textDecoration: "none" }}
              >
                {"[03] REVIEWS"}
              </a>
              <a
                href={"#faq"}
                style={{ color: "#fff", textDecoration: "none" }}
              >
                {"[04] FAQ"}
              </a>
              <a
                href={"#contact"}
                style={{ color: "#fff", textDecoration: "none" }}
              >
                {"[05] CONTACT"}
              </a>
            </nav>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flex: "none",
              }}
            >
              <button
                type={"button"}
                data-menubtn={""}
                onClick={v.toggleMenu}
                aria-expanded={v.menuOpen}
                style={{
                  alignItems: "center",
                  gap: "8px",
                  padding: "11px 14px",
                  border: "1px solid #fff",
                  background: "transparent",
                  color: "#fff",
                  font: "400 11px 'JetBrains Mono',monospace",
                  letterSpacing: "1.4px",
                  minHeight: "44px",
                  cursor: "pointer",
                }}
              >
                {v.menuLabel}
              </button>
              <a
                href={"tel:+16315305883"}
                data-cur={"CALL"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "11px 16px",
                  border: "1px solid #fff",
                  color: "#fff",
                  font: "400 11px 'JetBrains Mono',monospace",
                  letterSpacing: "1.4px",
                  minHeight: "44px",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {"(631) 530-5883"}
              </a>
            </div>
          </div>
        </header>
        {v.menuOpen && (
          <>
            {" "}
            <nav
              aria-label={"Sections"}
              style={{
                position: "fixed",
                top: "76px",
                left: "14px",
                right: "14px",
                zIndex: "31",
                background: "#1c1a17",
                color: "#f6efdd",
                border: "1px solid #322e28",
                borderRadius: "14px",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 30px 80px rgba(0,0,0,.45)",
              }}
            >
              <a
                href={"#services"}
                onClick={v.closeMenu}
                style={{
                  padding: "16px 14px",
                  color: "#f6efdd",
                  textDecoration: "none",
                  font: "400 22px 'Instrument Serif',serif",
                  borderBottom: "1px solid #322e28",
                }}
              >
                {"Services"}
              </a>
              <a
                href={"#work"}
                onClick={v.closeMenu}
                style={{
                  padding: "16px 14px",
                  color: "#f6efdd",
                  textDecoration: "none",
                  font: "400 22px 'Instrument Serif',serif",
                  borderBottom: "1px solid #322e28",
                }}
              >
                {"Our work"}
              </a>
              <a
                href={"#reels"}
                onClick={v.closeMenu}
                style={{
                  padding: "16px 14px",
                  color: "#f6efdd",
                  textDecoration: "none",
                  font: "400 22px 'Instrument Serif',serif",
                  borderBottom: "1px solid #322e28",
                }}
              >
                {"Reels"}
              </a>
              <a
                href={"#reviews"}
                onClick={v.closeMenu}
                style={{
                  padding: "16px 14px",
                  color: "#f6efdd",
                  textDecoration: "none",
                  font: "400 22px 'Instrument Serif',serif",
                  borderBottom: "1px solid #322e28",
                }}
              >
                {"Reviews"}
              </a>
              <a
                href={"#contact"}
                onClick={v.closeMenu}
                style={{
                  padding: "16px 14px",
                  color: "#d9a58f",
                  textDecoration: "none",
                  font: "400 22px 'Instrument Serif',serif",
                }}
              >
                {"Get an estimate"}
              </a>
            </nav>
          </>
        )}
        <section
          id={"top"}
          data-agent={""}
          style={{
            position: "relative",
            zIndex: "1",
            minHeight: "100vh",
            padding:
              "clamp(92px,12vh,124px) clamp(14px,2.6vw,36px) clamp(20px,3vw,36px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
            gap: "14px",
            alignItems: "stretch",
          }}
        >
          <div
            data-rv={""}
            style={{
              background: "#2a2825",
              color: "#f6efdd",
              borderRadius: "18px",
              padding: "clamp(28px,3.4vw,52px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "36px",
              minWidth: "0",
              minHeight: "min(78vh,760px)",
              position: "relative",
              overflow: "hidden",
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          >
            <div
              data-hero-text={""}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "26px",
                willChange: "transform,opacity",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px 18px",
                  alignItems: "center",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.6px",
                  color: "#8d857a",
                }}
              >
                <span>{"TILE, MARBLE AND STONE CRAFTSMANSHIP"}</span>
                <span
                  style={{
                    width: "1px",
                    height: "12px",
                    background: "#322e28",
                  }}
                ></span>
                <span style={{ color: "#d6cfc4" }}>
                  {"BRENTWOOD, NY · LONG ISLAND & NYC"}
                </span>
              </div>
              <h1
                style={{
                  margin: "0",
                  font: "400 clamp(50px,6.4vw,108px)/0.9 'Instrument Serif',serif",
                  letterSpacing: "-0.045em",
                }}
              >
                <span
                  style={{
                    display: "block",
                    overflow: "hidden",
                    paddingBottom: ".06em",
                  }}
                >
                  <span
                    data-rv-line={""}
                    style={{
                      display: "block",
                      transform: "translateY(110%)",
                      transition: "transform .9s cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    {"Precision"}
                  </span>
                </span>
                <span
                  style={{
                    display: "block",
                    overflow: "hidden",
                    paddingBottom: ".06em",
                  }}
                >
                  <span
                    data-rv-line={""}
                    style={{
                      display: "block",
                      transform: "translateY(110%)",
                      transition: "transform .9s cubic-bezier(.16,1,.3,1) .08s",
                    }}
                  >
                    {"installation, "}
                    <em style={{ fontStyle: "italic", color: "#d9a58f" }}>
                      {"built"}
                    </em>
                  </span>
                </span>
                <span
                  style={{
                    display: "block",
                    overflow: "hidden",
                    paddingBottom: ".08em",
                  }}
                >
                  <span
                    data-rv-line={""}
                    style={{
                      display: "block",
                      transform: "translateY(110%)",
                      transition: "transform .9s cubic-bezier(.16,1,.3,1) .16s",
                    }}
                  >
                    <em style={{ fontStyle: "italic", color: "#d9a58f" }}>
                      {"to belong."}
                    </em>
                  </span>
                </span>
              </h1>
              <p
                style={{
                  margin: "0",
                  maxWidth: "44ch",
                  font: "400 clamp(17px,1.3vw,20px)/1.55 'Source Sans 3',sans-serif",
                  color: "#d6cfc4",
                }}
              >
                {
                  "Owner-led tile and stone work for bathrooms, kitchens, floors and custom interior surfaces across Long Island and New York City."
                }
              </p>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.6px",
                  color: "#a89f92",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#3ddc84",
                  }}
                ></span>
                {"MON–SAT 7:00–18:30"}
              </span>
            </div>
            <div
              data-mobstrip={""}
              style={{
                gap: "10px",
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                margin: "0 -8px",
                padding: "0 8px 6px",
                scrollbarWidth: "none",
              }}
            >
              <a
                href={"#work"}
                style={{
                  flex: "none",
                  width: "150px",
                  aspectRatio: "4/5",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "#2a2620",
                  scrollSnapAlign: "start",
                  position: "relative",
                }}
              >
                <img
                  id={"isv2-ms-0"}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={"/assets/design/img9.jpg"}
                  alt={"Marble vessel sinks"}
                  decoding={"async"}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "8px",
                    bottom: "8px",
                    maxWidth: "calc(100% - 16px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "3px",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      alignSelf: "flex-start",
                      padding: "4px 7px",
                      borderRadius: "5px",
                      background: "#a1563f",
                      color: "#fff",
                      font: "700 8px 'JetBrains Mono',monospace",
                      letterSpacing: "1.2px",
                    }}
                  >
                    {"SELECTED WORK"}
                  </span>
                  <span
                    style={{
                      alignSelf: "flex-start",
                      padding: "5px 8px",
                      borderRadius: "6px",
                      background: "rgba(15,14,13,.78)",
                      color: "#f6efdd",
                      font: "400 9px 'JetBrains Mono',monospace",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    {"Marble vessel sinks"}
                  </span>
                </span>
              </a>
              <a
                href={"#work"}
                style={{
                  flex: "none",
                  width: "150px",
                  aspectRatio: "4/5",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "#2a2620",
                  scrollSnapAlign: "start",
                  position: "relative",
                }}
              >
                <img
                  id={"isv2-ms-1"}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={"/assets/design/img7.jpg"}
                  alt={"Marble alcove"}
                  decoding={"async"}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "8px",
                    bottom: "8px",
                    maxWidth: "calc(100% - 16px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "3px",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      alignSelf: "flex-start",
                      padding: "4px 7px",
                      borderRadius: "5px",
                      background: "#a1563f",
                      color: "#fff",
                      font: "700 8px 'JetBrains Mono',monospace",
                      letterSpacing: "1.2px",
                    }}
                  >
                    {"SELECTED WORK"}
                  </span>
                  <span
                    style={{
                      alignSelf: "flex-start",
                      padding: "5px 8px",
                      borderRadius: "6px",
                      background: "rgba(15,14,13,.78)",
                      color: "#f6efdd",
                      font: "400 9px 'JetBrains Mono',monospace",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    {"Marble alcove"}
                  </span>
                </span>
              </a>
              <a
                href={"#work"}
                style={{
                  flex: "none",
                  width: "150px",
                  aspectRatio: "4/5",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "#2a2620",
                  scrollSnapAlign: "start",
                  position: "relative",
                }}
              >
                <img
                  id={"isv2-ms-2"}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={"/assets/design/img6.jpg"}
                  alt={"Granite countertop"}
                  decoding={"async"}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "8px",
                    bottom: "8px",
                    maxWidth: "calc(100% - 16px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "3px",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      alignSelf: "flex-start",
                      padding: "4px 7px",
                      borderRadius: "5px",
                      background: "#a1563f",
                      color: "#fff",
                      font: "700 8px 'JetBrains Mono',monospace",
                      letterSpacing: "1.2px",
                    }}
                  >
                    {"SELECTED WORK"}
                  </span>
                  <span
                    style={{
                      alignSelf: "flex-start",
                      padding: "5px 8px",
                      borderRadius: "6px",
                      background: "rgba(15,14,13,.78)",
                      color: "#f6efdd",
                      font: "400 9px 'JetBrains Mono',monospace",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    {"Granite countertop"}
                  </span>
                </span>
              </a>
              <a
                href={"#work"}
                style={{
                  flex: "none",
                  width: "150px",
                  aspectRatio: "4/5",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "#2a2620",
                  scrollSnapAlign: "start",
                  position: "relative",
                }}
              >
                <img
                  id={"isv2-ms-3"}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={"/assets/design/img15.jpg"}
                  alt={"Black marble bath"}
                  decoding={"async"}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "8px",
                    bottom: "8px",
                    maxWidth: "calc(100% - 16px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "3px",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      alignSelf: "flex-start",
                      padding: "4px 7px",
                      borderRadius: "5px",
                      background: "rgba(246,239,221,.9)",
                      color: "#2a2825",
                      font: "700 8px 'JetBrains Mono',monospace",
                      letterSpacing: "1.2px",
                    }}
                  >
                    {"DESIGN INSPIRATION"}
                  </span>
                  <span
                    style={{
                      alignSelf: "flex-start",
                      padding: "5px 8px",
                      borderRadius: "6px",
                      background: "rgba(15,14,13,.78)",
                      color: "#f6efdd",
                      font: "400 9px 'JetBrains Mono',monospace",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    {"Black marble bath"}
                  </span>
                </span>
              </a>
              <a
                href={"#work"}
                style={{
                  flex: "none",
                  width: "150px",
                  aspectRatio: "4/5",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "#2a2620",
                  scrollSnapAlign: "start",
                  position: "relative",
                }}
              >
                <img
                  id={"isv2-ms-4"}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={"/assets/design/img16.jpg"}
                  alt={"Calacatta gold bath"}
                  decoding={"async"}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "8px",
                    bottom: "8px",
                    maxWidth: "calc(100% - 16px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "3px",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      alignSelf: "flex-start",
                      padding: "4px 7px",
                      borderRadius: "5px",
                      background: "rgba(246,239,221,.9)",
                      color: "#2a2825",
                      font: "700 8px 'JetBrains Mono',monospace",
                      letterSpacing: "1.2px",
                    }}
                  >
                    {"DESIGN INSPIRATION"}
                  </span>
                  <span
                    style={{
                      alignSelf: "flex-start",
                      padding: "5px 8px",
                      borderRadius: "6px",
                      background: "rgba(15,14,13,.78)",
                      color: "#f6efdd",
                      font: "400 9px 'JetBrains Mono',monospace",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    {"Calacatta gold bath"}
                  </span>
                </span>
              </a>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <a
                  href={"#contact"}
                  data-cur={"GO"}
                  onMouseMove={v.magnet}
                  onMouseLeave={v.unmagnet}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px 26px",
                    borderRadius: "999px",
                    background: "#a1563f",
                    color: "#fff",
                    font: "700 16px 'Source Sans 3',sans-serif",
                    minHeight: "52px",
                    textDecoration: "none",
                    transition: "transform .4s cubic-bezier(.16,1,.3,1)",
                  }}
                >
                  {"Request an on-site estimate"}
                </a>
                <a
                  href={"tel:+16315305883"}
                  data-cur={"CALL"}
                  onMouseMove={v.magnet}
                  onMouseLeave={v.unmagnet}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px 26px",
                    borderRadius: "999px",
                    border: "1px solid #6b6459",
                    color: "#f6efdd",
                    font: "700 16px 'Source Sans 3',sans-serif",
                    minHeight: "52px",
                    textDecoration: "none",
                    transition: "transform .4s cubic-bezier(.16,1,.3,1)",
                  }}
                >
                  {"Call (631) 530-5883"}
                </a>
              </div>
              <a
                href={"https://www.instagram.com/jafettile____com/"}
                target={"_blank"}
                rel={"noopener noreferrer"}
                data-cur={"OPEN"}
                style={{
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.6px",
                  color: "#8d857a",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {"INSTAGRAM ↗"}
              </a>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px 20px",
                font: "400 10px 'JetBrains Mono',monospace",
                letterSpacing: "1.6px",
                color: "#8d857a",
                borderTop: "1px solid #322e28",
                paddingTop: "16px",
                marginTop: "-16px",
              }}
            >
              <span>{"DETAILED PLANNING"}</span>
              <span>{"CAREFUL INSTALLATION"}</span>
              <span>{"CLEAR WRITTEN ESTIMATES"}</span>
            </div>
            <p
              style={{
                margin: "-10px 0 0",
                font: "400 15px/1.5 'Source Sans 3',sans-serif",
                color: "#a89f92",
              }}
            >
              {
                "Estimates are written and itemized before work begins, and changes are discussed before additional work proceeds. "
              }
              <a href={"#work"} style={{ color: "#f6efdd" }}>
                {"View selected work →"}
              </a>
            </p>
          </div>
          <div
            data-rv={""}
            data-hero-img={""}
            data-cur={"VIEW"}
            style={{
              position: "relative",
              borderRadius: "18px",
              overflow: "hidden",
              background: "#2a2825",
              minHeight: "min(78vh,760px)",
              isolation: "isolate",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "0",
                display: "flex",
                gap: "10px",
                padding: "0 10px",
                alignItems: "flex-start",
              }}
            >
              <div
                data-vcol={""}
                style={{
                  flex: "1",
                  minWidth: "0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "0vh",
                  animation: "vscroll3 70s linear infinite",
                  willChange: "transform",
                }}
                className={"design-effect-1"}
              >
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "4/5",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-2"}
                >
                  <img
                    id={"isv2-vg-a0"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img9.jpg"}
                    alt={"Marble vessel sinks · completed"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Marble vessel sinks · completed"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "1/1",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-3"}
                >
                  <img
                    id={"isv2-vg-a1"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img15.jpg"}
                    alt={"Black marble bath"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Black marble bath"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "3/4",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-4"}
                >
                  <img
                    id={"isv2-vg-a2"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img7.jpg"}
                    alt={"Marble alcove · completed"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Marble alcove · completed"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "4/5",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-5"}
                >
                  <img
                    id={"isv2-vg-a3"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img14.jpg"}
                    alt={"Setting large-format tile"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Setting large-format tile"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "4/5",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-6"}
                >
                  <img
                    id={"isv2-vg-a4"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img9.jpg"}
                    alt={"Marble vessel sinks · completed"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Marble vessel sinks · completed"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "1/1",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-7"}
                >
                  <img
                    id={"isv2-vg-a5"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img15.jpg"}
                    alt={"Black marble bath"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Black marble bath"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "3/4",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-8"}
                >
                  <img
                    id={"isv2-vg-a6"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img7.jpg"}
                    alt={"Marble alcove · completed"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Marble alcove · completed"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "4/5",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-9"}
                >
                  <img
                    id={"isv2-vg-a7"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img14.jpg"}
                    alt={"Setting large-format tile"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Setting large-format tile"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "4/5",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-10"}
                >
                  <img
                    id={"isv2-vg-a8"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img9.jpg"}
                    alt={"Marble vessel sinks · completed"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Marble vessel sinks · completed"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "1/1",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-11"}
                >
                  <img
                    id={"isv2-vg-a9"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img15.jpg"}
                    alt={"Black marble bath"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Black marble bath"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "3/4",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-12"}
                >
                  <img
                    id={"isv2-vg-a10"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img7.jpg"}
                    alt={"Marble alcove · completed"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Marble alcove · completed"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "4/5",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-13"}
                >
                  <img
                    id={"isv2-vg-a11"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img14.jpg"}
                    alt={"Setting large-format tile"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Setting large-format tile"}
                    </span>
                  </span>
                </a>
              </div>
              <div
                data-vcol={""}
                style={{
                  flex: "1",
                  minWidth: "0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "-18vh",
                  animation: "vscroll3 52s linear infinite reverse",
                  willChange: "transform",
                }}
                className={"design-effect-14"}
              >
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "3/4",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-15"}
                >
                  <img
                    id={"isv2-vg-b0"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img6.jpg"}
                    alt={"Granite countertop · in progress"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Granite countertop · in progress"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "1/1",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-16"}
                >
                  <img
                    id={"isv2-vg-b1"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img16.jpg"}
                    alt={"Calacatta gold bath"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Calacatta gold bath"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "2/3",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-17"}
                >
                  <img
                    id={"isv2-vg-b2"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img17.jpg"}
                    alt={"Marble foyer inlay"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Marble foyer inlay"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "4/5",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-18"}
                >
                  <img
                    id={"isv2-vg-b3"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img5.jpg"}
                    alt={"The crew, mid-set"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"The crew, mid-set"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "3/4",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-19"}
                >
                  <img
                    id={"isv2-vg-b4"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img6.jpg"}
                    alt={"Granite countertop · in progress"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Granite countertop · in progress"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "1/1",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-20"}
                >
                  <img
                    id={"isv2-vg-b5"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img16.jpg"}
                    alt={"Calacatta gold bath"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Calacatta gold bath"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "2/3",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-21"}
                >
                  <img
                    id={"isv2-vg-b6"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img17.jpg"}
                    alt={"Marble foyer inlay"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Marble foyer inlay"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "4/5",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-22"}
                >
                  <img
                    id={"isv2-vg-b7"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img5.jpg"}
                    alt={"The crew, mid-set"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"The crew, mid-set"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "3/4",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-23"}
                >
                  <img
                    id={"isv2-vg-b8"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img6.jpg"}
                    alt={"Granite countertop · in progress"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Granite countertop · in progress"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "1/1",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-24"}
                >
                  <img
                    id={"isv2-vg-b9"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img16.jpg"}
                    alt={"Calacatta gold bath"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Calacatta gold bath"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "2/3",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-25"}
                >
                  <img
                    id={"isv2-vg-b10"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img17.jpg"}
                    alt={"Marble foyer inlay"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Marble foyer inlay"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "4/5",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-26"}
                >
                  <img
                    id={"isv2-vg-b11"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img5.jpg"}
                    alt={"The crew, mid-set"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"The crew, mid-set"}
                    </span>
                  </span>
                </a>
              </div>
              <div
                data-vcol={""}
                style={{
                  flex: "1",
                  minWidth: "0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "-40vh",
                  animation: "vscroll3 88s linear infinite",
                  willChange: "transform",
                }}
                className={"design-effect-27"}
              >
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "1/1",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-28"}
                >
                  <img
                    id={"isv2-vg-c0"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img24.jpg"}
                    alt={"Setting stone pavers"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Setting stone pavers"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "4/5",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-29"}
                >
                  <img
                    id={"isv2-vg-c1"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img23.jpg"}
                    alt={"Cutting tile on site"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Cutting tile on site"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "3/4",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-30"}
                >
                  <img
                    id={"isv2-vg-c2"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img9.jpg"}
                    alt={"Marble vessel sinks"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Marble vessel sinks"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "2/3",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-31"}
                >
                  <img
                    id={"isv2-vg-c3"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img22.jpg"}
                    alt={"Hand-set floor"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Hand-set floor"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "1/1",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-32"}
                >
                  <img
                    id={"isv2-vg-c4"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img24.jpg"}
                    alt={"Setting stone pavers"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Setting stone pavers"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "4/5",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-33"}
                >
                  <img
                    id={"isv2-vg-c5"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img23.jpg"}
                    alt={"Cutting tile on site"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Cutting tile on site"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "3/4",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-34"}
                >
                  <img
                    id={"isv2-vg-c6"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img9.jpg"}
                    alt={"Marble vessel sinks"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Marble vessel sinks"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "2/3",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-35"}
                >
                  <img
                    id={"isv2-vg-c7"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img22.jpg"}
                    alt={"Hand-set floor"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Hand-set floor"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "1/1",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-36"}
                >
                  <img
                    id={"isv2-vg-c8"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img24.jpg"}
                    alt={"Setting stone pavers"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Setting stone pavers"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "4/5",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-37"}
                >
                  <img
                    id={"isv2-vg-c9"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img23.jpg"}
                    alt={"Cutting tile on site"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Cutting tile on site"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "3/4",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-38"}
                >
                  <img
                    id={"isv2-vg-c10"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img9.jpg"}
                    alt={"Marble vessel sinks"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "#a1563f",
                        color: "#fff",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"SELECTED WORK"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Marble vessel sinks"}
                    </span>
                  </span>
                </a>
                <a
                  href={"#work"}
                  data-cur={"VIEW"}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: "none",
                    aspectRatio: "2/3",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#2a2620",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }}
                  className={"design-effect-39"}
                >
                  <img
                    id={"isv2-vg-c11"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img22.jpg"}
                    alt={"Hand-set floor"}
                    decoding={"async"}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      bottom: "8px",
                      maxWidth: "calc(100% - 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "4px 7px",
                        borderRadius: "5px",
                        background: "rgba(246,239,221,.9)",
                        color: "#2a2825",
                        font: "700 8px 'JetBrains Mono',monospace",
                        letterSpacing: "1.2px",
                      }}
                    >
                      {"DESIGN INSPIRATION"}
                    </span>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(15,14,13,.78)",
                        color: "#f6efdd",
                        font: "400 9px 'JetBrains Mono',monospace",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {"Hand-set floor"}
                    </span>
                  </span>
                </a>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                inset: "0",
                background:
                  "linear-gradient(rgba(26,24,21,.95) 0%,transparent 22%,transparent 58%,rgba(26,24,21,.97) 100%)",
                pointerEvents: "none",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                padding: "18px 20px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
                justifyContent: "space-between",
                pointerEvents: "none",
                color: "#f6efdd",
              }}
            >
              <span style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <span
                  style={{
                    padding: "8px 12px",
                    borderRadius: "999px",
                    border: "1px solid rgba(246,239,221,.28)",
                    background: "rgba(26,24,21,.55)",
                    backdropFilter: "blur(8px)",
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                  }}
                >
                  <span data-count={"25"}>{"0"}</span>
                  {"+ YEARS"}
                </span>
                <span
                  style={{
                    padding: "8px 12px",
                    borderRadius: "999px",
                    border: "1px solid rgba(246,239,221,.28)",
                    background: "rgba(26,24,21,.55)",
                    backdropFilter: "blur(8px)",
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                  }}
                >
                  <a
                    href={
                      "https://www.angi.com/companylist/us/ny/highland-mills/jafet-home-improvement-reviews-1.htm"
                    }
                    target={"_blank"}
                    rel={"noopener noreferrer"}
                    style={{
                      color: "#f6efdd",
                      textDecoration: "none",
                      pointerEvents: "auto",
                    }}
                  >
                    {"BRENTWOOD, NY"}
                  </a>
                </span>
              </span>
              <span
                style={{
                  padding: "8px 12px",
                  borderRadius: "999px",
                  background: "#a1563f",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#fff",
                  }}
                ></span>
                {"LIVE FROM THE JOB SITE"}
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                left: "0",
                right: "0",
                bottom: "0",
                padding: "20px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "14px",
                color: "#f6efdd",
              }}
            >
              <a
                href={"#work"}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  color: "#f6efdd",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#d9a58f",
                  }}
                >
                  {"OUR WORK"}
                </span>
                <span
                  style={{
                    font: "400 clamp(24px,2.2vw,32px)/1 'Instrument Serif',serif",
                  }}
                >
                  {"Our jobs, and the finish we work to"}
                </span>
                <span
                  style={{
                    display: "flex",
                    gap: "12px",
                    font: "400 9px 'JetBrains Mono',monospace",
                    letterSpacing: "1.2px",
                    color: "#a89f92",
                    marginTop: "4px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "2px",
                        background: "#a1563f",
                      }}
                    ></span>
                    {"OUR WORK"}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "2px",
                        background: "#f6efdd",
                      }}
                    ></span>
                    {"DESIGN INSPIRATION"}
                  </span>
                </span>
              </a>
              <a
                href={"#work"}
                data-cur={"VIEW"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 18px",
                  borderRadius: "999px",
                  border: "1px solid rgba(246,239,221,.45)",
                  color: "#f6efdd",
                  textDecoration: "none",
                  font: "700 14px 'Source Sans 3',sans-serif",
                }}
              >
                {"View selected work →"}
              </a>
            </div>
          </div>
        </section>
        <div
          style={{
            position: "relative",
            zIndex: "2",
            background: "#f6efdd",
            boxShadow: "0 -40px 80px rgba(0,0,0,.35)",
          }}
        >
          <div
            style={{
              background: "#1c1a17",
              color: "#8d857a",
              borderTop: "2px solid #a1563f",
              borderBottom: "1px solid #322e28",
              overflow: "hidden",
              padding: "12px 0",
            }}
          >
            <div
              data-ticker=""
              style={{
                display: "flex",
                width: "max-content",
                animation: "none",
                font: "400 11px 'JetBrains Mono',monospace",
                letterSpacing: "1.8px",
              }}
            >
              <div
                style={{ display: "flex", gap: "28px", paddingRight: "28px" }}
              >
                <span style={{ color: "#a1563f" }}>{"TILE INSTALLATION"}</span>
                <span>{"//"}</span>
                <span>{"GRANITE COUNTERTOPS"}</span>
                <span>{"//"}</span>
                <span style={{ color: "#f6efdd" }}>{"MARBLE BATHROOMS"}</span>
                <span>{"//"}</span>
                <span>{"BRENTWOOD"}</span>
                <span>{"//"}</span>
                <span>{"NASSAU COUNTY"}</span>
                <span>{"//"}</span>
                <span>{"SUFFOLK COUNTY"}</span>
                <span>{"//"}</span>
                <span style={{ color: "#a1563f" }}>{"THE HAMPTONS"}</span>
                <span>{"//"}</span>
                <span>{"NEW YORK CITY"}</span>
                <span>{"//"}</span>
                <span style={{ color: "#f6efdd" }}>{"LONG ISLAND"}</span>
                <span>{"//"}</span>
                <span>{"MON–SAT 7:00–18:30"}</span>
                <span>{"//"}</span>
              </div>
              <div
                style={{ display: "flex", gap: "28px", paddingRight: "28px" }}
                aria-hidden={"true"}
              >
                <span style={{ color: "#a1563f" }}>{"TILE INSTALLATION"}</span>
                <span>{"//"}</span>
                <span>{"GRANITE COUNTERTOPS"}</span>
                <span>{"//"}</span>
                <span style={{ color: "#f6efdd" }}>{"MARBLE BATHROOMS"}</span>
                <span>{"//"}</span>
                <span>{"BRENTWOOD"}</span>
                <span>{"//"}</span>
                <span>{"NASSAU COUNTY"}</span>
                <span>{"//"}</span>
                <span>{"SUFFOLK COUNTY"}</span>
                <span>{"//"}</span>
                <span style={{ color: "#a1563f" }}>{"THE HAMPTONS"}</span>
                <span>{"//"}</span>
                <span>{"NEW YORK CITY"}</span>
                <span>{"//"}</span>
                <span>{"MON–SAT 7:00–18:30"}</span>
                <span>{"//"}</span>
              </div>
            </div>
          </div>
          <section
            data-agent={"firm"}
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "clamp(100px,14vw,200px) 28px",
              display: "flex",
              flexDirection: "column",
              gap: "56px",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                font: "400 10px 'JetBrains Mono',monospace",
                letterSpacing: "1.8px",
                color: "#a1563f",
              }}
            >
              <span
                style={{ width: "26px", height: "2px", background: "#a1563f" }}
              ></span>
              {"[ 00 // THE FIRM ]"}
            </span>
            <p
              data-words={""}
              style={{
                margin: "0",
                maxWidth: "26ch",
                font: "400 clamp(40px,5.8vw,86px)/1.02 'Instrument Serif',serif",
                letterSpacing: "-0.035em",
                color: "#2a2825",
              }}
            >
              {
                "Tile, marble and stone for Long Island homes — planned carefully, installed precisely, finished to belong."
              }
            </p>
            <div
              data-rv={""}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                borderTop: "1px solid #2a2825",
                opacity: "0",
                transform: "translateY(40px)",
                transition:
                  "opacity 1s cubic-bezier(.16,1,.3,1) .15s,transform 1s cubic-bezier(.16,1,.3,1) .15s",
              }}
            >
              <div
                style={{
                  padding: "22px 24px 0 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#6b6459",
                  }}
                >
                  {"EXPERIENCE"}
                </span>
                <span style={{ font: "400 30px 'Instrument Serif',serif" }}>
                  <span data-count={"25"}>{"0"}</span>
                  {"+ years"}
                </span>
              </div>
              <div
                style={{
                  padding: "22px 24px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#6b6459",
                  }}
                >
                  {"OUR FOCUS"}
                </span>
                <span style={{ font: "400 30px 'Instrument Serif',serif" }}>
                  <span>Craft</span>
                  {" in every detail"}
                </span>
              </div>
              <div
                style={{
                  padding: "22px 24px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#6b6459",
                  }}
                >
                  {"TERRITORY"}
                </span>
                <span style={{ font: "400 30px 'Instrument Serif',serif" }}>
                  {"NY & Long Island"}
                </span>
              </div>
              <div
                style={{
                  padding: "22px 0 0 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#6b6459",
                  }}
                >
                  {"BASED IN"}
                </span>
                <span style={{ font: "400 30px 'Instrument Serif',serif" }}>
                  {"New York"}
                </span>
              </div>
            </div>
          </section>
        </div>
        <section
          id={"services"}
          data-stack={""}
          data-agent={"services"}
          style={{ position: "relative", zIndex: "3" }}
        >
          <div
            data-panel={""}
            style={{
              position: "sticky",
              top: "0",
              minHeight: "100vh",
              background: "#f6efdd",
              color: "#2a2825",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
              alignItems: "center",
              gap: "clamp(30px,5vw,80px)",
              padding:
                "clamp(100px,12vh,140px) clamp(28px,5vw,80px) clamp(60px,8vh,100px)",
              borderTop: "1px solid #ddd6ca",
              transformOrigin: "50% 0",
              willChange: "transform",
            }}
          >
            <div
              data-shade={""}
              style={{
                position: "absolute",
                inset: "0",
                background: "#1c1a17",
                opacity: "0",
                pointerEvents: "none",
                willChange: "opacity",
              }}
            ></div>
            <div
              data-rv=""
              data-block-reveal=""
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "22px",
                minWidth: "0",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.8px",
                  color: "#a1563f",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "2px",
                    background: "#a1563f",
                  }}
                ></span>
                {"[ 01 // SERVICES ]"}
              </span>
              <span
                style={{
                  font: "400 clamp(90px,14vw,200px)/0.8 'Instrument Serif',serif",
                  letterSpacing: "-0.05em",
                  color: "transparent",
                  WebkitTextStroke: "1px #2a2825",
                }}
              >
                {"01"}
              </span>
              <h2
                style={{
                  margin: "0",
                  font: "400 clamp(44px,6vw,92px)/0.9 'Instrument Serif',serif",
                  letterSpacing: "-0.04em",
                }}
              >
                {"Tile Installation"}
              </h2>
              <p
                style={{
                  margin: "0",
                  maxWidth: "44ch",
                  font: "400 clamp(17px,1.4vw,20px)/1.55 'Source Sans 3',sans-serif",
                  color: "#5a544b",
                }}
              >
                {
                  "Porcelain, ceramic and mosaic for bathrooms, kitchens and floors. Layout is planned before the first tile is set, and the substrate is checked before installation begins."
                }
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 14px",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.4px",
                  textTransform: "uppercase",
                  color: "#6b6459",
                }}
              >
                <span>{"Careful layout"}</span>
                <span>{"·"}</span>
                <span>{"Aligned joints"}</span>
                <span>{"·"}</span>
                <span>{"Considered finishing"}</span>
              </div>
            </div>
            <div
              data-cur={"VIEW"}
              style={{
                aspectRatio: "4/5",
                maxHeight: "70vh",
                background: "#e6e1d9",
                overflow: "hidden",
                position: "relative",
                justifySelf: "end",
                width: "100%",
                maxWidth: "520px",
              }}
            >
              <div
                data-plx={"0.06"}
                style={{ position: "absolute", inset: "-8% 0" }}
              >
                <img
                  id={"isv2-svc-tile"}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={"/assets/design/img14.jpg"}
                  alt={"Tile installation — setting large-format tile"}
                  decoding={"async"}
                />
              </div>
            </div>
          </div>
          <div
            data-panel={""}
            style={{
              position: "sticky",
              top: "0",
              minHeight: "100vh",
              background: "#2a2825",
              color: "#f6efdd",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
              alignItems: "center",
              gap: "clamp(30px,5vw,80px)",
              padding:
                "clamp(100px,12vh,140px) clamp(28px,5vw,80px) clamp(60px,8vh,100px)",
              transformOrigin: "50% 0",
              willChange: "transform",
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          >
            <div
              data-shade={""}
              style={{
                position: "absolute",
                inset: "0",
                background: "#1c1a17",
                opacity: "0",
                pointerEvents: "none",
                willChange: "opacity",
              }}
            ></div>
            <div
              data-rv=""
              data-block-reveal=""
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "22px",
                minWidth: "0",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.8px",
                  color: "#a1563f",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "2px",
                    background: "#a1563f",
                  }}
                ></span>
                {"[ 01 // SERVICES ]"}
              </span>
              <span
                style={{
                  font: "400 clamp(90px,14vw,200px)/0.8 'Instrument Serif',serif",
                  letterSpacing: "-0.05em",
                  color: "transparent",
                  WebkitTextStroke: "1px #f6efdd",
                }}
              >
                {"02"}
              </span>
              <h2
                style={{
                  margin: "0",
                  font: "400 clamp(44px,6vw,92px)/0.9 'Instrument Serif',serif",
                  letterSpacing: "-0.04em",
                }}
              >
                {"Granite Installation"}
              </h2>
              <p
                style={{
                  margin: "0",
                  maxWidth: "44ch",
                  font: "400 clamp(17px,1.4vw,20px)/1.55 'Source Sans 3',sans-serif",
                  color: "#d6cfc4",
                }}
              >
                {
                  "Countertops, islands and vanity tops templated to the room, with edges and seams finished to match."
                }
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 14px",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.4px",
                  textTransform: "uppercase",
                  color: "#a89f92",
                }}
              >
                <span>{"Kitchens & baths"}</span>
                <span>{"·"}</span>
                <span>{"Templated to fit"}</span>
                <span>{"·"}</span>
                <span>{"Sealed and finished"}</span>
              </div>
            </div>
            <div
              data-cur={"VIEW"}
              style={{
                aspectRatio: "4/5",
                maxHeight: "70vh",
                background: "#1e1c19",
                overflow: "hidden",
                position: "relative",
                justifySelf: "end",
                width: "100%",
                maxWidth: "520px",
              }}
            >
              <div
                data-plx={"0.06"}
                style={{ position: "absolute", inset: "-8% 0" }}
              >
                <img
                  id={"isv2-svc-granite"}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={"/assets/design/img6.jpg"}
                  alt={"Granite countertop in progress"}
                  decoding={"async"}
                />
              </div>
            </div>
          </div>
          <div
            data-panel={""}
            style={{
              position: "sticky",
              top: "0",
              minHeight: "100vh",
              background: "#efeae1",
              color: "#2a2825",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
              alignItems: "center",
              gap: "clamp(30px,5vw,80px)",
              padding:
                "clamp(100px,12vh,140px) clamp(28px,5vw,80px) clamp(60px,8vh,100px)",
              transformOrigin: "50% 0",
              willChange: "transform",
            }}
          >
            <div
              data-shade={""}
              style={{
                position: "absolute",
                inset: "0",
                background: "#1c1a17",
                opacity: "0",
                pointerEvents: "none",
                willChange: "opacity",
              }}
            ></div>
            <div
              data-rv=""
              data-block-reveal=""
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "22px",
                minWidth: "0",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.8px",
                  color: "#a1563f",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "2px",
                    background: "#a1563f",
                  }}
                ></span>
                {"[ 01 // SERVICES ]"}
              </span>
              <span
                style={{
                  font: "400 clamp(90px,14vw,200px)/0.8 'Instrument Serif',serif",
                  letterSpacing: "-0.05em",
                  color: "transparent",
                  WebkitTextStroke: "1px #2a2825",
                }}
              >
                {"03"}
              </span>
              <h2
                style={{
                  margin: "0",
                  font: "400 clamp(44px,6vw,92px)/0.9 'Instrument Serif',serif",
                  letterSpacing: "-0.04em",
                }}
              >
                {"Marble Installation"}
              </h2>
              <p
                style={{
                  margin: "0",
                  maxWidth: "44ch",
                  font: "400 clamp(17px,1.4vw,20px)/1.55 'Source Sans 3',sans-serif",
                  color: "#5a544b",
                }}
              >
                {
                  "Slab showers, vanities and feature walls. Veining is matched where the stone allows, joints kept tight and level."
                }
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 14px",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.4px",
                  textTransform: "uppercase",
                  color: "#6b6459",
                }}
              >
                <span>{"Bookmatched where possible"}</span>
                <span>{"·"}</span>
                <span>{"Level, tight joints"}</span>
                <span>{"·"}</span>
                <span>{"Finished edges"}</span>
              </div>
            </div>
            <div
              data-cur={"VIEW"}
              style={{
                aspectRatio: "4/5",
                maxHeight: "70vh",
                background: "#e6e1d9",
                overflow: "hidden",
                position: "relative",
                justifySelf: "end",
                width: "100%",
                maxWidth: "520px",
              }}
            >
              <div
                data-plx={"0.06"}
                style={{ position: "absolute", inset: "-8% 0" }}
              >
                <img
                  id={"isv2-svc-marble"}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={"/assets/design/img7.jpg"}
                  alt={"Installed marble alcove"}
                  decoding={"async"}
                />
              </div>
            </div>
          </div>
          <div
            data-panel={""}
            style={{
              position: "sticky",
              top: "0",
              minHeight: "100vh",
              background: "#1c1a17",
              color: "#f6efdd",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
              alignItems: "center",
              gap: "clamp(30px,5vw,80px)",
              padding:
                "clamp(100px,12vh,140px) clamp(28px,5vw,80px) clamp(60px,8vh,100px)",
              transformOrigin: "50% 0",
              willChange: "transform",
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          >
            <div
              data-shade={""}
              style={{
                position: "absolute",
                inset: "0",
                background: "#1c1a17",
                opacity: "0",
                pointerEvents: "none",
                willChange: "opacity",
              }}
            ></div>
            <div
              data-rv=""
              data-block-reveal=""
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "22px",
                minWidth: "0",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.8px",
                  color: "#a1563f",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "2px",
                    background: "#a1563f",
                  }}
                ></span>
                {"[ 01 // SERVICES ]"}
              </span>
              <span
                style={{
                  font: "400 clamp(90px,14vw,200px)/0.8 'Instrument Serif',serif",
                  letterSpacing: "-0.05em",
                  color: "transparent",
                  WebkitTextStroke: "1px #f6efdd",
                }}
              >
                {"04"}
              </span>
              <h2
                style={{
                  margin: "0",
                  font: "400 clamp(44px,6vw,92px)/0.9 'Instrument Serif',serif",
                  letterSpacing: "-0.04em",
                }}
              >
                {"Floors & custom surfaces"}
              </h2>
              <p
                style={{
                  margin: "0",
                  maxWidth: "44ch",
                  font: "400 clamp(17px,1.4vw,20px)/1.55 'Source Sans 3',sans-serif",
                  color: "#d6cfc4",
                }}
              >
                {
                  "Large-format floors, fireplace surrounds, feature walls and other interior stone applications, laid out before the first piece is set."
                }
              </p>
              <p
                style={{
                  margin: "0",
                  maxWidth: "44ch",
                  font: "400 13px/1.5 'Source Sans 3',sans-serif",
                  color: "#8d857a",
                }}
              >
                {
                  "Additional capability: structural and foundation work on request."
                }
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 14px",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.4px",
                  textTransform: "uppercase",
                  color: "#a89f92",
                }}
              >
                <span>{"Layout planned first"}</span>
                <span>{"·"}</span>
                <span>{"Substrate checked"}</span>
                <span>{"·"}</span>
                <span>{"Clean transitions"}</span>
              </div>
              <a
                href={"tel:+16315305883"}
                data-cur={"CALL"}
                onMouseMove={v.magnet}
                onMouseLeave={v.unmagnet}
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 24px",
                  border: "1px solid #6b6459",
                  color: "#f6efdd",
                  font: "700 15px 'Source Sans 3',sans-serif",
                  minHeight: "48px",
                  textDecoration: "none",
                  transition: "transform .4s cubic-bezier(.16,1,.3,1)",
                  marginTop: "8px",
                }}
              >
                {"Not sure which? Call and ask"}
              </a>
            </div>
            <div
              data-cur={"VIEW"}
              style={{
                aspectRatio: "4/5",
                maxHeight: "70vh",
                background: "#1e1c19",
                overflow: "hidden",
                position: "relative",
                justifySelf: "end",
                width: "100%",
                maxWidth: "520px",
              }}
            >
              <div
                data-plx={"0.06"}
                style={{ position: "absolute", inset: "-8% 0" }}
              >
                <img
                  id={"isv2-svc-super"}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={"/assets/design/img8.jpg"}
                  alt={"Structural work on site"}
                  decoding={"async"}
                />
              </div>
            </div>
          </div>
        </section>
        <section
          id={"work"}
          data-hstrip={""}
          data-agent={"work"}
          style={{
            position: "relative",
            height: "380vh",
            background: "#1c1a17",
            color: "#f6efdd",
            zIndex: "4",
            boxShadow: "0 -40px 80px rgba(0,0,0,.35)",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: "0",
              height: "100vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              paddingTop: "clamp(90px,12vh,120px)",
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          >
            <div
              style={{
                flex: "none",
                padding: "0 28px",
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                alignItems: "flex-end",
                justifyContent: "space-between",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.8px",
                    color: "#a1563f",
                  }}
                >
                  <span
                    style={{
                      width: "26px",
                      height: "2px",
                      background: "#a1563f",
                    }}
                  ></span>
                  {"[ 02 // WORK ]"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    font: "400 clamp(44px,6.4vw,96px)/0.88 'Instrument Serif',serif",
                    letterSpacing: "-0.045em",
                  }}
                >
                  {"Our work"}
                </h2>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "6px",
                }}
              >
                <span
                  data-hcount={""}
                  style={{
                    font: "400 clamp(28px,3vw,44px)/1 'Instrument Serif',serif",
                  }}
                >
                  {"01 "}
                  <span style={{ color: "#6b6459" }}>{"/ 06"}</span>
                </span>
                <span
                  style={{
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#8d857a",
                  }}
                >
                  {"SCROLL TO MOVE →"}
                </span>
              </div>
            </div>
            <div
              data-htrack={""}
              style={{
                display: "flex",
                gap: "clamp(20px,3vw,48px)",
                alignItems: "flex-start",
                padding: "0 28px",
                width: "max-content",
                willChange: "transform",
                flex: "1",
                minHeight: "0",
                margin: "clamp(20px,4vh,48px) 0 clamp(56px,9vh,80px)",
              }}
            >
              <figure
                data-cur={"VIEW"}
                style={{
                  margin: "0",
                  flex: "none",
                  display: "inline-flex",
                  flexDirection: "column",
                  gap: "14px",
                  width: "max-content",
                  maxWidth: "80vw",
                }}
              >
                <div
                  style={{
                    height: "clamp(180px,calc(100vh - 360px),520px)",
                    width: "auto",
                    minWidth: "240px",
                    aspectRatio: "3/2",
                    background: "#1e1c19",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    id={"isv2-w1"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img9.jpg"}
                    alt={"marble-horizontal3-scaled.jpg"}
                    decoding={"async"}
                  />
                </div>
                <figcaption
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "baseline",
                    borderTop: "1px solid #322e28",
                    paddingTop: "12px",
                    width: "0",
                    minWidth: "100%",
                  }}
                >
                  <span
                    style={{
                      font: "400 15px/1.35 'Source Sans 3',sans-serif",
                      color: "#d6cfc4",
                      minWidth: "0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <span
                      style={{
                        font: "400 10px 'JetBrains Mono',monospace",
                        letterSpacing: "1.4px",
                        color: "#a1563f",
                        marginRight: "10px",
                      }}
                    >
                      {"01"}
                    </span>
                    {"Dual carved marble sinks with matching backsplash"}
                  </span>
                  <span
                    style={{
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      color: "#8d857a",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {"MARBLE"}
                  </span>
                </figcaption>
              </figure>
              <figure
                data-cur={"VIEW"}
                style={{
                  margin: "0",
                  flex: "none",
                  display: "inline-flex",
                  flexDirection: "column",
                  gap: "14px",
                  width: "max-content",
                  maxWidth: "80vw",
                }}
              >
                <div
                  style={{
                    height: "clamp(180px,calc(100vh - 360px),520px)",
                    width: "auto",
                    minWidth: "240px",
                    aspectRatio: "4/5",
                    background: "#1e1c19",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    id={"isv2-w2"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img7.jpg"}
                    alt={"IMG_3566-scaled.jpeg"}
                    decoding={"async"}
                  />
                </div>
                <figcaption
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "baseline",
                    borderTop: "1px solid #322e28",
                    paddingTop: "12px",
                    width: "0",
                    minWidth: "100%",
                  }}
                >
                  <span
                    style={{
                      font: "400 15px/1.35 'Source Sans 3',sans-serif",
                      color: "#d6cfc4",
                      minWidth: "0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <span
                      style={{
                        font: "400 10px 'JetBrains Mono',monospace",
                        letterSpacing: "1.4px",
                        color: "#a1563f",
                        marginRight: "10px",
                      }}
                    >
                      {"02"}
                    </span>
                    {"The marble alcove"}
                  </span>
                  <span
                    style={{
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      color: "#8d857a",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {"MARBLE"}
                  </span>
                </figcaption>
              </figure>
              <figure
                data-cur={"VIEW"}
                style={{
                  margin: "0",
                  flex: "none",
                  display: "inline-flex",
                  flexDirection: "column",
                  gap: "14px",
                  width: "max-content",
                  maxWidth: "80vw",
                }}
              >
                <div
                  style={{
                    height: "clamp(180px,calc(100vh - 360px),520px)",
                    width: "auto",
                    minWidth: "240px",
                    aspectRatio: "4/3",
                    background: "#1e1c19",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    id={"isv2-w3"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img6.jpg"}
                    alt={"granite-horizontal-2-scaled.jpg"}
                    decoding={"async"}
                  />
                </div>
                <figcaption
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "baseline",
                    borderTop: "1px solid #322e28",
                    paddingTop: "12px",
                    width: "0",
                    minWidth: "100%",
                  }}
                >
                  <span
                    style={{
                      font: "400 15px/1.35 'Source Sans 3',sans-serif",
                      color: "#d6cfc4",
                      minWidth: "0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <span
                      style={{
                        font: "400 10px 'JetBrains Mono',monospace",
                        letterSpacing: "1.4px",
                        color: "#a1563f",
                        marginRight: "10px",
                      }}
                    >
                      {"03"}
                    </span>
                    {"L-shaped granite countertop"}
                  </span>
                  <span
                    style={{
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      color: "#8d857a",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {"GRANITE"}
                  </span>
                </figcaption>
              </figure>
              <figure
                data-cur={"VIEW"}
                style={{
                  margin: "0",
                  flex: "none",
                  display: "inline-flex",
                  flexDirection: "column",
                  gap: "14px",
                  width: "max-content",
                  maxWidth: "80vw",
                }}
              >
                <div
                  style={{
                    height: "clamp(180px,calc(100vh - 360px),520px)",
                    width: "auto",
                    minWidth: "240px",
                    aspectRatio: "4/5",
                    background: "#1e1c19",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    id={"isv2-w4"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img10.jpg"}
                    alt={"jafet-foundation-1.jpg"}
                    decoding={"async"}
                  />
                </div>
                <figcaption
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "baseline",
                    borderTop: "1px solid #322e28",
                    paddingTop: "12px",
                    width: "0",
                    minWidth: "100%",
                  }}
                >
                  <span
                    style={{
                      font: "400 15px/1.35 'Source Sans 3',sans-serif",
                      color: "#d6cfc4",
                      minWidth: "0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <span
                      style={{
                        font: "400 10px 'JetBrains Mono',monospace",
                        letterSpacing: "1.4px",
                        color: "#a1563f",
                        marginRight: "10px",
                      }}
                    >
                      {"04"}
                    </span>
                    {"Underpinning between NYC row houses"}
                  </span>
                  <span
                    style={{
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      color: "#8d857a",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {"ADDITIONAL WORK"}
                  </span>
                </figcaption>
              </figure>
              <figure
                data-cur={"VIEW"}
                style={{
                  margin: "0",
                  flex: "none",
                  display: "inline-flex",
                  flexDirection: "column",
                  gap: "14px",
                  width: "max-content",
                  maxWidth: "80vw",
                }}
              >
                <div
                  style={{
                    height: "clamp(180px,calc(100vh - 360px),520px)",
                    width: "auto",
                    minWidth: "240px",
                    aspectRatio: "3/2",
                    background: "#1e1c19",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    id={"isv2-w5"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img11.jpg"}
                    alt={"jafet_superstructure-1.jpg"}
                    decoding={"async"}
                  />
                </div>
                <figcaption
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "baseline",
                    borderTop: "1px solid #322e28",
                    paddingTop: "12px",
                    width: "0",
                    minWidth: "100%",
                  }}
                >
                  <span
                    style={{
                      font: "400 15px/1.35 'Source Sans 3',sans-serif",
                      color: "#d6cfc4",
                      minWidth: "0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <span
                      style={{
                        font: "400 10px 'JetBrains Mono',monospace",
                        letterSpacing: "1.4px",
                        color: "#a1563f",
                        marginRight: "10px",
                      }}
                    >
                      {"05"}
                    </span>
                    {"Rooftop-level concrete formwork"}
                  </span>
                  <span
                    style={{
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      color: "#8d857a",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {"ADDITIONAL WORK"}
                  </span>
                </figcaption>
              </figure>
              <figure
                data-cur={"VIEW"}
                style={{
                  margin: "0",
                  flex: "none",
                  display: "inline-flex",
                  flexDirection: "column",
                  gap: "14px",
                  width: "max-content",
                  maxWidth: "80vw",
                }}
              >
                <div
                  style={{
                    height: "clamp(180px,calc(100vh - 360px),520px)",
                    width: "auto",
                    minWidth: "240px",
                    aspectRatio: "4/5",
                    background: "#1e1c19",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    id={"isv2-w6"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img12.jpg"}
                    alt={"jafet-structure.jpg"}
                    decoding={"async"}
                  />
                </div>
                <figcaption
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "baseline",
                    borderTop: "1px solid #322e28",
                    paddingTop: "12px",
                    width: "0",
                    minWidth: "100%",
                  }}
                >
                  <span
                    style={{
                      font: "400 15px/1.35 'Source Sans 3',sans-serif",
                      color: "#d6cfc4",
                      minWidth: "0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <span
                      style={{
                        font: "400 10px 'JetBrains Mono',monospace",
                        letterSpacing: "1.4px",
                        color: "#a1563f",
                        marginRight: "10px",
                      }}
                    >
                      {"06"}
                    </span>
                    {"Excavation, wider angle"}
                  </span>
                  <span
                    style={{
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      color: "#8d857a",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {"ADDITIONAL WORK"}
                  </span>
                </figcaption>
              </figure>
              <div
                style={{
                  flex: "none",
                  width: "min(40vw,420px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  alignSelf: "center",
                }}
              >
                <span
                  style={{
                    font: "400 clamp(30px,3.4vw,48px)/1 'Instrument Serif',serif",
                  }}
                >
                  {"More on Instagram."}
                </span>
                <a
                  href={"https://www.instagram.com/jafettile____com/"}
                  target={"_blank"}
                  rel={"noopener noreferrer"}
                  data-cur={"OPEN"}
                  style={{
                    font: "400 11px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#f6efdd",
                    textDecoration: "none",
                    borderBottom: "1px solid #a1563f",
                    paddingBottom: "3px",
                    alignSelf: "flex-start",
                  }}
                >
                  {"@JAFETTILE____COM →"}
                </a>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                left: "28px",
                right: "28px",
                bottom: "clamp(24px,4vh,40px)",
                height: "1px",
                background: "#322e28",
              }}
            >
              <div
                data-hbar={""}
                style={{
                  height: "1px",
                  width: "0",
                  background: "#a1563f",
                  willChange: "width",
                }}
              ></div>
            </div>
          </div>
        </section>
        <div
          style={{
            position: "relative",
            zIndex: "5",
            background: "#f6efdd",
            overflow: "hidden",
            padding: "clamp(28px,4vw,56px) 0",
            borderBottom: "1px solid #ddd6ca",
            borderTop: "2px solid #a1563f",
          }}
        >
          <div
            data-vmarq={""}
            style={{
              display: "flex",
              width: "max-content",
              font: "400 clamp(64px,11vw,170px)/0.9 'Instrument Serif',serif",
              letterSpacing: "-0.04em",
              whiteSpace: "nowrap",
              willChange: "transform",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: ".35em",
                paddingRight: ".35em",
                alignItems: "baseline",
              }}
            >
              <span>{"Tile"}</span>
              <span style={{ color: "#a1563f" }}>{"—"}</span>
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px #2a2825",
                }}
              >
                {"Granite"}
              </span>
              <span style={{ color: "#a1563f" }}>{"—"}</span>
              <span>{"Marble"}</span>
              <span style={{ color: "#a1563f" }}>{"—"}</span>
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px #2a2825",
                  fontStyle: "italic",
                }}
              >
                {"Brentwood"}
              </span>
              <span style={{ color: "#a1563f" }}>{"—"}</span>
            </div>
            <div
              style={{
                display: "flex",
                gap: ".35em",
                paddingRight: ".35em",
                alignItems: "baseline",
              }}
              aria-hidden={"true"}
            >
              <span>{"Tile"}</span>
              <span style={{ color: "#a1563f" }}>{"—"}</span>
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px #2a2825",
                }}
              >
                {"Granite"}
              </span>
              <span style={{ color: "#a1563f" }}>{"—"}</span>
              <span>{"Marble"}</span>
              <span style={{ color: "#a1563f" }}>{"—"}</span>
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px #2a2825",
                  fontStyle: "italic",
                }}
              >
                {"Brentwood"}
              </span>
              <span style={{ color: "#a1563f" }}>{"—"}</span>
            </div>
          </div>
        </div>
        <section
          id={"reels"}
          data-agent={"reels"}
          data-reelstrip={""}
          style={{
            position: "relative",
            zIndex: "5",
            height: "420vh",
            background: "#1c1a17",
            color: "#f6efdd",
            borderTop: "1px solid #322e28",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: "0",
              height: "100vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          >
            <div
              data-reelghost={""}
              aria-hidden={"true"}
              style={{
                position: "absolute",
                left: "0",
                top: "50%",
                transform: "translateY(-50%)",
                whiteSpace: "nowrap",
                font: "400 clamp(160px,34vw,520px)/0.8 'Instrument Serif',serif",
                letterSpacing: "-0.06em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(246,239,221,.12)",
                pointerEvents: "none",
                willChange: "transform",
              }}
            >
              {"JOB SITE — JOB SITE — JOB SITE"}
            </div>
            <div
              style={{
                position: "absolute",
                top: "clamp(90px,12vh,120px)",
                left: "28px",
                right: "28px",
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                alignItems: "flex-end",
                justifyContent: "space-between",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.8px",
                    color: "#a1563f",
                  }}
                >
                  <span
                    style={{
                      width: "26px",
                      height: "2px",
                      background: "#a1563f",
                    }}
                  ></span>
                  {"[ 02b // FROM THE JOB SITE ]"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    font: "400 clamp(40px,5.4vw,80px)/0.92 'Instrument Serif',serif",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {"Reels from the job site"}
                </h2>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "8px",
                }}
              >
                <span
                  data-reelcount={""}
                  style={{
                    font: "400 clamp(28px,3vw,44px)/1 'Instrument Serif',serif",
                  }}
                >
                  {"01 "}
                  <span style={{ color: "#6b6459" }}>{"/ 08"}</span>
                </span>
                <span
                  style={{
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#8d857a",
                  }}
                >
                  {"SCROLL TO MOVE →"}
                </span>
              </div>
            </div>
            <div
              data-reeltrack={""}
              style={{
                display: "flex",
                gap: "clamp(20px,3vw,44px)",
                alignItems: "center",
                padding: "0 28px",
                width: "max-content",
                willChange: "transform",
                marginTop: "calc(clamp(90px,12vh,120px) + 60px)",
              }}
            >
              <figure
                data-reelcard={""}
                data-cur={"PLAY"}
                style={{
                  margin: "0",
                  flex: "none",
                  width: "min(78vw,320px,calc((100vh - 320px) * 9 / 16))",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  willChange: "transform,opacity",
                }}
              >
                <div
                  onClick={v.openReel}
                  onMouseEnter={v.previewOn}
                  onMouseLeave={v.previewOff}
                  data-video={"/uploads/reels/01-raising-the-bar.mp4"}
                  data-title={"Raising the bar, one beam at a time"}
                  role={"button"}
                  tabIndex={"0"}
                  aria-label={"Play: Raising the bar, one beam at a time"}
                  style={{
                    position: "relative",
                    aspectRatio: "3/4",
                    background: "#1e1c19",
                    overflow: "hidden",
                    border: "1px solid #322e28",
                    cursor: "pointer",
                  }}
                >
                  <div
                    data-plx={"0.05"}
                    style={{
                      position: "absolute",
                      inset: "-8% 0",
                      pointerEvents: "none",
                    }}
                  >
                    <img
                      id={"isv2-reel-0"}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={"/assets/design/vid0.jpg"}
                      alt={"Raising the bar, one beam at a time"}
                      decoding={"async"}
                    />
                  </div>
                  <video
                    data-preview={""}
                    muted={true}
                    loop={true}
                    playsInline={true}
                    preload={"none"}
                    data-src={"/uploads/reels/01-raising-the-bar.mp4"}
                    style={{
                      position: "absolute",
                      inset: "0",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: "0",
                      transition: "opacity .5s ease",
                      pointerEvents: "none",
                    }}
                  ></video>
                  <div
                    style={{
                      position: "absolute",
                      inset: "0",
                      background:
                        "linear-gradient(180deg,rgba(15,14,13,0) 40%,rgba(15,14,13,.78))",
                      pointerEvents: "none",
                    }}
                  ></div>
                  <div
                    data-playring={""}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: "72px",
                      height: "72px",
                      margin: "-36px 0 0 -36px",
                      borderRadius: "50%",
                      border: "1px solid rgba(246,239,221,.55)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(15,14,13,.45)",
                      pointerEvents: "none",
                      willChange: "transform",
                    }}
                  >
                    <span
                      style={{
                        width: "0",
                        height: "0",
                        borderLeft: "16px solid #f6efdd",
                        borderTop: "10px solid transparent",
                        borderBottom: "10px solid transparent",
                        marginLeft: "4px",
                      }}
                    ></span>
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 8px",
                      background: "#a1563f",
                      color: "#fff",
                      font: "700 9px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#fff",
                        animation: "pulseDot 1.2s infinite",
                      }}
                    ></span>
                    {"STRUCTURE"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      padding: "4px 7px",
                      background: "rgba(15,14,13,.7)",
                      color: "#f6efdd",
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    {"0:07"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      bottom: "12px",
                      font: "400 clamp(40px,5vw,72px)/0.8 'Instrument Serif',serif",
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(246,239,221,.7)",
                      pointerEvents: "none",
                    }}
                  >
                    {"01"}
                  </span>
                </div>
                <figcaption
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "baseline",
                    borderTop: "1px solid #322e28",
                    paddingTop: "10px",
                  }}
                >
                  <span
                    style={{
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      color: "#a1563f",
                      flex: "none",
                    }}
                  >
                    {"01"}
                  </span>
                  <span
                    style={{
                      font: "400 14px/1.35 'Source Sans 3',sans-serif",
                      color: "#d6cfc4",
                      flex: "1",
                      minWidth: "0",
                    }}
                  >
                    {"Raising the bar, one beam at a time"}
                  </span>
                </figcaption>
              </figure>
              <figure
                data-reelcard={""}
                data-cur={"PLAY"}
                style={{
                  margin: "0",
                  flex: "none",
                  width: "min(78vw,320px,calc((100vh - 320px) * 9 / 16))",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  willChange: "transform,opacity",
                }}
              >
                <div
                  onClick={v.openReel}
                  onMouseEnter={v.previewOn}
                  onMouseLeave={v.previewOff}
                  data-video={"/uploads/reels/02-crafted-with-precision.mp4"}
                  data-title={"Crafted with precision — marble detailing"}
                  role={"button"}
                  tabIndex={"0"}
                  aria-label={"Play: Crafted with precision — marble detailing"}
                  style={{
                    position: "relative",
                    aspectRatio: "9/16",
                    background: "#1e1c19",
                    overflow: "hidden",
                    border: "1px solid #322e28",
                    cursor: "pointer",
                  }}
                >
                  <div
                    data-plx={"0.05"}
                    style={{
                      position: "absolute",
                      inset: "-8% 0",
                      pointerEvents: "none",
                    }}
                  >
                    <img
                      id={"isv2-reel-1"}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={"/assets/design/vid1.jpg"}
                      alt={"Crafted with precision — marble detailing"}
                      decoding={"async"}
                    />
                  </div>
                  <video
                    data-preview={""}
                    muted={true}
                    loop={true}
                    playsInline={true}
                    preload={"none"}
                    data-src={"/uploads/reels/02-crafted-with-precision.mp4"}
                    style={{
                      position: "absolute",
                      inset: "0",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: "0",
                      transition: "opacity .5s ease",
                      pointerEvents: "none",
                    }}
                  ></video>
                  <div
                    style={{
                      position: "absolute",
                      inset: "0",
                      background:
                        "linear-gradient(180deg,rgba(15,14,13,0) 40%,rgba(15,14,13,.78))",
                      pointerEvents: "none",
                    }}
                  ></div>
                  <div
                    data-playring={""}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: "72px",
                      height: "72px",
                      margin: "-36px 0 0 -36px",
                      borderRadius: "50%",
                      border: "1px solid rgba(246,239,221,.55)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(15,14,13,.45)",
                      pointerEvents: "none",
                      willChange: "transform",
                    }}
                  >
                    <span
                      style={{
                        width: "0",
                        height: "0",
                        borderLeft: "16px solid #f6efdd",
                        borderTop: "10px solid transparent",
                        borderBottom: "10px solid transparent",
                        marginLeft: "4px",
                      }}
                    ></span>
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 8px",
                      background: "#a1563f",
                      color: "#fff",
                      font: "700 9px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#fff",
                        animation: "pulseDot 1.2s infinite",
                      }}
                    ></span>
                    {"MARBLE"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      padding: "4px 7px",
                      background: "rgba(15,14,13,.7)",
                      color: "#f6efdd",
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    {"0:17"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      bottom: "12px",
                      font: "400 clamp(40px,5vw,72px)/0.8 'Instrument Serif',serif",
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(246,239,221,.7)",
                      pointerEvents: "none",
                    }}
                  >
                    {"02"}
                  </span>
                </div>
                <figcaption
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "baseline",
                    borderTop: "1px solid #322e28",
                    paddingTop: "10px",
                  }}
                >
                  <span
                    style={{
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      color: "#a1563f",
                      flex: "none",
                    }}
                  >
                    {"02"}
                  </span>
                  <span
                    style={{
                      font: "400 14px/1.35 'Source Sans 3',sans-serif",
                      color: "#d6cfc4",
                      flex: "1",
                      minWidth: "0",
                    }}
                  >
                    {"Crafted with precision — marble detailing"}
                  </span>
                </figcaption>
              </figure>
              <figure
                data-reelcard={""}
                data-cur={"PLAY"}
                style={{
                  margin: "0",
                  flex: "none",
                  width: "min(78vw,320px,calc((100vh - 320px) * 9 / 16))",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  willChange: "transform,opacity",
                }}
              >
                <div
                  onClick={v.openReel}
                  onMouseEnter={v.previewOn}
                  onMouseLeave={v.previewOff}
                  data-video={"/uploads/reels/03-designing-tomorrow.mp4"}
                  data-title={"Designing tomorrow, building today"}
                  role={"button"}
                  tabIndex={"0"}
                  aria-label={"Play: Designing tomorrow, building today"}
                  style={{
                    position: "relative",
                    aspectRatio: "9/16",
                    background: "#1e1c19",
                    overflow: "hidden",
                    border: "1px solid #322e28",
                    cursor: "pointer",
                  }}
                >
                  <div
                    data-plx={"0.05"}
                    style={{
                      position: "absolute",
                      inset: "-8% 0",
                      pointerEvents: "none",
                    }}
                  >
                    <img
                      id={"isv2-reel-2"}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={"/assets/design/vid2.jpg"}
                      alt={"Designing tomorrow, building today"}
                      decoding={"async"}
                    />
                  </div>
                  <video
                    data-preview={""}
                    muted={true}
                    loop={true}
                    playsInline={true}
                    preload={"none"}
                    data-src={"/uploads/reels/03-designing-tomorrow.mp4"}
                    style={{
                      position: "absolute",
                      inset: "0",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: "0",
                      transition: "opacity .5s ease",
                      pointerEvents: "none",
                    }}
                  ></video>
                  <div
                    style={{
                      position: "absolute",
                      inset: "0",
                      background:
                        "linear-gradient(180deg,rgba(15,14,13,0) 40%,rgba(15,14,13,.78))",
                      pointerEvents: "none",
                    }}
                  ></div>
                  <div
                    data-playring={""}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: "72px",
                      height: "72px",
                      margin: "-36px 0 0 -36px",
                      borderRadius: "50%",
                      border: "1px solid rgba(246,239,221,.55)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(15,14,13,.45)",
                      pointerEvents: "none",
                      willChange: "transform",
                    }}
                  >
                    <span
                      style={{
                        width: "0",
                        height: "0",
                        borderLeft: "16px solid #f6efdd",
                        borderTop: "10px solid transparent",
                        borderBottom: "10px solid transparent",
                        marginLeft: "4px",
                      }}
                    ></span>
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 8px",
                      background: "#a1563f",
                      color: "#fff",
                      font: "700 9px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#fff",
                        animation: "pulseDot 1.2s infinite",
                      }}
                    ></span>
                    {"DEMOLITION"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      padding: "4px 7px",
                      background: "rgba(15,14,13,.7)",
                      color: "#f6efdd",
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    {"0:06"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      bottom: "12px",
                      font: "400 clamp(40px,5vw,72px)/0.8 'Instrument Serif',serif",
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(246,239,221,.7)",
                      pointerEvents: "none",
                    }}
                  >
                    {"03"}
                  </span>
                </div>
                <figcaption
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "baseline",
                    borderTop: "1px solid #322e28",
                    paddingTop: "10px",
                  }}
                >
                  <span
                    style={{
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      color: "#a1563f",
                      flex: "none",
                    }}
                  >
                    {"03"}
                  </span>
                  <span
                    style={{
                      font: "400 14px/1.35 'Source Sans 3',sans-serif",
                      color: "#d6cfc4",
                      flex: "1",
                      minWidth: "0",
                    }}
                  >
                    {"Designing tomorrow, building today"}
                  </span>
                </figcaption>
              </figure>
              <figure
                data-reelcard={""}
                data-cur={"PLAY"}
                style={{
                  margin: "0",
                  flex: "none",
                  width: "min(78vw,320px,calc((100vh - 320px) * 9 / 16))",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  willChange: "transform,opacity",
                }}
              >
                <div
                  onClick={v.openReel}
                  onMouseEnter={v.previewOn}
                  onMouseLeave={v.previewOff}
                  data-video={"/uploads/reels/04-floors-into-masterpieces.mp4"}
                  data-title={"Turning floors into masterpieces"}
                  role={"button"}
                  tabIndex={"0"}
                  aria-label={"Play: Turning floors into masterpieces"}
                  style={{
                    position: "relative",
                    aspectRatio: "9/16",
                    background: "#1e1c19",
                    overflow: "hidden",
                    border: "1px solid #322e28",
                    cursor: "pointer",
                  }}
                >
                  <div
                    data-plx={"0.05"}
                    style={{
                      position: "absolute",
                      inset: "-8% 0",
                      pointerEvents: "none",
                    }}
                  >
                    <img
                      id={"isv2-reel-3"}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={"/assets/design/vid3.jpg"}
                      alt={"Turning floors into masterpieces"}
                      decoding={"async"}
                    />
                  </div>
                  <video
                    data-preview={""}
                    muted={true}
                    loop={true}
                    playsInline={true}
                    preload={"none"}
                    data-src={"/uploads/reels/04-floors-into-masterpieces.mp4"}
                    style={{
                      position: "absolute",
                      inset: "0",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: "0",
                      transition: "opacity .5s ease",
                      pointerEvents: "none",
                    }}
                  ></video>
                  <div
                    style={{
                      position: "absolute",
                      inset: "0",
                      background:
                        "linear-gradient(180deg,rgba(15,14,13,0) 40%,rgba(15,14,13,.78))",
                      pointerEvents: "none",
                    }}
                  ></div>
                  <div
                    data-playring={""}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: "72px",
                      height: "72px",
                      margin: "-36px 0 0 -36px",
                      borderRadius: "50%",
                      border: "1px solid rgba(246,239,221,.55)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(15,14,13,.45)",
                      pointerEvents: "none",
                      willChange: "transform",
                    }}
                  >
                    <span
                      style={{
                        width: "0",
                        height: "0",
                        borderLeft: "16px solid #f6efdd",
                        borderTop: "10px solid transparent",
                        borderBottom: "10px solid transparent",
                        marginLeft: "4px",
                      }}
                    ></span>
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 8px",
                      background: "#a1563f",
                      color: "#fff",
                      font: "700 9px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#fff",
                        animation: "pulseDot 1.2s infinite",
                      }}
                    ></span>
                    {"TILE FLOOR"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      padding: "4px 7px",
                      background: "rgba(15,14,13,.7)",
                      color: "#f6efdd",
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    {"0:11"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      bottom: "12px",
                      font: "400 clamp(40px,5vw,72px)/0.8 'Instrument Serif',serif",
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(246,239,221,.7)",
                      pointerEvents: "none",
                    }}
                  >
                    {"04"}
                  </span>
                </div>
                <figcaption
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "baseline",
                    borderTop: "1px solid #322e28",
                    paddingTop: "10px",
                  }}
                >
                  <span
                    style={{
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      color: "#a1563f",
                      flex: "none",
                    }}
                  >
                    {"04"}
                  </span>
                  <span
                    style={{
                      font: "400 14px/1.35 'Source Sans 3',sans-serif",
                      color: "#d6cfc4",
                      flex: "1",
                      minWidth: "0",
                    }}
                  >
                    {"Turning floors into masterpieces"}
                  </span>
                </figcaption>
              </figure>
              <figure
                data-reelcard={""}
                data-cur={"PLAY"}
                style={{
                  margin: "0",
                  flex: "none",
                  width: "min(78vw,320px,calc((100vh - 320px) * 9 / 16))",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  willChange: "transform,opacity",
                }}
              >
                <div
                  onClick={v.openReel}
                  onMouseEnter={v.previewOn}
                  onMouseLeave={v.previewOff}
                  data-video={"/uploads/reels/05-crafting-elegance.mp4"}
                  data-title={"Crafting elegance, tile by tile — New York"}
                  role={"button"}
                  tabIndex={"0"}
                  aria-label={
                    "Play: Crafting elegance, tile by tile — New York"
                  }
                  style={{
                    position: "relative",
                    aspectRatio: "9/16",
                    background: "#1e1c19",
                    overflow: "hidden",
                    border: "1px solid #322e28",
                    cursor: "pointer",
                  }}
                >
                  <div
                    data-plx={"0.05"}
                    style={{
                      position: "absolute",
                      inset: "-8% 0",
                      pointerEvents: "none",
                    }}
                  >
                    <img
                      id={"isv2-reel-4"}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={"/assets/design/vid4.jpg"}
                      alt={"Crafting elegance, tile by tile — New York"}
                      decoding={"async"}
                    />
                  </div>
                  <video
                    data-preview={""}
                    muted={true}
                    loop={true}
                    playsInline={true}
                    preload={"none"}
                    data-src={"/uploads/reels/05-crafting-elegance.mp4"}
                    style={{
                      position: "absolute",
                      inset: "0",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: "0",
                      transition: "opacity .5s ease",
                      pointerEvents: "none",
                    }}
                  ></video>
                  <div
                    style={{
                      position: "absolute",
                      inset: "0",
                      background:
                        "linear-gradient(180deg,rgba(15,14,13,0) 40%,rgba(15,14,13,.78))",
                      pointerEvents: "none",
                    }}
                  ></div>
                  <div
                    data-playring={""}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: "72px",
                      height: "72px",
                      margin: "-36px 0 0 -36px",
                      borderRadius: "50%",
                      border: "1px solid rgba(246,239,221,.55)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(15,14,13,.45)",
                      pointerEvents: "none",
                      willChange: "transform",
                    }}
                  >
                    <span
                      style={{
                        width: "0",
                        height: "0",
                        borderLeft: "16px solid #f6efdd",
                        borderTop: "10px solid transparent",
                        borderBottom: "10px solid transparent",
                        marginLeft: "4px",
                      }}
                    ></span>
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 8px",
                      background: "#a1563f",
                      color: "#fff",
                      font: "700 9px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#fff",
                        animation: "pulseDot 1.2s infinite",
                      }}
                    ></span>
                    {"BATHROOM"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      padding: "4px 7px",
                      background: "rgba(15,14,13,.7)",
                      color: "#f6efdd",
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    {"0:29"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      bottom: "12px",
                      font: "400 clamp(40px,5vw,72px)/0.8 'Instrument Serif',serif",
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(246,239,221,.7)",
                      pointerEvents: "none",
                    }}
                  >
                    {"05"}
                  </span>
                </div>
                <figcaption
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "baseline",
                    borderTop: "1px solid #322e28",
                    paddingTop: "10px",
                  }}
                >
                  <span
                    style={{
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      color: "#a1563f",
                      flex: "none",
                    }}
                  >
                    {"05"}
                  </span>
                  <span
                    style={{
                      font: "400 14px/1.35 'Source Sans 3',sans-serif",
                      color: "#d6cfc4",
                      flex: "1",
                      minWidth: "0",
                    }}
                  >
                    {"Crafting elegance, tile by tile — New York"}
                  </span>
                </figcaption>
              </figure>
              <figure
                data-reelcard={""}
                data-cur={"PLAY"}
                style={{
                  margin: "0",
                  flex: "none",
                  width: "min(78vw,320px,calc((100vh - 320px) * 9 / 16))",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  willChange: "transform,opacity",
                }}
              >
                <div
                  onClick={v.openReel}
                  onMouseEnter={v.previewOn}
                  onMouseLeave={v.previewOff}
                  data-video={"/uploads/reels/06-blueprints-into-bubbles.mp4"}
                  data-title={"Blueprints into bubbles — dream bathroom"}
                  role={"button"}
                  tabIndex={"0"}
                  aria-label={"Play: Blueprints into bubbles — dream bathroom"}
                  style={{
                    position: "relative",
                    aspectRatio: "9/16",
                    background: "#1e1c19",
                    overflow: "hidden",
                    border: "1px solid #322e28",
                    cursor: "pointer",
                  }}
                >
                  <div
                    data-plx={"0.05"}
                    style={{
                      position: "absolute",
                      inset: "-8% 0",
                      pointerEvents: "none",
                    }}
                  >
                    <img
                      id={"isv2-reel-5"}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={"/assets/design/vid5.jpg"}
                      alt={"Blueprints into bubbles — dream bathroom"}
                      decoding={"async"}
                    />
                  </div>
                  <video
                    data-preview={""}
                    muted={true}
                    loop={true}
                    playsInline={true}
                    preload={"none"}
                    data-src={"/uploads/reels/06-blueprints-into-bubbles.mp4"}
                    style={{
                      position: "absolute",
                      inset: "0",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: "0",
                      transition: "opacity .5s ease",
                      pointerEvents: "none",
                    }}
                  ></video>
                  <div
                    style={{
                      position: "absolute",
                      inset: "0",
                      background:
                        "linear-gradient(180deg,rgba(15,14,13,0) 40%,rgba(15,14,13,.78))",
                      pointerEvents: "none",
                    }}
                  ></div>
                  <div
                    data-playring={""}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: "72px",
                      height: "72px",
                      margin: "-36px 0 0 -36px",
                      borderRadius: "50%",
                      border: "1px solid rgba(246,239,221,.55)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(15,14,13,.45)",
                      pointerEvents: "none",
                      willChange: "transform",
                    }}
                  >
                    <span
                      style={{
                        width: "0",
                        height: "0",
                        borderLeft: "16px solid #f6efdd",
                        borderTop: "10px solid transparent",
                        borderBottom: "10px solid transparent",
                        marginLeft: "4px",
                      }}
                    ></span>
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 8px",
                      background: "#a1563f",
                      color: "#fff",
                      font: "700 9px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#fff",
                        animation: "pulseDot 1.2s infinite",
                      }}
                    ></span>
                    {"BATHROOM"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      padding: "4px 7px",
                      background: "rgba(15,14,13,.7)",
                      color: "#f6efdd",
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    {"0:57"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      bottom: "12px",
                      font: "400 clamp(40px,5vw,72px)/0.8 'Instrument Serif',serif",
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(246,239,221,.7)",
                      pointerEvents: "none",
                    }}
                  >
                    {"06"}
                  </span>
                </div>
                <figcaption
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "baseline",
                    borderTop: "1px solid #322e28",
                    paddingTop: "10px",
                  }}
                >
                  <span
                    style={{
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      color: "#a1563f",
                      flex: "none",
                    }}
                  >
                    {"06"}
                  </span>
                  <span
                    style={{
                      font: "400 14px/1.35 'Source Sans 3',sans-serif",
                      color: "#d6cfc4",
                      flex: "1",
                      minWidth: "0",
                    }}
                  >
                    {"Blueprints into bubbles — dream bathroom"}
                  </span>
                </figcaption>
              </figure>
              <figure
                data-reelcard={""}
                data-cur={"PLAY"}
                style={{
                  margin: "0",
                  flex: "none",
                  width: "min(78vw,320px,calc((100vh - 320px) * 9 / 16))",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  willChange: "transform,opacity",
                }}
              >
                <div
                  onClick={v.openReel}
                  onMouseEnter={v.previewOn}
                  onMouseLeave={v.previewOff}
                  data-video={"/uploads/reels/07-job-site.mp4"}
                  data-title={"On the job site"}
                  role={"button"}
                  tabIndex={"0"}
                  aria-label={"Play: On the job site"}
                  style={{
                    position: "relative",
                    aspectRatio: "9/16",
                    background: "#1e1c19",
                    overflow: "hidden",
                    border: "1px solid #322e28",
                    cursor: "pointer",
                  }}
                >
                  <div
                    data-plx={"0.05"}
                    style={{
                      position: "absolute",
                      inset: "-8% 0",
                      pointerEvents: "none",
                    }}
                  >
                    <img
                      id={"isv2-reel-6"}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={"/assets/design/vid6.jpg"}
                      alt={"On the job site"}
                      decoding={"async"}
                    />
                  </div>
                  <video
                    data-preview={""}
                    muted={true}
                    loop={true}
                    playsInline={true}
                    preload={"none"}
                    data-src={"/uploads/reels/07-job-site.mp4"}
                    style={{
                      position: "absolute",
                      inset: "0",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: "0",
                      transition: "opacity .5s ease",
                      pointerEvents: "none",
                    }}
                  ></video>
                  <div
                    style={{
                      position: "absolute",
                      inset: "0",
                      background:
                        "linear-gradient(180deg,rgba(15,14,13,0) 40%,rgba(15,14,13,.78))",
                      pointerEvents: "none",
                    }}
                  ></div>
                  <div
                    data-playring={""}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: "72px",
                      height: "72px",
                      margin: "-36px 0 0 -36px",
                      borderRadius: "50%",
                      border: "1px solid rgba(246,239,221,.55)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(15,14,13,.45)",
                      pointerEvents: "none",
                      willChange: "transform",
                    }}
                  >
                    <span
                      style={{
                        width: "0",
                        height: "0",
                        borderLeft: "16px solid #f6efdd",
                        borderTop: "10px solid transparent",
                        borderBottom: "10px solid transparent",
                        marginLeft: "4px",
                      }}
                    ></span>
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 8px",
                      background: "#a1563f",
                      color: "#fff",
                      font: "700 9px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#fff",
                        animation: "pulseDot 1.2s infinite",
                      }}
                    ></span>
                    {"JOB SITE"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      padding: "4px 7px",
                      background: "rgba(15,14,13,.7)",
                      color: "#f6efdd",
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    {"0:30"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      bottom: "12px",
                      font: "400 clamp(40px,5vw,72px)/0.8 'Instrument Serif',serif",
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(246,239,221,.7)",
                      pointerEvents: "none",
                    }}
                  >
                    {"07"}
                  </span>
                </div>
                <figcaption
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "baseline",
                    borderTop: "1px solid #322e28",
                    paddingTop: "10px",
                  }}
                >
                  <span
                    style={{
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      color: "#a1563f",
                      flex: "none",
                    }}
                  >
                    {"07"}
                  </span>
                  <span
                    style={{
                      font: "400 14px/1.35 'Source Sans 3',sans-serif",
                      color: "#d6cfc4",
                      flex: "1",
                      minWidth: "0",
                    }}
                  >
                    {"On the job site"}
                  </span>
                </figcaption>
              </figure>
              <figure
                data-reelcard={""}
                data-cur={"PLAY"}
                style={{
                  margin: "0",
                  flex: "none",
                  width: "min(78vw,320px,calc((100vh - 320px) * 9 / 16))",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  willChange: "transform,opacity",
                }}
              >
                <div
                  onClick={v.openReel}
                  onMouseEnter={v.previewOn}
                  onMouseLeave={v.previewOff}
                  data-video={"/uploads/reels/08-bland-to-grand.mp4"}
                  data-title={"From bland to grand — before & after"}
                  role={"button"}
                  tabIndex={"0"}
                  aria-label={"Play: From bland to grand — before & after"}
                  style={{
                    position: "relative",
                    aspectRatio: "9/16",
                    background: "#1e1c19",
                    overflow: "hidden",
                    border: "1px solid #322e28",
                    cursor: "pointer",
                  }}
                >
                  <div
                    data-plx={"0.05"}
                    style={{
                      position: "absolute",
                      inset: "-8% 0",
                      pointerEvents: "none",
                    }}
                  >
                    <img
                      id={"isv2-reel-7"}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={"/assets/design/vid7.jpg"}
                      alt={"From bland to grand — before & after"}
                      decoding={"async"}
                    />
                  </div>
                  <video
                    data-preview={""}
                    muted={true}
                    loop={true}
                    playsInline={true}
                    preload={"none"}
                    data-src={"/uploads/reels/08-bland-to-grand.mp4"}
                    style={{
                      position: "absolute",
                      inset: "0",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: "0",
                      transition: "opacity .5s ease",
                      pointerEvents: "none",
                    }}
                  ></video>
                  <div
                    style={{
                      position: "absolute",
                      inset: "0",
                      background:
                        "linear-gradient(180deg,rgba(15,14,13,0) 40%,rgba(15,14,13,.78))",
                      pointerEvents: "none",
                    }}
                  ></div>
                  <div
                    data-playring={""}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: "72px",
                      height: "72px",
                      margin: "-36px 0 0 -36px",
                      borderRadius: "50%",
                      border: "1px solid rgba(246,239,221,.55)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(15,14,13,.45)",
                      pointerEvents: "none",
                      willChange: "transform",
                    }}
                  >
                    <span
                      style={{
                        width: "0",
                        height: "0",
                        borderLeft: "16px solid #f6efdd",
                        borderTop: "10px solid transparent",
                        borderBottom: "10px solid transparent",
                        marginLeft: "4px",
                      }}
                    ></span>
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 8px",
                      background: "#a1563f",
                      color: "#fff",
                      font: "700 9px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#fff",
                        animation: "pulseDot 1.2s infinite",
                      }}
                    ></span>
                    {"BEFORE / AFTER"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      padding: "4px 7px",
                      background: "rgba(15,14,13,.7)",
                      color: "#f6efdd",
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      pointerEvents: "none",
                    }}
                  >
                    {"0:29"}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      bottom: "12px",
                      font: "400 clamp(40px,5vw,72px)/0.8 'Instrument Serif',serif",
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(246,239,221,.7)",
                      pointerEvents: "none",
                    }}
                  >
                    {"08"}
                  </span>
                </div>
                <figcaption
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "baseline",
                    borderTop: "1px solid #322e28",
                    paddingTop: "10px",
                  }}
                >
                  <span
                    style={{
                      font: "400 10px 'JetBrains Mono',monospace",
                      letterSpacing: "1.4px",
                      color: "#a1563f",
                      flex: "none",
                    }}
                  >
                    {"08"}
                  </span>
                  <span
                    style={{
                      font: "400 14px/1.35 'Source Sans 3',sans-serif",
                      color: "#d6cfc4",
                      flex: "1",
                      minWidth: "0",
                    }}
                  >
                    {"From bland to grand — before & after"}
                  </span>
                </figcaption>
              </figure>
              <div
                style={{
                  flex: "none",
                  width: "min(40vw,420px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  alignSelf: "center",
                  paddingBottom: "40px",
                }}
              >
                <span
                  style={{
                    font: "400 clamp(30px,3.4vw,48px)/1 'Instrument Serif',serif",
                  }}
                >
                  {"Eight clips from real jobs. More on Instagram."}
                </span>
                <a
                  href={"https://www.instagram.com/jafettile____com/"}
                  target={"_blank"}
                  rel={"noopener noreferrer"}
                  data-cur={"OPEN"}
                  style={{
                    font: "400 11px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#f6efdd",
                    textDecoration: "none",
                    borderBottom: "1px solid #a1563f",
                    paddingBottom: "3px",
                    alignSelf: "flex-start",
                  }}
                >
                  {"@JAFETTILE____COM →"}
                </a>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                left: "28px",
                right: "28px",
                bottom: "clamp(24px,4vh,40px)",
                height: "1px",
                background: "#322e28",
              }}
            >
              <div
                data-reelbar={""}
                style={{
                  height: "1px",
                  width: "0",
                  background: "#a1563f",
                  willChange: "width",
                }}
              ></div>
            </div>
          </div>
        </section>
        <section
          id={"reviews"}
          data-agent={"reviews"}
          style={{
            isolation: "isolate",
            position: "sticky",
            top: "0",
            zIndex: "6",
            minHeight: "100vh",
            background: "#f6efdd",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            aria-hidden={"true"}
            style={{
              position: "absolute",
              inset: "0",
              zIndex: "-1",
              opacity: ".35",
              pointerEvents: "none",
            }}
          >
            <img
              id={"isv2-tex-reviews"}
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              src={"/assets/design/img19.jpg"}
              alt={"Carrara veining"}
              decoding={"async"}
            />
            <div
              style={{
                position: "absolute",
                inset: "0",
                background:
                  "linear-gradient(180deg,#f6efdd 0%,rgba(246,239,221,.4) 50%,#f6efdd 100%)",
              }}
            ></div>
          </div>
          <div
            data-rv=""
            data-block-reveal=""
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "clamp(100px,14vw,180px) 28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "40px",
              width: "100%",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                font: "400 10px 'JetBrains Mono',monospace",
                letterSpacing: "1.8px",
                color: "#a1563f",
              }}
            >
              <span
                style={{ width: "26px", height: "2px", background: "#a1563f" }}
              ></span>
              {"[ 03 // REVIEWS ]"}
            </span>
            <h2
              data-words={""}
              style={{
                margin: "0",
                maxWidth: "20ch",
                font: "400 clamp(40px,6.6vw,100px)/0.98 'Instrument Serif',serif",
                letterSpacing: "-0.04em",
              }}
            >
              {"Client reviews are being verified."}
            </h2>
            <p
              style={{
                margin: "0",
                maxWidth: "52ch",
                font: "400 18px/1.55 'Source Sans 3',sans-serif",
                color: "#5a544b",
              }}
            >
              {
                "Reviews will appear here once ownership and permission are confirmed. Publicly listed reviews for a related business can be read on "
              }
              <a
                href={
                  "https://www.angi.com/companylist/us/ny/highland-mills/jafet-home-improvement-reviews-1.htm"
                }
                target={"_blank"}
                rel={"noopener noreferrer"}
              >
                {"Angi"}
              </a>
              {"; they are not shown as Isaac Stone and Tile reviews."}
            </p>
          </div>
        </section>
        <section
          id={"owner"}
          data-agent={"owner"}
          style={{
            position: "relative",
            zIndex: "7",
            background: "#efeae1",
            color: "#2a2825",
            borderTop: "1px solid #ddd6ca",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "clamp(80px,10vw,150px) 28px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "clamp(34px,5vw,80px)",
              alignItems: "center",
            }}
          >
            <div
              data-rv={""}
              style={{
                position: "relative",
                aspectRatio: "4/5",
                maxWidth: "480px",
                width: "100%",
                background: "#2a2825",
                overflow: "hidden",
                opacity: "0",
                transform: "translateY(40px)",
                transition:
                  "opacity 1s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1)",
              }}
            >
              <div
                data-plx={"0.06"}
                style={{ position: "absolute", inset: "-8% 0" }}
              >
                <img
                  id={"isv2-owner-site"}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={"/assets/design/img5.jpg"}
                  alt={"Crew on site"}
                  decoding={"async"}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  padding: "18px 18px 16px",
                  background: "linear-gradient(transparent,rgba(15,14,13,.9))",
                  color: "#f6efdd",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#a1563f",
                  }}
                >
                  {"ON SITE"}
                </span>
                <span
                  style={{ font: "400 22px/1.05 'Instrument Serif',serif" }}
                >
                  {"The crew, mid-set"}
                </span>
                <span
                  style={{
                    font: "400 13px/1.35 'Source Sans 3',sans-serif",
                    color: "#a89f92",
                  }}
                >
                  {"Large-format floor, levelled and cut by hand"}
                </span>
              </div>
              <span
                style={{
                  position: "absolute",
                  top: "14px",
                  left: "14px",
                  width: "20px",
                  height: "20px",
                  borderTop: "2px solid #a1563f",
                  borderLeft: "2px solid #a1563f",
                }}
              ></span>
              <span
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  width: "20px",
                  height: "20px",
                  borderTop: "2px solid #a1563f",
                  borderRight: "2px solid #a1563f",
                }}
              ></span>
            </div>
            <div
              data-rv={""}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "22px",
                minWidth: "0",
                opacity: "0",
                transform: "translateY(40px)",
                transition:
                  "opacity 1s cubic-bezier(.16,1,.3,1) .1s,transform 1s cubic-bezier(.16,1,.3,1) .1s",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.8px",
                  color: "#a1563f",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "2px",
                    background: "#a1563f",
                  }}
                ></span>
                {"[ 03b // THE CREW ]"}
              </span>
              <h2
                style={{
                  margin: "0",
                  font: "400 clamp(40px,5.4vw,80px)/0.92 'Instrument Serif',serif",
                  letterSpacing: "-0.04em",
                }}
              >
                {"Owner-led, "}
                <em style={{ color: "#a1563f" }}>{"start"}</em>
                {" to finish."}
              </h2>
              <p
                style={{
                  margin: "0",
                  maxWidth: "44ch",
                  font: "400 clamp(17px,1.3vw,20px)/1.55 'Source Sans 3',sans-serif",
                  color: "#3e392f",
                }}
              >
                {
                  "One experienced team plans, measures and installs your project, and you speak directly with the people doing the work. Questions go to a single point of contact throughout, and changes are discussed before additional work proceeds."
                }
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px 22px",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.4px",
                  color: "#6b6459",
                  borderTop: "1px solid #ddd6ca",
                  paddingTop: "16px",
                }}
              >
                <span>{"OWNER-LED CRAFTSMANSHIP"}</span>
                <span>{"·"}</span>
                <span>{"ONE POINT OF CONTACT"}</span>
                <span>{"·"}</span>
                <span>{"BRENTWOOD, NY"}</span>
              </div>
              <a
                href={"tel:+16315305883"}
                data-cur={"CALL"}
                onMouseMove={v.magnet}
                onMouseLeave={v.unmagnet}
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 26px",
                  background: "#2a2825",
                  color: "#f6efdd",
                  font: "700 16px 'Source Sans 3',sans-serif",
                  minHeight: "52px",
                  textDecoration: "none",
                  transition: "transform .4s cubic-bezier(.16,1,.3,1)",
                }}
              >
                {"Call (631) 530-5883"}
              </a>
            </div>
          </div>
        </section>
        <section
          id={"why"}
          data-agent={"why"}
          style={{
            position: "relative",
            zIndex: "7",
            background: "#efeae1",
            color: "#2a2825",
            borderTop: "1px solid #ddd6ca",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "clamp(80px,10vw,150px) 28px",
              display: "flex",
              flexDirection: "column",
              gap: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.8px",
                    color: "#a1563f",
                  }}
                >
                  <span
                    style={{
                      width: "26px",
                      height: "2px",
                      background: "#a1563f",
                    }}
                  ></span>
                  {"[ 03c // WHY US ]"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    font: "400 clamp(40px,5.4vw,80px)/0.92 'Instrument Serif',serif",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {"Why work with us?"}
                </h2>
              </div>
              <p
                style={{
                  margin: "0",
                  maxWidth: "40ch",
                  font: "400 17px/1.55 'Source Sans 3',sans-serif",
                  color: "#5a544b",
                }}
              >
                {
                  "Trusted for the finish, the schedule, and the phone getting answered."
                }
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gridAutoRows: "minmax(220px,auto)",
                gridAutoFlow: "dense",
                gap: "1px",
                background: "#ddd6ca",
                border: "1px solid #ddd6ca",
              }}
            >
              <div
                data-rv={""}
                style={{
                  background: "#2a2825",
                  color: "#f6efdd",
                  padding: "clamp(22px,2.6vw,36px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "20px",
                  minHeight: "220px",
                  opacity: "0",
                  transform: "translateY(30px)",
                  transition:
                    "opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)",
                }}
              >
                <span
                  style={{
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#8d857a",
                  }}
                >
                  {"IN THE TRADE"}
                </span>
                <span
                  style={{
                    font: "400 clamp(40px,4.6vw,68px)/0.9 'Instrument Serif',serif",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {"25+ years"}
                </span>
              </div>
              <div
                data-rv={""}
                data-cur={"VIEW"}
                style={{
                  position: "relative",
                  background: "#1e1c19",
                  overflow: "hidden",
                  minHeight: "220px",
                  gridColumn: "span 2",
                  opacity: "0",
                  transform: "translateY(30px)",
                  transition:
                    "opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)",
                }}
              >
                <div
                  data-plx={"0.05"}
                  style={{ position: "absolute", inset: "-8% 0" }}
                >
                  <img
                    id={"isv2-why-kitchen"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img0.jpg"}
                    alt={"Calacatta kitchen"}
                    decoding={"async"}
                  />
                </div>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    bottom: "12px",
                    padding: "5px 9px",
                    background: "rgba(15,14,13,.85)",
                    color: "#f6efdd",
                    font: "400 9px 'JetBrains Mono',monospace",
                    letterSpacing: "1.4px",
                    pointerEvents: "none",
                  }}
                >
                  {"CALACATTA KITCHEN"}
                </span>
              </div>
              <div
                data-rv={""}
                style={{
                  background: "#f6efdd",
                  color: "#2a2825",
                  padding: "clamp(22px,2.6vw,36px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "20px",
                  minHeight: "220px",
                  opacity: "0",
                  transform: "translateY(30px)",
                  transition:
                    "opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)",
                }}
              >
                <span
                  style={{
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#6b6459",
                  }}
                >
                  {"CONTACT"}
                </span>
                <span
                  style={{
                    font: "400 clamp(40px,4.6vw,68px)/0.9 'Instrument Serif',serif",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {"Direct"}
                </span>
              </div>
              <div
                data-rv={""}
                data-cur={"VIEW"}
                style={{
                  position: "relative",
                  background: "#1e1c19",
                  overflow: "hidden",
                  minHeight: "220px",
                  gridColumn: "span 2",
                  opacity: "0",
                  transform: "translateY(30px)",
                  transition:
                    "opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)",
                }}
              >
                <div
                  data-plx={"0.05"}
                  style={{ position: "absolute", inset: "-8% 0" }}
                >
                  <img
                    id={"isv2-why-bath"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img1.jpg"}
                    alt={"Bookmatched bath"}
                    decoding={"async"}
                  />
                </div>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    bottom: "12px",
                    padding: "5px 9px",
                    background: "rgba(15,14,13,.85)",
                    color: "#f6efdd",
                    font: "400 9px 'JetBrains Mono',monospace",
                    letterSpacing: "1.4px",
                    pointerEvents: "none",
                  }}
                >
                  {"BOOKMATCHED BATH"}
                </span>
              </div>
              <div
                data-rv={""}
                style={{
                  background: "#f6efdd",
                  color: "#2a2825",
                  padding: "clamp(22px,2.6vw,36px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "20px",
                  minHeight: "220px",
                  opacity: "0",
                  transform: "translateY(30px)",
                  transition:
                    "opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)",
                }}
              >
                <span
                  style={{
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#6b6459",
                  }}
                >
                  {"APPROACH"}
                </span>
                <span
                  style={{
                    font: "400 clamp(40px,4.6vw,68px)/0.9 'Instrument Serif',serif",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {"Owner-led"}
                </span>
              </div>
              <div
                data-rv={""}
                style={{
                  background: "#2a2825",
                  color: "#f6efdd",
                  padding: "clamp(22px,2.6vw,36px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "20px",
                  minHeight: "220px",
                  opacity: "0",
                  transform: "translateY(30px)",
                  transition:
                    "opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)",
                }}
              >
                <span
                  style={{
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#8d857a",
                  }}
                >
                  {"LOCAL SERVICE"}
                </span>
                <span
                  style={{
                    font: "400 clamp(40px,4.6vw,68px)/0.9 'Instrument Serif',serif",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {"NY & LI"}
                </span>
              </div>
              <div
                data-rv={""}
                data-cur={"VIEW"}
                style={{
                  position: "relative",
                  background: "#1e1c19",
                  overflow: "hidden",
                  minHeight: "220px",
                  gridColumn: "span 2",
                  opacity: "0",
                  transform: "translateY(30px)",
                  transition:
                    "opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)",
                }}
              >
                <div
                  data-plx={"0.05"}
                  style={{ position: "absolute", inset: "-8% 0" }}
                >
                  <img
                    id={"isv2-why-patio"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"/assets/design/img3.jpg"}
                    alt={"Stone patio"}
                    decoding={"async"}
                  />
                </div>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    bottom: "12px",
                    padding: "5px 9px",
                    background: "rgba(15,14,13,.85)",
                    color: "#f6efdd",
                    font: "400 9px 'JetBrains Mono',monospace",
                    letterSpacing: "1.4px",
                    pointerEvents: "none",
                  }}
                >
                  {"STONE PATIO"}
                </span>
              </div>
            </div>
          </div>
        </section>
        <section
          id={"beforeafter"}
          data-agent={"beforeafter"}
          style={{
            position: "relative",
            zIndex: "7",
            background: "#1c1a17",
            color: "#f6efdd",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "clamp(80px,10vw,150px) 28px",
              display: "flex",
              flexDirection: "column",
              gap: "34px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.8px",
                    color: "#a1563f",
                  }}
                >
                  <span
                    style={{
                      width: "26px",
                      height: "2px",
                      background: "#a1563f",
                    }}
                  ></span>
                  {"[ 03c // BEFORE & AFTER ]"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    font: "400 clamp(44px,6.4vw,96px)/0.88 'Instrument Serif',serif",
                    letterSpacing: "-0.045em",
                  }}
                >
                  {"From structure to finish."}
                </h2>
              </div>
              <span
                style={{
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.6px",
                  color: "#8d857a",
                }}
              >
                {"DRAG THE HANDLE ↔"}
              </span>
            </div>
            <div
              data-rv={""}
              data-cur={"DRAG"}
              onPointerDown={v.baDown}
              role="slider"
              tabIndex={0}
              aria-label="Explore project preparation and finished stone"
              aria-valuemin={2}
              aria-valuemax={98}
              aria-valuenow={this.state.ba}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                  e.preventDefault();
                  this.setState({
                    ba: Math.max(
                      2,
                      Math.min(
                        98,
                        this.state.ba + (e.key === "ArrowRight" ? 5 : -5),
                      ),
                    ),
                  });
                }
              }}
              onPointerMove={v.baMove}
              onPointerUp={v.baUp}
              onPointerCancel={v.baUp}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
                maxHeight: "78vh",
                background: "#1e1c19",
                overflow: "hidden",
                touchAction: "pan-y",
                userSelect: "none",
                opacity: "0",
                transform: "translateY(40px)",
                transition:
                  "opacity 1s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1)",
              }}
            >
              <div style={{ position: "absolute", inset: "0" }}>
                <img
                  id={"isv2-ba-after"}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={"/assets/design/img7.jpg"}
                  alt={"Finished stone surface"}
                  decoding={"async"}
                />
              </div>
              <div
                style={{ position: "absolute", inset: "0", clipPath: v.baClip }}
              >
                <img
                  id={"isv2-ba-before"}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={"/assets/design/img5.jpg"}
                  alt={"Structural preparation"}
                  decoding={"async"}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  bottom: "0",
                  left: v.baPct,
                  width: "2px",
                  background: "#f6efdd",
                  transform: "translateX(-1px)",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: "#a1563f",
                    border: "2px solid #f6efdd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    font: "700 13px 'JetBrains Mono',monospace",
                    color: "#fff",
                    letterSpacing: "-1px",
                  }}
                >
                  {"↔"}
                </span>
              </div>
              <span
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  padding: "5px 9px",
                  background: "rgba(15,14,13,.85)",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.6px",
                  color: "#f6efdd",
                  pointerEvents: "none",
                }}
              >
                {"BEFORE"}
              </span>
              <span
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  padding: "5px 9px",
                  background: "#a1563f",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.6px",
                  color: "#fff",
                  pointerEvents: "none",
                }}
              >
                {"AFTER"}
              </span>
            </div>
            <p
              style={{
                margin: "0",
                maxWidth: "60ch",
                font: "400 14px/1.5 'Source Sans 3',sans-serif",
                color: "#8d857a",
              }}
            >
              {
                "A look at two different projects: preparation and a finished surface. Drag to explore."
              }
            </p>
          </div>
        </section>
        <section
          data-process={""}
          data-agent={"process"}
          style={{
            position: "relative",
            zIndex: "7",
            background: "#efeae1",
            borderTop: "2px solid #a1563f",
            boxShadow: "0 -40px 80px rgba(0,0,0,.25)",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "clamp(100px,14vw,200px) 28px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "clamp(40px,5vw,90px)",
              alignItems: "start",
            }}
          >
            <div
              data-rv={""}
              style={{
                position: "sticky",
                top: "110px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                minWidth: "0",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.8px",
                  color: "#a1563f",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "2px",
                    background: "#a1563f",
                  }}
                ></span>
                {"[ 04 // PROCESS ]"}
              </span>
              <h2
                style={{
                  margin: "0",
                  font: "400 clamp(52px,7.4vw,112px)/0.88 'Instrument Serif',serif",
                  letterSpacing: "-0.045em",
                }}
              >
                <span
                  style={{
                    display: "block",
                    overflow: "hidden",
                    paddingBottom: ".08em",
                  }}
                >
                  <span
                    data-rv-line={""}
                    style={{
                      display: "block",
                      transform: "translateY(110%)",
                      transition: "transform 1.1s cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    {"How a"}
                  </span>
                </span>
                <span
                  style={{
                    display: "block",
                    overflow: "hidden",
                    paddingBottom: ".08em",
                  }}
                >
                  <span
                    data-rv-line={""}
                    style={{
                      display: "block",
                      transform: "translateY(110%)",
                      transition: "transform 1.1s cubic-bezier(.16,1,.3,1) .1s",
                    }}
                  >
                    {"job runs"}
                  </span>
                </span>
              </h2>
              <p
                style={{
                  margin: "0",
                  maxWidth: "34ch",
                  font: "400 18px/1.55 'Source Sans 3',sans-serif",
                  color: "#5a544b",
                }}
              >
                {"Four steps, with a written estimate before any work begins."}
              </p>
            </div>
            <div
              style={{
                position: "relative",
                minWidth: "0",
                paddingLeft: "34px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "0",
                  top: "0",
                  bottom: "0",
                  width: "1px",
                  background: "#d8d1c4",
                }}
              >
                <div
                  data-pline={""}
                  style={{
                    width: "1px",
                    height: "100%",
                    background: "#a1563f",
                    transform: "scaleY(0)",
                    transformOrigin: "50% 0",
                    willChange: "transform",
                  }}
                ></div>
              </div>
              <ol
                style={{
                  margin: "0",
                  padding: "0",
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <li
                  data-pstep={""}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(80px,140px) minmax(0,1fr)",
                    gap: "18px",
                    alignItems: "start",
                    borderTop: "1px solid #d8d1c4",
                    padding: "34px 0",
                    position: "relative",
                    transition: "opacity .6s",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "-39px",
                      top: "38px",
                      width: "9px",
                      height: "9px",
                      borderRadius: "50%",
                      background: "#d8d1c4",
                      transition: "background .4s,transform .4s",
                    }}
                  ></span>
                  <span
                    style={{
                      font: "400 clamp(64px,8vw,120px)/0.78 'Instrument Serif',serif",
                      color: "#a1563f",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {"01"}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "9px",
                      paddingTop: "8px",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0",
                        font: "400 32px/1.02 'Instrument Serif',serif",
                      }}
                    >
                      {"You call or write"}
                    </h3>
                    <p
                      style={{
                        margin: "0",
                        maxWidth: "46ch",
                        font: "400 17px/1.55 'Source Sans 3',sans-serif",
                        color: "#5a544b",
                      }}
                    >
                      {
                        "Tell us the room, the material you have in mind, and roughly when you want it done."
                      }
                    </p>
                  </div>
                </li>
                <li
                  data-pstep={""}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(80px,140px) minmax(0,1fr)",
                    gap: "18px",
                    alignItems: "start",
                    borderTop: "1px solid #d8d1c4",
                    padding: "34px 0",
                    position: "relative",
                    opacity: ".35",
                    transition: "opacity .6s",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "-39px",
                      top: "38px",
                      width: "9px",
                      height: "9px",
                      borderRadius: "50%",
                      background: "#d8d1c4",
                      transition: "background .4s,transform .4s",
                    }}
                  ></span>
                  <span
                    style={{
                      font: "400 clamp(64px,8vw,120px)/0.78 'Instrument Serif',serif",
                      color: "transparent",
                      WebkitTextStroke: "1px #2a2825",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {"02"}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "9px",
                      paddingTop: "8px",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0",
                        font: "400 32px/1.02 'Instrument Serif',serif",
                      }}
                    >
                      {"We come and measure"}
                    </h3>
                    <p
                      style={{
                        margin: "0",
                        maxWidth: "46ch",
                        font: "400 17px/1.55 'Source Sans 3',sans-serif",
                        color: "#5a544b",
                      }}
                    >
                      {
                        "A free visit to look at the space, check the substrate, and bring material samples."
                      }
                    </p>
                  </div>
                </li>
                <li
                  data-pstep={""}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(80px,140px) minmax(0,1fr)",
                    gap: "18px",
                    alignItems: "start",
                    borderTop: "1px solid #d8d1c4",
                    padding: "34px 0",
                    position: "relative",
                    opacity: ".35",
                    transition: "opacity .6s",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "-39px",
                      top: "38px",
                      width: "9px",
                      height: "9px",
                      borderRadius: "50%",
                      background: "#d8d1c4",
                      transition: "background .4s,transform .4s",
                    }}
                  ></span>
                  <span
                    style={{
                      font: "400 clamp(64px,8vw,120px)/0.78 'Instrument Serif',serif",
                      color: "transparent",
                      WebkitTextStroke: "1px #2a2825",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {"03"}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "9px",
                      paddingTop: "8px",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0",
                        font: "400 32px/1.02 'Instrument Serif',serif",
                      }}
                    >
                      {"Written estimate"}
                    </h3>
                    <p
                      style={{
                        margin: "0",
                        maxWidth: "46ch",
                        font: "400 17px/1.55 'Source Sans 3',sans-serif",
                        color: "#5a544b",
                      }}
                    >
                      {
                        "Itemized: materials, labor, prep. Changes are discussed before additional work proceeds."
                      }
                    </p>
                  </div>
                </li>
                <li
                  data-pstep={""}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(80px,140px) minmax(0,1fr)",
                    gap: "18px",
                    alignItems: "start",
                    borderTop: "1px solid #d8d1c4",
                    borderBottom: "1px solid #d8d1c4",
                    padding: "34px 0",
                    position: "relative",
                    opacity: ".35",
                    transition: "opacity .6s",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "-39px",
                      top: "38px",
                      width: "9px",
                      height: "9px",
                      borderRadius: "50%",
                      background: "#d8d1c4",
                      transition: "background .4s,transform .4s",
                    }}
                  ></span>
                  <span
                    style={{
                      font: "400 clamp(64px,8vw,120px)/0.78 'Instrument Serif',serif",
                      color: "transparent",
                      WebkitTextStroke: "1px #2a2825",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {"04"}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "9px",
                      paddingTop: "8px",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0",
                        font: "400 32px/1.02 'Instrument Serif',serif",
                      }}
                    >
                      {"We install"}
                    </h3>
                    <p
                      style={{
                        margin: "0",
                        maxWidth: "46ch",
                        font: "400 17px/1.55 'Source Sans 3',sans-serif",
                        color: "#5a544b",
                      }}
                    >
                      {
                        "One point of contact throughout, work areas maintained, and a walkthrough with you at the end."
                      }
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>
        <section
          id={"faq"}
          data-agent={"faq"}
          style={{
            position: "relative",
            zIndex: "7",
            background: "#2a2825",
            color: "#f6efdd",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "clamp(80px,10vw,150px) 28px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "clamp(34px,5vw,90px)",
              alignItems: "start",
            }}
          >
            <div
              data-rv={""}
              style={{
                position: "sticky",
                top: "110px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.8px",
                  color: "#a1563f",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "2px",
                    background: "#a1563f",
                  }}
                ></span>
                {"[ 05b // FAQ ]"}
              </span>
              <h2
                style={{
                  margin: "0",
                  font: "400 clamp(44px,6vw,92px)/0.9 'Instrument Serif',serif",
                  letterSpacing: "-0.045em",
                }}
              >
                {"Got questions?"}
              </h2>
              <p
                style={{
                  margin: "0",
                  maxWidth: "34ch",
                  font: "400 17px/1.55 'Source Sans 3',sans-serif",
                  color: "#a89f92",
                }}
              >
                {
                  "The things people ask before they call. Anything else, the phone works."
                }
              </p>
              <a
                href={"tel:+16315305883"}
                data-cur={"CALL"}
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 22px",
                  border: "1px solid #6b6459",
                  color: "#f6efdd",
                  font: "700 15px 'Source Sans 3',sans-serif",
                  minHeight: "48px",
                  textDecoration: "none",
                }}
              >
                {"Call (631) 530-5883"}
              </a>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderBottom: "1px solid #322e28",
              }}
            >
              <div style={{ borderTop: "1px solid #322e28" }}>
                <button
                  type={"button"}
                  onClick={v.faq0}
                  aria-expanded={v.faqOpen0}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px",
                    padding: "24px 0",
                    background: "transparent",
                    border: "0",
                    color: "#f6efdd",
                    textAlign: "left",
                    cursor: "pointer",
                    minHeight: "56px",
                  }}
                >
                  <span
                    style={{
                      font: "400 clamp(20px,2.2vw,30px)/1.15 'Instrument Serif',serif",
                    }}
                  >
                    {"Do you work on both homes and commercial spaces?"}
                  </span>
                  <span
                    style={{
                      flex: "none",
                      width: "36px",
                      height: "36px",
                      border: "1px solid #6b6459",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      font: "400 18px 'Source Sans 3',sans-serif",
                      transform: v.faqRot0,
                      transition: "transform .4s cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    {"+"}
                  </span>
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: v.faqRows0,
                    transition:
                      "grid-template-rows .5s cubic-bezier(.16,1,.3,1)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <p
                      style={{
                        margin: "0 0 26px",
                        maxWidth: "62ch",
                        font: "400 17px/1.6 'Source Sans 3',sans-serif",
                        color: "#d6cfc4",
                      }}
                    >
                      {
                        "Yes. Kitchens, bathrooms and floors in homes across Long Island and NYC, plus commercial fit-outs and structural foundation work."
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #322e28" }}>
                <button
                  type={"button"}
                  onClick={v.faq1}
                  aria-expanded={v.faqOpen1}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px",
                    padding: "24px 0",
                    background: "transparent",
                    border: "0",
                    color: "#f6efdd",
                    textAlign: "left",
                    cursor: "pointer",
                    minHeight: "56px",
                  }}
                >
                  <span
                    style={{
                      font: "400 clamp(20px,2.2vw,30px)/1.15 'Instrument Serif',serif",
                    }}
                  >
                    {"What materials do you install?"}
                  </span>
                  <span
                    style={{
                      flex: "none",
                      width: "36px",
                      height: "36px",
                      border: "1px solid #6b6459",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      font: "400 18px 'Source Sans 3',sans-serif",
                      transform: v.faqRot1,
                      transition: "transform .4s cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    {"+"}
                  </span>
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: v.faqRows1,
                    transition:
                      "grid-template-rows .5s cubic-bezier(.16,1,.3,1)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <p
                      style={{
                        margin: "0 0 26px",
                        maxWidth: "62ch",
                        font: "400 17px/1.6 'Source Sans 3',sans-serif",
                        color: "#d6cfc4",
                      }}
                    >
                      {
                        "Ceramic and porcelain tile, large-format slab, granite and marble, natural stone for patios and steps. We bring samples to the site visit."
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #322e28" }}>
                <button
                  type={"button"}
                  onClick={v.faq2}
                  aria-expanded={v.faqOpen2}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px",
                    padding: "24px 0",
                    background: "transparent",
                    border: "0",
                    color: "#f6efdd",
                    textAlign: "left",
                    cursor: "pointer",
                    minHeight: "56px",
                  }}
                >
                  <span
                    style={{
                      font: "400 clamp(20px,2.2vw,30px)/1.15 'Instrument Serif',serif",
                    }}
                  >
                    {"How long does a job take?"}
                  </span>
                  <span
                    style={{
                      flex: "none",
                      width: "36px",
                      height: "36px",
                      border: "1px solid #6b6459",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      font: "400 18px 'Source Sans 3',sans-serif",
                      transform: v.faqRot2,
                      transition: "transform .4s cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    {"+"}
                  </span>
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: v.faqRows2,
                    transition:
                      "grid-template-rows .5s cubic-bezier(.16,1,.3,1)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <p
                      style={{
                        margin: "0 0 26px",
                        maxWidth: "62ch",
                        font: "400 17px/1.6 'Source Sans 3',sans-serif",
                        color: "#d6cfc4",
                      }}
                    >
                      {
                        "A bathroom floor is a few days. A full kitchen or bath is longer. You get a written timeline with the estimate, and we keep to it."
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #322e28" }}>
                <button
                  type={"button"}
                  onClick={v.faq3}
                  aria-expanded={v.faqOpen3}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px",
                    padding: "24px 0",
                    background: "transparent",
                    border: "0",
                    color: "#f6efdd",
                    textAlign: "left",
                    cursor: "pointer",
                    minHeight: "56px",
                  }}
                >
                  <span
                    style={{
                      font: "400 clamp(20px,2.2vw,30px)/1.15 'Instrument Serif',serif",
                    }}
                  >
                    {"Is the work guaranteed?"}
                  </span>
                  <span
                    style={{
                      flex: "none",
                      width: "36px",
                      height: "36px",
                      border: "1px solid #6b6459",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      font: "400 18px 'Source Sans 3',sans-serif",
                      transform: v.faqRot3,
                      transition: "transform .4s cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    {"+"}
                  </span>
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: v.faqRows3,
                    transition:
                      "grid-template-rows .5s cubic-bezier(.16,1,.3,1)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <p
                      style={{
                        margin: "0 0 26px",
                        maxWidth: "62ch",
                        font: "400 17px/1.6 'Source Sans 3',sans-serif",
                        color: "#d6cfc4",
                      }}
                    >
                      {
                        "Yes. Every installation comes with a workmanship warranty. If a tile lifts or a grout line fails, we come back and fix it."
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #322e28" }}>
                <button
                  type={"button"}
                  onClick={v.faq4}
                  aria-expanded={v.faqOpen4}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px",
                    padding: "24px 0",
                    background: "transparent",
                    border: "0",
                    color: "#f6efdd",
                    textAlign: "left",
                    cursor: "pointer",
                    minHeight: "56px",
                  }}
                >
                  <span
                    style={{
                      font: "400 clamp(20px,2.2vw,30px)/1.15 'Instrument Serif',serif",
                    }}
                  >
                    {"How do you keep the house clean while working?"}
                  </span>
                  <span
                    style={{
                      flex: "none",
                      width: "36px",
                      height: "36px",
                      border: "1px solid #6b6459",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      font: "400 18px 'Source Sans 3',sans-serif",
                      transform: v.faqRot4,
                      transition: "transform .4s cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    {"+"}
                  </span>
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: v.faqRows4,
                    transition:
                      "grid-template-rows .5s cubic-bezier(.16,1,.3,1)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <p
                      style={{
                        margin: "0 0 26px",
                        maxWidth: "62ch",
                        font: "400 17px/1.6 'Source Sans 3',sans-serif",
                        color: "#d6cfc4",
                      }}
                    >
                      {
                        "Floors and doorways get covered, the site is swept every evening, and debris leaves with us at the end of each day."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id={"contact"}
          data-agent={"contact"}
          style={{
            position: "sticky",
            top: "0",
            zIndex: "8",
            minHeight: "100vh",
            background: "#2a2825",
            color: "#f6efdd",
            padding: "clamp(100px,14vw,180px) 0",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)",
            backgroundSize: "34px 34px",
            boxShadow: "0 -40px 80px rgba(0,0,0,.35)",
          }}
        >
          <div
            aria-hidden={"true"}
            style={{
              position: "absolute",
              inset: "0",
              zIndex: "-1",
              opacity: ".22",
              pointerEvents: "none",
            }}
          >
            <img
              id={"isv2-tex-contact"}
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              src={"/assets/design/img18.jpg"}
              alt={"Emperador veining"}
              decoding={"async"}
            />
            <div
              style={{
                position: "absolute",
                inset: "0",
                background:
                  "linear-gradient(180deg,#2a2825 0%,rgba(26,24,21,.55) 40%,rgba(26,24,21,.75) 100%)",
              }}
            ></div>
          </div>
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0 28px",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(40px,5vw,72px)",
            }}
          >
            <div
              data-rv={""}
              style={{ display: "flex", flexDirection: "column", gap: "22px" }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.8px",
                  color: "#a1563f",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "2px",
                    background: "#a1563f",
                  }}
                ></span>
                {"[ 05 // CONTACT ]"}
              </span>
              <h2
                style={{
                  margin: "0",
                  font: "400 clamp(28px,3vw,44px)/1.1 'Instrument Serif',serif",
                  color: "#a89f92",
                }}
              >
                {"Get an estimate. Call, or send the details."}
              </h2>
              <a
                href={"tel:+16315305883"}
                data-cur={"CALL"}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  color: "#f6efdd",
                  textDecoration: "none",
                  font: "400 clamp(52px,10.4vw,160px)/0.86 'Instrument Serif',serif",
                  letterSpacing: "-0.05em",
                }}
              >
                <span
                  style={{
                    display: "block",
                    overflow: "hidden",
                    paddingBottom: ".08em",
                  }}
                >
                  <span
                    data-rv-line={""}
                    style={{
                      display: "block",
                      transform: "translateY(110%)",
                      transition: "transform .9s cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    {"(631)"}
                  </span>
                </span>
                <span
                  style={{
                    display: "block",
                    overflow: "hidden",
                    paddingBottom: ".08em",
                    marginLeft: ".22em",
                  }}
                >
                  <span
                    data-rv-line={""}
                    style={{
                      display: "block",
                      transform: "translateY(110%)",
                      transition: "transform .9s cubic-bezier(.16,1,.3,1) .08s",
                    }}
                  >
                    {"530"}
                  </span>
                </span>
                <span
                  style={{
                    display: "block",
                    overflow: "hidden",
                    paddingBottom: ".08em",
                    marginLeft: ".22em",
                  }}
                >
                  <span
                    data-rv-line={""}
                    style={{
                      display: "block",
                      transform: "translateY(110%)",
                      transition: "transform .9s cubic-bezier(.16,1,.3,1) .16s",
                    }}
                  >
                    {"5883"}
                  </span>
                </span>
              </a>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
                gap: "clamp(34px,5vw,90px)",
                alignItems: "start",
                borderTop: "1px solid #322e28",
                paddingTop: "clamp(34px,4vw,56px)",
              }}
            >
              <div
                data-rv={""}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "26px",
                  minWidth: "0",
                  opacity: "0",
                  transform: "translateY(40px)",
                  transition:
                    "opacity 1s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1)",
                }}
              >
                <p
                  style={{
                    margin: "0",
                    maxWidth: "42ch",
                    font: "400 19px/1.6 'Source Sans 3',sans-serif",
                    color: "#d6cfc4",
                  }}
                >
                  {
                    "Speak directly with our team, Monday to Saturday. Response expectations are shown when you submit an estimate request."
                  }
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                >
                  <a
                    href={"mailto:jafet.tile@gmail.com"}
                    data-cur={"MAIL"}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "16px",
                      color: "#f6efdd",
                      textDecoration: "none",
                      minHeight: "44px",
                    }}
                  >
                    <span
                      style={{
                        font: "400 10px 'JetBrains Mono',monospace",
                        letterSpacing: "1.6px",
                        color: "#8d857a",
                        width: "64px",
                        flex: "none",
                      }}
                    >
                      {"EMAIL"}
                    </span>
                    <span
                      style={{
                        font: "400 26px 'Instrument Serif',serif",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {"jafet.tile@gmail.com"}
                    </span>
                  </a>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "16px",
                    }}
                  >
                    <span
                      style={{
                        font: "400 10px 'JetBrains Mono',monospace",
                        letterSpacing: "1.6px",
                        color: "#8d857a",
                        width: "64px",
                        flex: "none",
                      }}
                    >
                      {"HOURS"}
                    </span>
                    <span
                      style={{
                        font: "400 17px/1.45 'Source Sans 3',sans-serif",
                        color: "#d6cfc4",
                      }}
                    >
                      {"Monday to Saturday, 7:00 AM – 6:30 PM"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "16px",
                    }}
                  >
                    <span
                      style={{
                        font: "400 10px 'JetBrains Mono',monospace",
                        letterSpacing: "1.6px",
                        color: "#8d857a",
                        width: "64px",
                        flex: "none",
                      }}
                    >
                      {"AREA"}
                    </span>
                    <span
                      style={{
                        font: "400 17px/1.45 'Source Sans 3',sans-serif",
                        color: "#d6cfc4",
                      }}
                    >
                      {"Brentwood, NY · Suffolk · Nassau · New York City"}
                    </span>
                  </div>
                  <a
                    href={
                      "https://www.google.com/maps/search/?api=1&query=Isaac+Stone+and+Tile+Brentwood+NY"
                    }
                    target={"_blank"}
                    rel={"noopener noreferrer"}
                    data-cur={"MAP"}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "16px",
                      color: "#f6efdd",
                      textDecoration: "none",
                      minHeight: "44px",
                    }}
                  >
                    <span
                      style={{
                        font: "400 10px 'JetBrains Mono',monospace",
                        letterSpacing: "1.6px",
                        color: "#8d857a",
                        width: "64px",
                        flex: "none",
                      }}
                    >
                      {"MAP"}
                    </span>
                    <span
                      style={{
                        font: "400 17px/1.45 'Source Sans 3',sans-serif",
                        color: "#d6cfc4",
                        borderBottom: "1px solid #a1563f",
                      }}
                    >
                      {"Directions on Google Maps →"}
                    </span>
                  </a>
                </div>
                <p
                  style={{
                    margin: "0",
                    maxWidth: "42ch",
                    padding: "16px 18px",
                    borderLeft: "2px solid #a1563f",
                    font: "400 16px/1.55 'Source Sans 3',sans-serif",
                    color: "#a89f92",
                  }}
                >
                  {
                    "Price depends on the material, the square footage, and the state of the floor or wall underneath. We tell you the range on the phone before anyone drives out."
                  }
                </p>
              </div>
              <form
                data-rv={""}
                onSubmit={v.onSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  minWidth: "0",
                  background: "#f6efdd",
                  color: "#2a2825",
                  padding: "clamp(24px,3vw,40px)",
                  position: "relative",
                  opacity: "0",
                  transform: "translateY(40px)",
                  transition:
                    "opacity 1s cubic-bezier(.16,1,.3,1) .12s,transform 1s cubic-bezier(.16,1,.3,1) .12s",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "12px",
                    height: "12px",
                    background: "#a1563f",
                  }}
                ></span>
                <span
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    width: "12px",
                    height: "12px",
                    background: "#a1563f",
                  }}
                ></span>
                <span
                  style={{
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#a1563f",
                  }}
                >
                  {"ESTIMATE REQUEST"}
                </span>
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "7px",
                  }}
                >
                  <span style={{ font: "600 15px 'Source Sans 3',sans-serif" }}>
                    {"Your name"}
                  </span>
                  <input
                    type={"text"}
                    name={"name"}
                    autoComplete={"name"}
                    required={true}
                    style={{
                      padding: "13px",
                      border: "0",
                      borderBottom: "1.5px solid #b3aa9c",
                      font: "400 17px 'Source Sans 3',sans-serif",
                      minHeight: "48px",
                      background: "transparent",
                      color: "#2a2825",
                      outline: "none",
                    }}
                    className={"design-effect-40"}
                  />
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                    gap: "16px",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "7px",
                    }}
                  >
                    <span
                      style={{ font: "600 15px 'Source Sans 3',sans-serif" }}
                    >
                      {"Phone"}
                    </span>
                    <input
                      type={"tel"}
                      name={"phone"}
                      autoComplete={"tel"}
                      required={true}
                      style={{
                        padding: "13px",
                        border: "0",
                        borderBottom: "1.5px solid #b3aa9c",
                        font: "400 17px 'Source Sans 3',sans-serif",
                        minHeight: "48px",
                        background: "transparent",
                        color: "#2a2825",
                        outline: "none",
                      }}
                      className={"design-effect-41"}
                    />
                  </label>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "7px",
                    }}
                  >
                    <span
                      style={{ font: "600 15px 'Source Sans 3',sans-serif" }}
                    >
                      {"Email"}
                    </span>
                    <input
                      type={"email"}
                      name={"email"}
                      autoComplete={"email"}
                      style={{
                        padding: "13px",
                        border: "0",
                        borderBottom: "1.5px solid #b3aa9c",
                        font: "400 17px 'Source Sans 3',sans-serif",
                        minHeight: "48px",
                        background: "transparent",
                        color: "#2a2825",
                        outline: "none",
                      }}
                      className={"design-effect-42"}
                    />
                  </label>
                </div>
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "7px",
                  }}
                >
                  <span style={{ font: "600 15px 'Source Sans 3',sans-serif" }}>
                    {"What do you need?"}
                  </span>
                  <select
                    name={"service"}
                    style={{
                      padding: "13px",
                      border: "0",
                      borderBottom: "1.5px solid #b3aa9c",
                      font: "400 17px 'Source Sans 3',sans-serif",
                      minHeight: "48px",
                      background: "transparent",
                      color: "#2a2825",
                      outline: "none",
                    }}
                  >
                    <option>{"Tile installation"}</option>
                    <option>{"Granite installation"}</option>
                    <option>{"Marble installation"}</option>
                    <option>{"Floors or custom surfaces"}</option>
                    <option>{"Structural / foundation (additional)"}</option>
                    <option>{"Something else"}</option>
                  </select>
                </label>

                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "7px",
                  }}
                >
                  <span style={{ font: "600 15px 'Source Sans 3',sans-serif" }}>
                    {"Tell us about the job "}
                    <span style={{ fontWeight: "400", color: "#6b6459" }}>
                      {"(optional)"}
                    </span>
                  </span>
                  <textarea
                    name={"details"}
                    rows={"3"}
                    value={v.formDetails}
                    onChange={v.onDetails}
                    style={{
                      padding: "13px",
                      border: "0",
                      borderBottom: "1.5px solid #b3aa9c",
                      font: "400 17px 'Source Sans 3',sans-serif",
                      background: "transparent",
                      color: "#2a2825",
                      resize: "vertical",
                      outline: "none",
                    }}
                    className={"design-effect-43"}
                  ></textarea>
                </label>
                <button
                  type={"submit"}
                  data-cur={"SEND"}
                  onMouseMove={v.magnet}
                  onMouseLeave={v.unmagnet}
                  style={{
                    padding: "18px",
                    background: "#a1563f",
                    color: "#fff",
                    border: "none",
                    font: "700 17px 'Source Sans 3',sans-serif",
                    minHeight: "56px",
                    cursor: "pointer",
                    transition: "transform .4s cubic-bezier(.16,1,.3,1)",
                  }}
                >
                  {"Prepare estimate email"}
                </button>
                <p
                  aria-live={"polite"}
                  style={{
                    margin: "0",
                    font: "400 14px/1.45 'Source Sans 3',sans-serif",
                    color: "#5a544b",
                  }}
                >
                  {v.formNote}
                </p>
              </form>
            </div>
          </div>
        </section>

        {v.lbOpen && (
          <>
            <dialog
              ref={(element) => {
                if (element && !element.open) element.showModal();
              }}
              onCancel={(event) => {
                event.preventDefault();
                v.closeReel();
              }}
              onClick={v.closeReel}
              role={"dialog"}
              aria-label={"Video"}
              style={{
                margin: "0",
                border: "0",
                width: "100vw",
                height: "100dvh",
                maxWidth: "none",
                maxHeight: "none",
                position: "fixed",
                inset: "0",
                zIndex: "60",
                background: "rgba(15,14,13,.9)",
                backdropFilter: "blur(14px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                animation: "lbFade .4s ease both",
              }}
            >
              <div
                onClick={v.stop}
                style={{
                  position: "relative",
                  height: "min(86vh,820px)",
                  aspectRatio: v.lbAspect,
                  maxWidth: "calc(100vw - 48px)",
                  background: "#000",
                  border: "1px solid #322e28",
                  boxShadow: "0 40px 120px rgba(0,0,0,.7)",
                  animation: "lbIn .7s cubic-bezier(.16,1,.3,1) both",
                  overflow: "hidden",
                }}
              >
                {v.lbHasVideo && <> {v.lbVideoEl}</>}
                {v.lbShowEmbed && (
                  <>
                    {" "}
                    <div
                      style={{
                        position: "absolute",
                        inset: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px",
                        textAlign: "center",
                        font: "400 15px/1.5 'Source Sans 3',sans-serif",
                        color: "#d6cfc4",
                      }}
                    >
                      {"This clip could not load. "}
                      <a
                        href={"https://www.instagram.com/jafettile____com/"}
                        target={"_blank"}
                        rel={"noopener noreferrer"}
                        style={{ color: "#f6efdd" }}
                      >
                        {"Watch it on Instagram →"}
                      </a>
                    </div>
                  </>
                )}
              </div>
              <button
                type={"button"}
                onClick={v.closeReel}
                aria-label={"Close"}
                data-cur={"CLOSE"}
                style={{
                  position: "absolute",
                  top: "22px",
                  right: "24px",
                  width: "48px",
                  height: "48px",
                  border: "1px solid rgba(246,239,221,.4)",
                  background: "transparent",
                  color: "#f6efdd",
                  font: "400 20px 'Source Sans 3',sans-serif",
                  cursor: "pointer",
                }}
              >
                {"✕"}
              </button>
              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  pointerEvents: "none",
                  maxWidth: "calc(100vw - 48px)",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    font: "400 clamp(18px,2vw,24px)/1.1 'Instrument Serif',serif",
                    color: "#f6efdd",
                  }}
                >
                  {v.lbTitle}
                </span>
                <a
                  href={"https://www.instagram.com/jafettile____com/"}
                  target={"_blank"}
                  rel={"noopener noreferrer"}
                  style={{
                    pointerEvents: "auto",
                    font: "400 10px 'JetBrains Mono',monospace",
                    letterSpacing: "1.6px",
                    color: "#a89f92",
                    textDecoration: "none",
                    borderBottom: "1px solid #a1563f",
                    paddingBottom: "3px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {"MORE ON INSTAGRAM →"}
                </a>
              </div>
            </dialog>
          </>
        )}
        <div
          data-mobbar={""}
          style={{
            position: "fixed",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: "38",
            display: "none",
            gap: "1px",
            background: "#2a2825",
            borderTop: "1px solid #4a453d",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <a
            href={"tel:+16315305883"}
            style={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "54px",
              color: "#f6efdd",
              font: "700 15px 'Source Sans 3',sans-serif",
              textDecoration: "none",
              background: "#1c1a17",
            }}
          >
            {"Call"}
          </a>
          <a
            href={"#contact"}
            style={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "54px",
              color: "#fff",
              font: "700 15px 'Source Sans 3',sans-serif",
              textDecoration: "none",
              background: "#a1563f",
            }}
          >
            {"Request an estimate"}
          </a>
        </div>
        <footer
          data-footer={""}
          style={{
            position: "relative",
            zIndex: "9",
            background: "#1c1a17",
            color: "#f6efdd",
            borderTop: "2px solid #a1563f",
            overflow: "hidden",
            boxShadow: "0 -40px 80px rgba(0,0,0,.4)",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "clamp(56px,7vw,110px) 28px 40px",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(30px,4vw,60px)",
            }}
          >
            <div
              data-fmark={""}
              style={{
                font: "400 clamp(48px,12.4vw,190px)/0.84 'Instrument Serif',serif",
                letterSpacing: "-0.05em",
                color: "#f6efdd",
                willChange: "transform",
              }}
            >
              <span style={{ display: "block" }}>{"Isaac Stone"}</span>
              <span style={{ display: "block" }}>
                <em style={{ fontStyle: "italic", color: "#d9a58f" }}>
                  {"and"}
                </em>
                {" Tile"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "22px 40px",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid #322e28",
                paddingTop: "26px",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "18px" }}
              >
                <img
                  src={"/assets/design/img30.png"}
                  alt={"Isaac Stone and Tile"}
                  width={"220"}
                  height={"86"}
                  style={{
                    display: "block",
                    height: "86px",
                    width: "auto",
                    objectFit: "contain",
                    flex: "none",
                  }}
                />
                <span
                  style={{
                    font: "400 14px/1.5 'Source Sans 3',sans-serif",
                    color: "#8d857a",
                  }}
                >
                  {"© 2026 Isaac Stone and Tile"}
                  <br />
                  {"Brentwood, New York"}
                  <br />
                  <span style={{ color: "#6b6459", fontSize: "12px" }}>
                    {
                      "Owner-led tile, marble and stone installation. Brentwood, New York."
                    }
                  </span>
                </span>
              </span>
              <span
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "26px",
                  font: "400 10px 'JetBrains Mono',monospace",
                  letterSpacing: "1.6px",
                }}
              >
                <a
                  href={"tel:+16315305883"}
                  style={{ color: "#f6efdd", textDecoration: "none" }}
                >
                  {"(631) 530-5883"}
                </a>
                <a
                  href={"mailto:jafet.tile@gmail.com"}
                  style={{ color: "#f6efdd", textDecoration: "none" }}
                >
                  {"EMAIL"}
                </a>
                <a
                  href={"https://www.instagram.com/jafettile____com/"}
                  target={"_blank"}
                  rel={"noopener noreferrer"}
                  style={{ color: "#f6efdd", textDecoration: "none" }}
                >
                  {"INSTAGRAM"}
                </a>
                <a
                  href={"/privacy.html"}
                  style={{ color: "#8d857a", textDecoration: "none" }}
                >
                  {"PRIVACY"}
                </a>
                <a
                  href={"#top"}
                  data-cur={"TOP"}
                  style={{ color: "#8d857a", textDecoration: "none" }}
                >
                  {"TOP ↑"}
                </a>
              </span>
            </div>
          </div>
        </footer>
      </>
    );
  }
}
