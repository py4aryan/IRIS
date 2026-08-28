interface EyeReticleProps {
  audioLevel: number;
  stateCode: string;
  commandCount: number;
}

const CX = 240;
const CY = 240;
const RING_R = 200;

function polar(r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function leaderPath(angleDeg: number, side: "left" | "right") {
  const attach = polar(RING_R, angleDeg);
  const elbow = polar(RING_R + 26, angleDeg);
  const end = { x: elbow.x + (side === "left" ? -52 : 52), y: elbow.y };
  return {
    d: `M ${attach.x.toFixed(1)} ${attach.y.toFixed(1)} L ${elbow.x.toFixed(1)} ${elbow.y.toFixed(1)} L ${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
    attach,
    end,
  };
}

const SPARKLE_ANGLES = [18, 108, 205, 288];

function Sparkle({ angle }: { angle: number }) {
  const { x, y } = polar(RING_R, angle);
  const s = 4;
  return (
    <path
      d={`M ${x} ${y - s} L ${x + s * 0.3} ${y - s * 0.3} L ${x + s} ${y} L ${x + s * 0.3} ${y + s * 0.3} L ${x} ${y + s} L ${x - s * 0.3} ${y + s * 0.3} L ${x - s} ${y} L ${x - s * 0.3} ${y - s * 0.3} Z`}
      fill="#eaffff"
      opacity="0.85"
    />
  );
}

export function EyeReticle({ audioLevel, stateCode, commandCount }: EyeReticleProps) {
  const readouts = [
    { angle: 235, side: "left" as const, label: "MIC", value: `${Math.round(audioLevel * 100)}%` },
    { angle: 325, side: "right" as const, label: "SIG", value: stateCode },
    { angle: 55, side: "right" as const, label: "CMD", value: String(commandCount) },
  ];

  return (
    <div className="absolute w-[340px] h-[340px] pointer-events-none">
      <svg viewBox="0 0 480 480" className="absolute inset-0 w-full h-full overflow-visible">
        {/* faint scope crosshair, fixed */}
        <line x1="40" y1={CY} x2="440" y2={CY} stroke="#7fe7ff" strokeWidth="1" opacity="0.08" />
        <line x1={CX} y1="40" x2={CX} y2="440" stroke="#7fe7ff" strokeWidth="1" opacity="0.08" />

        {/* outer static ring */}
        <circle cx={CX} cy={CY} r={RING_R} fill="none" stroke="#7fe7ff" strokeWidth="1" opacity="0.22" />

        {/* rotating tick ring + sparkle glints */}
        <g
          className="text-cyan-glow/60 animate-spin-slow [animation-duration:46s]"
          style={{ transformOrigin: "240px 240px" }}
        >
          {Array.from({ length: 56 }).map((_, i) => {
            const angle = (i / 56) * 360;
            const long = i % 7 === 0;
            return (
              <line
                key={i}
                x1={CX}
                y1={CY - RING_R - 18}
                x2={CX}
                y2={CY - RING_R - (long ? 6 : 10)}
                stroke="currentColor"
                strokeWidth={long ? 1.5 : 0.75}
                opacity={long ? 0.85 : 0.4}
                transform={`rotate(${angle} ${CX} ${CY})`}
              />
            );
          })}
          {SPARKLE_ANGLES.map((a) => (
            <Sparkle key={a} angle={a} />
          ))}
        </g>

        {/* reverse dashed ring */}
        <circle
          cx={CX}
          cy={CY}
          r={RING_R - 32}
          fill="none"
          stroke="#7fe7ff"
          strokeWidth="1"
          strokeDasharray="2 15"
          opacity="0.25"
          className="animate-spin-reverse [animation-duration:34s]"
          style={{ transformOrigin: "240px 240px" }}
        />

        {/* fixed leader-line readouts */}
        {readouts.map((r) => {
          const { d, attach } = leaderPath(r.angle, r.side);
          return (
            <g key={r.label}>
              <path d={d} fill="none" stroke="#7fe7ff" strokeWidth="1" opacity="0.5" />
              <circle cx={attach.x} cy={attach.y} r="2.5" fill="#eaffff" opacity="0.8" />
            </g>
          );
        })}
      </svg>

      {readouts.map((r) => {
        const { end } = leaderPath(r.angle, r.side);
        const leftPct = (end.x / 480) * 100;
        const topPct = (end.y / 480) * 100;
        return (
          <div
            key={r.label}
            className={`absolute text-[10px] font-mono tracking-widest text-cyan-glow/70 whitespace-nowrap ${
              r.side === "left" ? "-translate-x-full text-right" : ""
            }`}
            style={{ left: `${leftPct}%`, top: `${topPct}%`, transform: `translateY(-50%) ${r.side === "left" ? "translateX(-100%)" : ""}` }}
          >
            <span className="text-slate-500">{r.label}</span> <span className="text-slate-200">{r.value}</span>
          </div>
        );
      })}
    </div>
  );
}
