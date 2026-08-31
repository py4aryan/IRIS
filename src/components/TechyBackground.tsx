const NODES = [
  { x: "8%", y: "18%" }, { x: "92%", y: "22%" }, { x: "14%", y: "78%" },
  { x: "88%", y: "72%" }, { x: "50%", y: "8%" }, { x: "6%", y: "50%" },
];

const READOUTS = ["0x1F9A", "42.108", "SYS-7", "0011010", "AUX//4"];

export function TechyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050609]">
      {/* gradient-mesh blobs — cyan + amber for a two-tone palette instead of monochrome */}
      <div className="absolute -top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full bg-cyan-glow/[0.09] blur-[120px]" />
      <div className="absolute top-1/3 -right-1/4 w-[50vw] h-[50vw] rounded-full bg-amber-glow/[0.05] blur-[130px]" />
      <div className="absolute -bottom-1/4 left-1/3 w-[55vw] h-[55vw] rounded-full bg-blue-glow/[0.07] blur-[130px]" />

      {/* soft dot-grid, far subtler than a wireframe blueprint */}
      <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(94,200,255,0.9)_1px,transparent_1.2px)] [background-size:36px_36px] [mask-image:radial-gradient(ellipse_80%_75%_at_50%_35%,black,transparent)]" />

      {/* scanning sweep */}
      <div className="absolute inset-x-0 -top-1/2 h-1/2 bg-linear-to-b from-transparent via-cyan-glow/[0.05] to-transparent animate-[scan_11s_linear_infinite]" />

      {/* circuit nodes with connecting blips */}
      {NODES.map((n, i) => (
        <span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-cyan-glow/40 animate-pulse-glow"
          style={{ left: n.x, top: n.y, animationDelay: `${i * 0.6}s` }}
        />
      ))}

      {/* faint HUD readout labels */}
      {READOUTS.map((r, i) => (
        <span
          key={r}
          className="absolute text-[9px] tracking-widest text-cyan-glow/20 font-mono select-none"
          style={{
            left: `${4 + i * 19}%`,
            top: i % 2 === 0 ? "4%" : "94%",
          }}
        >
          {r}
        </span>
      ))}

      {/* corner HUD brackets */}
      <svg className="absolute top-4 left-4 w-20 h-20 text-cyan-glow/25" viewBox="0 0 64 64" fill="none">
        <path d="M2 22V2H22" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="2" cy="2" r="2" fill="currentColor" />
      </svg>
      <svg className="absolute top-4 right-4 w-20 h-20 text-amber-glow/25" viewBox="0 0 64 64" fill="none">
        <path d="M42 2H62V22" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="62" cy="2" r="2" fill="currentColor" />
      </svg>
      <svg className="absolute bottom-4 left-4 w-20 h-20 text-amber-glow/25" viewBox="0 0 64 64" fill="none">
        <path d="M2 42V62H22" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="2" cy="62" r="2" fill="currentColor" />
      </svg>
      <svg className="absolute bottom-4 right-4 w-20 h-20 text-cyan-glow/25" viewBox="0 0 64 64" fill="none">
        <path d="M42 62H62V42" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="62" cy="62" r="2" fill="currentColor" />
      </svg>

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_50%,rgba(0,0,0,0.72)_100%)]" />
    </div>
  );
}
