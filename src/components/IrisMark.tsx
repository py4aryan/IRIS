interface IrisMarkProps {
  size?: number;
  className?: string;
  active?: boolean;
}

/**
 * Recreation of the IRIS mark: a HUD-style eye built from concentric rings,
 * radial ticks and a glowing core. Pure SVG so it stays crisp at any size
 * and can be animated with CSS.
 */
export function IrisMark({ size = 160, className = "", active = true }: IrisMarkProps) {
  const ticks = Array.from({ length: 24 });

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="relative z-10 drop-shadow-[0_0_25px_rgba(94,200,255,0.45)]"
      >
        <defs>
          <radialGradient id="core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eaffff" />
            <stop offset="35%" stopColor="#7fe7ff" />
            <stop offset="100%" stopColor="#1a5a7a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ringStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eaffff" />
            <stop offset="50%" stopColor="#7fe7ff" />
            <stop offset="100%" stopColor="#3f8fd6" />
          </linearGradient>
          <clipPath id="eyeClip">
            <path d="M 6 100 Q 100 22 194 100 Q 100 178 6 100 Z" />
          </clipPath>
        </defs>

        {/* outer eye silhouette */}
        <path
          d="M 6 100 Q 100 22 194 100 Q 100 178 6 100 Z"
          fill="none"
          stroke="url(#ringStroke)"
          strokeWidth="2.5"
          opacity="0.9"
        />
        <path
          d="M 6 100 Q 100 34 194 100 Q 100 166 6 100 Z"
          fill="none"
          stroke="#7fe7ff"
          strokeWidth="1"
          opacity="0.35"
        />

        <g clipPath="url(#eyeClip)">
          {/* faint particle field */}
          <g opacity="0.5">
            {ticks.map((_, i) => {
              const angle = (i / ticks.length) * 2 * Math.PI;
              const r = 40 + ((i * 37) % 45);
              const x = 100 + r * Math.cos(angle);
              const y = 100 + r * Math.sin(angle);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={i % 5 === 0 ? 1.6 : 0.8}
                  fill="#bff3ff"
                  opacity={0.3 + (i % 4) * 0.15}
                />
              );
            })}
          </g>

          {/* rotating ring group 1 */}
          <g
            className={active ? "animate-spin-slow" : ""}
            style={{ transformOrigin: "100px 100px" }}
          >
            <circle cx="100" cy="100" r="70" fill="none" stroke="#7fe7ff" strokeWidth="1" opacity="0.25" />
            <circle
              cx="100"
              cy="100"
              r="58"
              fill="none"
              stroke="url(#ringStroke)"
              strokeWidth="1.5"
              strokeDasharray="6 10"
              opacity="0.8"
            />
            {ticks.map((_, i) => {
              const angle = (i / ticks.length) * 360;
              return (
                <line
                  key={i}
                  x1="100"
                  y1="30"
                  x2="100"
                  y2="24"
                  stroke="#7fe7ff"
                  strokeWidth="1.5"
                  opacity={i % 3 === 0 ? 0.9 : 0.35}
                  transform={`rotate(${angle} 100 100)`}
                />
              );
            })}
          </g>

          {/* rotating ring group 2 (reverse) */}
          <g
            className={active ? "animate-spin-reverse" : ""}
            style={{ transformOrigin: "100px 100px" }}
          >
            <circle cx="100" cy="100" r="42" fill="none" stroke="#eaffff" strokeWidth="1" opacity="0.4" />
            <path
              d="M 66 100 A 34 34 0 0 1 134 100"
              fill="none"
              stroke="url(#ringStroke)"
              strokeWidth="2"
            />
            <path
              d="M 134 100 A 34 34 0 0 1 66 100"
              fill="none"
              stroke="#3f8fd6"
              strokeWidth="1"
              opacity="0.6"
            />
          </g>

          {/* iris core */}
          <circle cx="100" cy="100" r="26" fill="url(#core)" className={active ? "animate-pulse-glow" : ""} />
          <circle cx="100" cy="100" r="9" fill="#03151f" />
          <circle cx="100" cy="100" r="9" fill="none" stroke="#eaffff" strokeWidth="1" opacity="0.8" />
          <circle cx="105" cy="94" r="2.4" fill="#ffffff" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}
