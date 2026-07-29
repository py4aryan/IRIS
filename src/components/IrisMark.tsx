interface IrisMarkProps {
  size?: number;
  className?: string;
  active?: boolean;
}

const SPARKLES = [
  { x: 62, y: 58, r: 1.8 }, { x: 138, y: 66, r: 1.3 }, { x: 150, y: 118, r: 1.6 },
  { x: 55, y: 128, r: 1.2 }, { x: 78, y: 142, r: 1.4 }, { x: 122, y: 40, r: 1.1 },
  { x: 44, y: 96, r: 1.5 }, { x: 156, y: 96, r: 1.3 }, { x: 100, y: 45, r: 1.2 },
  { x: 100, y: 155, r: 1.1 }, { x: 88, y: 70, r: 0.9 }, { x: 118, y: 128, r: 0.9 },
];

const OUTER_SPARKLES = [
  { x: -6, y: 40, r: 1.1 }, { x: 210, y: 150, r: 1.3 }, { x: -10, y: 150, r: 0.9 },
  { x: 206, y: 45, r: 1 }, { x: 100, y: -8, r: 1 }, { x: 100, y: 208, r: 0.9 },
];

const STARS = [
  { x: 68, y: 50, s: 3.6 },
  { x: 146, y: 90, s: 2.8 },
  { x: 62, y: 132, s: 3 },
  { x: -2, y: 100, s: 2.4 },
];

function Star({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <path
      d={`M ${x} ${y - s} L ${x + s * 0.28} ${y - s * 0.28} L ${x + s} ${y} L ${x + s * 0.28} ${y + s * 0.28} L ${x} ${y + s} L ${x - s * 0.28} ${y + s * 0.28} L ${x - s} ${y} L ${x - s * 0.28} ${y - s * 0.28} Z`}
      fill="#eaffff"
      opacity="0.9"
    />
  );
}

/**
 * IRIS mark: two thick swirling ribbon blades form the eye boundary itself,
 * wrapped in a broken halo ring, with a fractured radial core and drifting
 * sparkle dust — a closer vector recreation of the source logo.
 */
export function IrisMark({ size = 160, className = "", active = true }: IrisMarkProps) {
  const shards = Array.from({ length: 24 });

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="-14 -14 228 228"
        width={size}
        height={size}
        className="relative z-10 drop-shadow-[0_0_30px_rgba(94,200,255,0.6)]"
      >
        <defs>
          <radialGradient id="im-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#bff3ff" />
            <stop offset="65%" stopColor="#5ec8ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1a5a7a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="im-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#8fefff" />
            <stop offset="100%" stopColor="#3f8fd6" />
          </linearGradient>
          <linearGradient id="im-blade" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#bdf3ff" />
            <stop offset="60%" stopColor="#5ec8ff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#123049" stopOpacity="0.15" />
          </linearGradient>
          <clipPath id="im-clip">
            <path d="M 4 100 Q 100 18 196 100 Q 100 182 4 100 Z" />
          </clipPath>
          <path
            id="im-blade-shape"
            d="M 4 100
               Q 100 18 150 45
               C 130 55, 116 66, 107 82
               C 103 90, 101 95, 100 100
               C 90 92, 60 88, 30 90
               Q 15 95 4 100 Z"
          />
        </defs>

        {/* soft bloom behind everything */}
        <circle cx="100" cy="100" r="78" fill="url(#im-core)" opacity="0.3" />

        {/* broken halo ring, larger than the eye, sits behind it */}
        <circle cx="100" cy="100" r="104" fill="none" stroke="#5ec8ff" strokeWidth="0.75" opacity="0.15" />
        <path d="M 100 -4 A 104 104 0 0 0 6 60" fill="none" stroke="url(#im-stroke)" strokeWidth="2" opacity="0.75" />
        <path d="M 100 204 A 104 104 0 0 0 194 140" fill="none" stroke="#7fe7ff" strokeWidth="1.25" opacity="0.5" />
        <rect x="97" y="-8" width="6" height="10" fill="#eaffff" opacity="0.7" transform="rotate(0 100 100)" />
        <rect x="97" y="198" width="6" height="10" fill="#7fe7ff" opacity="0.5" />

        {/* outer sparkle dust, beyond the eye silhouette */}
        <g opacity="0.55">
          {OUTER_SPARKLES.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#bff3ff" opacity={0.3 + (i % 3) * 0.15} />
          ))}
        </g>

        {/* outer eye silhouette, crisp edge */}
        <path
          d="M 4 100 Q 100 18 196 100 Q 100 182 4 100 Z"
          fill="none"
          stroke="url(#im-stroke)"
          strokeWidth="2.25"
        />

        <g clipPath="url(#im-clip)">
          {/* particle dust field */}
          <g opacity="0.7">
            {SPARKLES.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#bff3ff" opacity={0.35 + (i % 4) * 0.15} />
            ))}
            {STARS.map((s, i) => (
              <Star key={i} {...s} />
            ))}
          </g>

          {/* swirling shutter blades — these define the eye's visual boundary */}
          <g className={active ? "animate-spin-slow" : ""} style={{ transformOrigin: "100px 100px" }}>
            <use href="#im-blade-shape" fill="url(#im-blade)" stroke="#eaffff" strokeWidth="0.5" strokeOpacity="0.4" />
            <use
              href="#im-blade-shape"
              fill="url(#im-blade)"
              stroke="#eaffff"
              strokeWidth="0.5"
              strokeOpacity="0.4"
              transform="rotate(180 100 100)"
            />
          </g>

          {/* concentric rings */}
          <g className={active ? "animate-spin-reverse" : ""} style={{ transformOrigin: "100px 100px" }}>
            <circle cx="100" cy="100" r="68" fill="none" stroke="#7fe7ff" strokeWidth="1" opacity="0.25" />
            <circle
              cx="100"
              cy="100"
              r="54"
              fill="none"
              stroke="url(#im-stroke)"
              strokeWidth="1.25"
              strokeDasharray="5 9"
              opacity="0.8"
            />
            <circle cx="100" cy="100" r="36" fill="none" stroke="#eaffff" strokeWidth="0.75" opacity="0.4" />
          </g>

          {/* fractured radial shards, compass-like */}
          <g className={active ? "animate-spin-slow" : ""} style={{ transformOrigin: "100px 100px" }}>
            {shards.map((_, i) => {
              const angle = (i / shards.length) * 360;
              const long = i % 4 === 0;
              const mid = i % 4 === 2;
              return (
                <line
                  key={i}
                  x1="100"
                  y1={long ? 54 : mid ? 62 : 68}
                  x2="100"
                  y2="34"
                  stroke="#8fefff"
                  strokeWidth={long ? 1.6 : mid ? 1 : 0.6}
                  opacity={long ? 0.9 : mid ? 0.55 : 0.3}
                  transform={`rotate(${angle} 100 100)`}
                />
              );
            })}
          </g>

          {/* core */}
          <circle cx="100" cy="100" r="25" fill="url(#im-core)" className={active ? "animate-pulse-glow" : ""} />
          <circle cx="100" cy="100" r="20" fill="none" stroke="#eaffff" strokeWidth="0.75" opacity="0.55" />
          <circle cx="100" cy="100" r="9" fill="#031620" />
          <circle cx="100" cy="100" r="9" fill="none" stroke="#eaffff" strokeWidth="1" opacity="0.9" />
          <circle cx="104.5" cy="94.5" r="2.3" fill="#ffffff" opacity="0.95" />

          {/* accent orb, offset like a small moon */}
          <circle cx="129" cy="75" r="5" fill="#c9c2e8" opacity="0.9" />
          <circle cx="129" cy="75" r="5" fill="none" stroke="#eaffff" strokeWidth="0.5" opacity="0.65" />
          <circle cx="127.5" cy="73.5" r="1.4" fill="#ffffff" opacity="0.8" />
        </g>
      </svg>
    </div>
  );
}
