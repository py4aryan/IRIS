const CX = 240;
const CY = 240;
const RING_R = 200;

function polar(r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

const SPARKLE_ANGLES = [18, 108, 205, 288];

function Sparkle({ angle }: { angle: number }) {
  const { x, y } = polar(RING_R, angle);
  const s = 4;
  return (
    <path
      d={`M ${x} ${y - s} L ${x + s * 0.3} ${y - s * 0.3} L ${x + s} ${y} L ${x + s * 0.3} ${y + s * 0.3} L ${x} ${y + s} L ${x - s * 0.3} ${y + s * 0.3} L ${x - s} ${y} L ${x - s * 0.3} ${y - s * 0.3} Z`}
      fill="#eaffff"
      opacity="0.7"
    />
  );
}

/** Purely decorative motion around the eye — no readouts, no leader lines. */
export function EyeReticle() {
  return (
    <div className="absolute w-[300px] h-[300px] pointer-events-none">
      <svg viewBox="0 0 480 480" className="absolute inset-0 w-full h-full overflow-visible">
        <circle cx={CX} cy={CY} r={RING_R} fill="none" stroke="#7fe7ff" strokeWidth="1" opacity="0.14" />

        <g
          className="text-cyan-glow/40 animate-spin-slow [animation-duration:52s]"
          style={{ transformOrigin: "240px 240px" }}
        >
          {Array.from({ length: 48 }).map((_, i) => {
            const angle = (i / 48) * 360;
            const long = i % 8 === 0;
            return (
              <line
                key={i}
                x1={CX}
                y1={CY - RING_R - 14}
                x2={CX}
                y2={CY - RING_R - (long ? 5 : 9)}
                stroke="currentColor"
                strokeWidth={long ? 1.3 : 0.6}
                opacity={long ? 0.7 : 0.3}
                transform={`rotate(${angle} ${CX} ${CY})`}
              />
            );
          })}
          {SPARKLE_ANGLES.map((a) => (
            <Sparkle key={a} angle={a} />
          ))}
        </g>

        <circle
          cx={CX}
          cy={CY}
          r={RING_R - 32}
          fill="none"
          stroke="#7fe7ff"
          strokeWidth="1"
          strokeDasharray="2 16"
          opacity="0.18"
          className="animate-spin-reverse [animation-duration:38s]"
          style={{ transformOrigin: "240px 240px" }}
        />
      </svg>
    </div>
  );
}
