import { Camera, Keyboard, Mic, MicOff } from "lucide-react";
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
  onToggleVoice: () => void;
  onToggleCamera: () => void;
  onKeyboardClick: () => void;
}

const STATE_CODES: Record<VoiceState, string> = {
  disabled: "OFF",
  listening: "RDY",
  awake: "ACT",
  processing: "PROC",
};

export function CenterStage({
  voiceState,
  supported,
  voiceEnabledOnce,
  audioLevel,
  bars,
  commandCount,
  cameraOn,
  onToggleVoice,
  onToggleCamera,
  onKeyboardClick,
}: CenterStageProps) {
  const isActive = voiceState !== "disabled";

  const pill = !supported
    ? { label: "Voice unavailable — type a command", tone: "slate" as const, Icon: MicOff, clickable: false }
    : voiceState === "awake"
    ? { label: "Yes? Go ahead…", tone: "emerald" as const, Icon: Mic, clickable: true }
    : voiceState === "processing"
    ? { label: "Processing…", tone: "amber" as const, Icon: Mic, clickable: true }
    : voiceState === "listening"
    ? { label: 'Listening for "Hey IRIS"…', tone: "cyan" as const, Icon: Mic, clickable: true }
    : voiceEnabledOnce
    ? { label: "Muted — tap to resume", tone: "slate" as const, Icon: MicOff, clickable: true }
    : { label: 'Tap to enable "Hey IRIS"', tone: "cyan" as const, Icon: MicOff, clickable: true };

  const toneClasses = {
    cyan: "text-cyan-glow/80 border-cyan-glow/20 bg-cyan-glow/5",
    emerald: "text-emerald-300 border-emerald-400/30 bg-emerald-400/5",
    amber: "text-amber-300 border-amber-400/30 bg-amber-400/5",
    slate: "text-slate-400 border-slate-500/20 bg-slate-500/5",
  }[pill.tone];

  const dotClasses = {
    cyan: "bg-cyan-glow animate-pulse",
    emerald: "bg-emerald-400 animate-pulse",
    amber: "bg-amber-400 animate-pulse",
    slate: "bg-slate-500",
  }[pill.tone];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative">
      <div className="relative flex items-center justify-center">
        {/* ambient glow bloom, breathes with mic level */}
        <div
          className="absolute rounded-full bg-cyan-glow/10 blur-3xl transition-[width,height] duration-150"
          style={{ width: 340 + audioLevel * 60, height: 340 + audioLevel * 60 }}
        />

        {/* outer pulse rings while the voice pipeline is active */}
        {isActive && (
          <>
            <span className="absolute w-72 h-72 rounded-full border border-cyan-glow/25 animate-ping [animation-duration:2s]" />
            <span className="absolute w-60 h-60 rounded-full border border-cyan-glow/20 animate-ping [animation-duration:2.4s]" />
          </>
        )}

        <EyeReticle audioLevel={audioLevel} stateCode={STATE_CODES[voiceState]} commandCount={commandCount} />

        {/* beveled hardware-style bezel frame around the eye */}
        <div
          className="relative w-56 h-56 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 50% 38%, rgba(22,46,64,0.6), rgba(2,5,10,0.92))",
            boxShadow:
              "inset 0 2px 6px rgba(255,255,255,0.08), inset 0 -6px 14px rgba(0,0,0,0.65), 0 0 0 1px rgba(94,200,255,0.18), 0 0 44px -8px rgba(94,200,255,0.4)",
          }}
        >
          <IrisMark
            size={172}
            active
            level={audioLevel}
            state={voiceState === "disabled" ? "idle" : voiceState}
          />
        </div>
      </div>

      <h1 className="mt-8 text-3xl tracking-[0.35em] font-semibold text-slate-100 [text-shadow:0_0_18px_rgba(94,200,255,0.7),0_0_40px_rgba(94,200,255,0.3)]">
        IRIS
      </h1>

      <button
        type="button"
        onClick={pill.clickable ? onToggleVoice : undefined}
        disabled={!pill.clickable}
        className={`mt-4 inline-flex items-center gap-2 text-xs rounded-full px-4 py-1.5 border transition-colors ${toneClasses} ${
          pill.clickable ? "cursor-pointer hover:brightness-125" : "cursor-default"
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotClasses}`} />
        {pill.label}
      </button>

      <div className="mt-4">
        <ChannelBars bars={bars} active={isActive} />
      </div>

      {!supported && (
        <p className="mt-3 text-xs text-slate-500 max-w-xs text-center">
          Voice recognition isn't supported in this browser — you can still type commands on the right.
        </p>
      )}

      <div className="mt-8 flex items-center gap-5">
        <button
          type="button"
          onClick={onToggleCamera}
          className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
            cameraOn
              ? "border-emerald-400/40 text-emerald-300 bg-emerald-400/10"
              : "border-cyan-glow/20 text-slate-300 hover:text-cyan-glow hover:border-cyan-glow/40"
          }`}
          aria-label="Toggle camera"
        >
          <Camera size={18} />
        </button>
        <button
          type="button"
          onClick={onKeyboardClick}
          className="w-12 h-12 rounded-full border border-cyan-glow/20 flex items-center justify-center text-slate-300 hover:text-cyan-glow hover:border-cyan-glow/40 transition-colors"
          aria-label="Type a command"
        >
          <Keyboard size={18} />
        </button>
      </div>

      <p className="mt-6 text-[10px] tracking-[0.2em] text-slate-600 font-mono">
        ◈ SESSION LOG · {commandCount} COMMAND{commandCount === 1 ? "" : "S"} PROCESSED
      </p>
    </div>
  );
}
