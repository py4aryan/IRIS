import { useState } from "react";
import { ArrowLeft, ArrowRight, Code2, Home as HomeIcon, Loader2, Rocket, Sparkles } from "lucide-react";
import { TechyBackground } from "../components/TechyBackground";
import { IrisMark } from "../components/IrisMark";

interface SurveyProps {
  name: string;
  onComplete: (useCase: string, name: string) => Promise<{ ok: true } | { ok: false; error: string }>;
}

const USE_CASES = [
  { id: "productivity", label: "Productivity & Scheduling", icon: Rocket },
  { id: "automation", label: "Home Automation", icon: HomeIcon },
  { id: "coding", label: "Coding Assistant", icon: Code2 },
  { id: "exploring", label: "Just Exploring", icon: Sparkles },
];

const STEP_COUNT = 3;

export function Survey({ name: initialName, onComplete }: SurveyProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(initialName);
  const [useCase, setUseCase] = useState("");
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function launch() {
    setError(null);
    setLaunching(true);
    const result = await onComplete(useCase, name);
    setLaunching(false);
    if (!result.ok) setError(result.error);
  }

  const useCaseLabel = USE_CASES.find((u) => u.id === useCase)?.label ?? "general use";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative text-slate-100">
      <TechyBackground />

      <IrisMark size={64} className="mb-6" />

      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: STEP_COUNT }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === step ? "w-8 bg-cyan-glow" : i < step ? "w-4 bg-cyan-glow/50" : "w-4 bg-slate-700"
            }`}
          />
        ))}
      </div>

      <div className="w-full max-w-md rounded-3xl bg-iris-800/60 backdrop-blur-md p-7 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.75)]">
        {step === 0 && (
          <div>
            <h2 className="text-lg font-medium text-slate-100 mb-1.5">What should we call you?</h2>
            <p className="text-sm text-slate-400 mb-5">IRIS will use this to address you.</p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep(1)}
              placeholder="Your name"
              className="w-full bg-black/25 rounded-2xl px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-cyan-glow/40"
            />
            <button
              type="button"
              disabled={!name.trim()}
              onClick={() => setStep(1)}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-cyan-glow text-iris-950 font-medium px-4 py-2.5 hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-lg font-medium text-slate-100 mb-1.5">
              What will you mainly use IRIS for?
            </h2>
            <p className="text-sm text-slate-400 mb-5">This just tunes the demo — no wrong answers.</p>
            <div className="grid grid-cols-2 gap-3">
              {USE_CASES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setUseCase(id)}
                  className={`flex flex-col items-start gap-2 rounded-2xl p-3.5 text-left transition-colors ${
                    useCase === id
                      ? "bg-cyan-glow/15 text-slate-100"
                      : "bg-black/20 text-slate-400 hover:bg-black/30 hover:text-slate-200"
                  }`}
                >
                  <Icon size={18} className={useCase === id ? "text-cyan-glow" : ""} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 px-3 py-2.5"
              >
                <ArrowLeft size={15} /> Back
              </button>
              <button
                type="button"
                disabled={!useCase}
                onClick={() => setStep(2)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-cyan-glow text-iris-950 font-medium px-4 py-2.5 hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h2 className="text-lg font-medium text-slate-100 mb-1.5">You're all set, {name}.</h2>
            <p className="text-sm text-slate-400 mb-6">
              IRIS is calibrated for <span className="text-cyan-glow">{useCaseLabel}</span>. Say
              "Hey IRIS" any time you're ready.
            </p>
            {error && <p className="text-xs text-red-300 mb-3">{error}</p>}
            <button
              type="button"
              disabled={launching}
              onClick={launch}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-cyan-glow text-iris-950 font-medium px-4 py-2.5 hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {launching ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <>
                  Launch IRIS
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
