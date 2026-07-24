import { Camera, Keyboard, Mic, MicOff } from "lucide-react";
import { IrisMark } from "./IrisMark";

interface CenterStageProps {
  listening: boolean;
  processing: boolean;
  supported: boolean;
  cameraOn: boolean;
  onToggleListening: () => void;
  onToggleCamera: () => void;
  onKeyboardClick: () => void;
}

export function CenterStage({
  listening,
  processing,
  supported,
  cameraOn,
  onToggleListening,
  onToggleCamera,
  onKeyboardClick,
}: CenterStageProps) {
  const statusText = processing
    ? "Processing…"
    : listening
    ? "Listening…"
    : "Listening for wake word…";

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative">
      <div className="relative flex items-center justify-center">
        {/* outer pulse rings when listening */}
        {listening && (
          <>
            <span className="absolute w-64 h-64 rounded-full border border-cyan-glow/25 animate-ping [animation-duration:2s]" />
            <span className="absolute w-52 h-52 rounded-full border border-cyan-glow/20 animate-ping [animation-duration:2.4s]" />
          </>
        )}
        <div className="relative w-56 h-56 rounded-full border border-cyan-glow/15 bg-black/20 flex items-center justify-center">
          <IrisMark size={168} active />
        </div>
      </div>

      <h1 className="mt-8 text-3xl tracking-[0.35em] font-semibold text-slate-100">
        IRIS
      </h1>

      <span
        className={`mt-4 inline-flex items-center gap-2 text-xs rounded-full px-4 py-1.5 border ${
          listening
            ? "text-emerald-300 border-emerald-400/30 bg-emerald-400/5"
            : "text-cyan-glow/80 border-cyan-glow/20 bg-cyan-glow/5"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            listening ? "bg-emerald-400 animate-pulse" : "bg-cyan-glow animate-pulse"
          }`}
        />
        {statusText}
      </span>

      {!supported && (
        <p className="mt-3 text-xs text-slate-500 max-w-xs text-center">
          Voice recognition isn't supported in this browser — you can still type commands on the right.
        </p>
      )}

      <div className="mt-10 flex items-center gap-5">
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
          onClick={onToggleListening}
          className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors ${
            listening
              ? "border-cyan-glow bg-cyan-glow/15 text-cyan-glow shadow-[0_0_25px_rgba(94,200,255,0.4)]"
              : "border-cyan-glow/30 text-slate-200 hover:border-cyan-glow/60"
          }`}
          aria-label="Toggle listening"
        >
          {listening ? <Mic size={22} /> : <MicOff size={22} />}
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
    </div>
  );
}
