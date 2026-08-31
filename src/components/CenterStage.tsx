import { useEffect, useState } from "react";
import { Camera, Keyboard } from "lucide-react";
import { IrisMark } from "./IrisMark";
import { ChannelBars } from "./ChannelBars";
import { EyeReticle } from "./EyeReticle";
import type { VoiceState } from "../hooks/useVoiceCommands";

interface CenterStageProps {
  voiceState: VoiceState;
  supported: boolean;
  voiceEnabledOnce: boolean;
  audioLevel: number;
  bars: number[];
  commandCount: number;
  cameraOn: boolean;
  userName: string;
  onToggleVoice: () => void;
  onToggleCamera: () => void;
  onKeyboardClick: () => void;
}

const STATE_LABEL: Record<VoiceState, string> = {
  disabled: "Idle",
  listening: "Listening",
  awake: "Awake",
  processing: "Thinking",
};

function greetingFor(hour: number) {
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function CenterStage({
  voiceState,
  supported,
  voiceEnabledOnce,
  audioLevel,
  bars,
  commandCount,
  cameraOn,
  userName,
  onToggleVoice,
  onToggleCamera,
  onKeyboardClick,
}: CenterStageProps) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const isActive = voiceState !== "disabled";
  const firstName = userName.split(" ")[0] || "there";

  const statusSentence = !supported
    ? "Voice isn't available in this browser — send a message instead."
    : voiceState === "awake"
    ? "Yes? Go ahead."
    : voiceState === "processing"
    ? "Working on it…"
    : voiceState === "listening"
    ? 'Listening for "Hey IRIS" — just start talking.'
    : voiceEnabledOnce
    ? "Muted. Tap the eye to resume."
    : "Tap the eye to enable hands-free voice.";

  return (
    <section className="w-full px-6 md:px-10 pt-10 pb-8">
      <div className="flex flex-col md:flex-row items-center md:items-center gap-10 md:gap-14 max-w-5xl mx-auto">
        {/* eye side */}
        <div className="flex flex-col items-center shrink-0">
          <button
            type="button"
            onClick={supported ? onToggleVoice : undefined}
            disabled={!supported}
            aria-label="Toggle hands-free voice"
            className="relative flex items-center justify-center rounded-full disabled:cursor-default"
          >
            <div
              className="absolute rounded-full bg-cyan-glow/10 blur-3xl transition-[width,height] duration-150"
              style={{ width: 260 + audioLevel * 50, height: 260 + audioLevel * 50 }}
            />
            {isActive && (
              <>
                <span className="absolute w-64 h-64 rounded-full border border-cyan-glow/20 animate-ping [animation-duration:2s]" />
                <span className="absolute w-52 h-52 rounded-full border border-cyan-glow/15 animate-ping [animation-duration:2.4s]" />
              </>
            )}
            <EyeReticle />
            <div
              className="relative w-48 h-48 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle at 50% 38%, rgba(22,46,64,0.6), rgba(2,5,10,0.92))",
                boxShadow:
                  "inset 0 2px 6px rgba(255,255,255,0.08), inset 0 -6px 14px rgba(0,0,0,0.65), 0 0 44px -8px rgba(94,200,255,0.4)",
              }}
            >
              <IrisMark
                size={148}
                active
                level={audioLevel}
                state={voiceState === "disabled" ? "idle" : voiceState}
              />
            </div>
          </button>

          <div className="mt-5">
            <ChannelBars bars={bars} active={isActive} />
          </div>

          <div className="mt-5 flex items-center gap-4">
            <button
              type="button"
              onClick={onToggleCamera}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                cameraOn ? "bg-emerald-400/15 text-emerald-300" : "bg-black/25 text-slate-400 hover:text-cyan-glow"
              }`}
              aria-label="Toggle camera"
            >
              <Camera size={16} />
            </button>
            <button
              type="button"
              onClick={onKeyboardClick}
              className="w-10 h-10 rounded-full bg-black/25 flex items-center justify-center text-slate-400 hover:text-cyan-glow transition-colors"
              aria-label="Type a command"
            >
              <Keyboard size={16} />
            </button>
          </div>
        </div>

        {/* greeting side */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <p className="text-xs tracking-[0.2em] text-slate-500 font-display uppercase">
            {now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} ·{" "}
            {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-display font-semibold text-slate-100 leading-tight">
            {greetingFor(now.getHours())}, <span className="text-cyan-glow">{firstName}</span>
          </h1>
          <p className="mt-3 text-slate-400 max-w-md">{statusSentence}</p>

          <div className="mt-6 flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="text-[11px] font-mono tracking-wide text-slate-400 bg-black/20 rounded-full px-3 py-1">
              MIC {Math.round(audioLevel * 100)}%
            </span>
            <span className="text-[11px] font-mono tracking-wide text-slate-400 bg-black/20 rounded-full px-3 py-1">
              {STATE_LABEL[voiceState]}
            </span>
            <span className="text-[11px] font-mono tracking-wide text-slate-400 bg-black/20 rounded-full px-3 py-1">
              {commandCount} command{commandCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
