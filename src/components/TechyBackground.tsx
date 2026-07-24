export function TechyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#03050a]">
      {/* base radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_15%,rgba(24,74,110,0.35),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_90%,rgba(24,74,110,0.2),transparent_60%)]" />

      {/* grid */}
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(94,200,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(94,200,255,0.5)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(ellipse_75%_75%_at_50%_35%,black,transparent)]" />

      {/* diagonal fine grid for texture */}
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(45deg,rgba(94,200,255,0.6)_1px,transparent_1px)] [background-size:14px_14px]" />

      {/* scanning sweep */}
      <div className="absolute inset-x-0 -top-1/2 h-1/2 bg-linear-to-b from-transparent via-cyan-glow/[0.05] to-transparent animate-[scan_9s_linear_infinite]" />

      {/* corner HUD brackets */}
      <svg className="absolute top-4 left-4 w-16 h-16 text-cyan-glow/25" viewBox="0 0 64 64" fill="none">
        <path d="M2 22V2H22" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg className="absolute top-4 right-4 w-16 h-16 text-cyan-glow/25" viewBox="0 0 64 64" fill="none">
        <path d="M42 2H62V22" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg className="absolute bottom-4 left-4 w-16 h-16 text-cyan-glow/25" viewBox="0 0 64 64" fill="none">
        <path d="M2 42V62H22" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg className="absolute bottom-4 right-4 w-16 h-16 text-cyan-glow/25" viewBox="0 0 64 64" fill="none">
        <path d="M42 62H62V42" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_55%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
}
