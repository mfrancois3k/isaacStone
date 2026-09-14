type State =
  "idle" | "connecting" | "listening" | "thinking" | "speaking" | "paused";
const frames = ["idle", "listening", "thinking", "speaking", "paused"] as const;

/** All five images stay mounted: state changes animate only their opacity. */
export function MarbleSphere({
  state,
}: {
  state: State;
  getAudioLevel?: (output: boolean) => number;
}) {
  const active = state === "connecting" ? "thinking" : state;
  return (
    <div
      className="marble-stage marble-frames"
      aria-hidden="true"
      data-state={active}
    >
      <span className="marble-glow" />
      {frames.map((frame) => (
        <img
          key={frame}
          src={`/assets/wamy/${frame}.png`}
          alt=""
          width={1254}
          height={1254}
          style={{ opacity: frame === active ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
