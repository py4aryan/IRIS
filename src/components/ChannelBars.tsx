interface ChannelBarsProps {
  bars: number[];
  active: boolean;
}

export function ChannelBars({ bars, active }: ChannelBarsProps) {
  return (
    <div className="flex items-end gap-1 h-8">
      {bars.map((v, i) => {
        const idle = 0.06 + 0.04 * Math.abs(Math.sin(i * 1.3));
        const height = active ? Math.max(0.08, v) : idle;
        return (
          <span
            key={i}
            className="w-1 rounded-full bg-linear-to-t from-cyan-glow/40 to-cyan-glow"
            style={{
              height: `${8 + height * 24}px`,
              opacity: active ? 0.55 + height * 0.45 : 0.25,
              transition: "height 100ms ease-out, opacity 200ms ease-out",
              boxShadow: active && height > 0.3 ? "0 0 6px rgba(94,200,255,0.7)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}
