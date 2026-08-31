export function TechyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#07080b]">
      {/* one confident glow, anchored upper-left where the eye sits */}
      <div className="absolute -top-[10%] left-[6%] w-[45vw] h-[45vw] rounded-full bg-cyan-glow/[0.1] blur-[140px]" />
      <div className="absolute top-[30%] right-[8%] w-[30vw] h-[30vw] rounded-full bg-amber-glow/[0.045] blur-[130px]" />

      {/* faint grain, no grid/scanline/circuit clutter */}
      <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(255,255,255,0.7)_0.6px,transparent_0.8px)] [background-size:5px_5px]" />

      {/* soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_0%,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
