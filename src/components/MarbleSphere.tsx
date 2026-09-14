import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type State =
  "idle" | "connecting" | "listening" | "thinking" | "speaking" | "paused";
export function MarbleSphere({
  state,
  getAudioLevel,
}: {
  state: State;
  getAudioLevel: (output: boolean) => number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const sprite = new Image();
    sprite.src = "/assets/wamy/marble-bead.png";
    let raf = 0,
      level = 0,
      previous = 0,
      stopped = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    el.width = el.height = 280 * dpr;
    ctx.scale(dpr, dpr);
    // Stable Fibonacci distribution; beads retain their identities between states.
    const beads = Array.from({ length: 250 }, (_, i) => {
      const z = 1 - (2 * (i + 0.5)) / 250;
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      const radius = Math.sqrt(1 - z * z);
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z, i };
    }).sort((a, b) => a.z - b.z);
    const draw = (now: number) => {
      if (stopped) return;
      const dt = Math.min(60, now - (previous || now));
      previous = now;
      const active = state === "speaking" || state === "listening";
      const target = active ? getAudioLevel(state === "speaking") : 0;
      level +=
        (target - level) * (1 - Math.exp(-dt / (target > level ? 80 : 300)));
      const thinking = state === "thinking" || state === "connecting";
      const expansion =
        1 +
        (state === "listening" ? 0.08 : 0) +
        level * (state === "speaking" ? 0.35 : 0.1);
      ctx.clearRect(0, 0, 280, 280);
      for (const bead of beads) {
        const drift = thinking ? Math.sin(now / 1300 + bead.i * 0.7) * 1.5 : 0;
        const x = bead.x * (82 * expansion + drift),
          y = bead.y * (82 * expansion + drift);
        if (Math.hypot(x, y) < 34) continue;
        const noise = (Math.sin(bead.i * 127.1) * 43758.5453) % 1;
        const size = 10 + (bead.z + 1) * 4 + Math.abs(noise) * 15;
        ctx.globalAlpha = 0.68 + (bead.z + 1) * 0.16;
        if (sprite.complete && sprite.naturalWidth)
          ctx.drawImage(
            sprite,
            140 + x - size / 2,
            140 + y - size / 2,
            size,
            size,
          );
        if (bead.i % 19 === 0) {
          ctx.beginPath();
          ctx.arc(140 + x, 140 + y, size * 0.29, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(
            138 + x,
            137 + y,
            0,
            140 + x,
            140 + y,
            size * 0.3,
          );
          grad.addColorStop(0, "#dca180");
          grad.addColorStop(0.6, "#a95738");
          grad.addColorStop(1, "#75452f");
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (!document.hidden && (active || thinking || level > 0.005))
        raf = requestAnimationFrame(draw);
    };
    const wake = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    };
    sprite.onload = wake;
    wake();
    document.addEventListener("visibilitychange", wake);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", wake);
    };
  }, [state, reduced, getAudioLevel]);
  const asset = state === "connecting" ? "thinking" : state;
  return (
    <div className="marble-stage" aria-hidden="true">
      {reduced ? (
        <img src={`/assets/wamy/${asset}.png`} alt="" />
      ) : (
        <>
          <canvas ref={canvas} />
          <span className="marble-core">
            <svg viewBox="0 0 48 48" fill="none">
              <path
                d="M10 21v6M17 15v18M24 9v30M31 15v18M38 21v6"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </>
      )}
    </div>
  );
}
