import { Link } from "react-router-dom";
import { ArrowRight, Mic, Radar, ShieldCheck } from "lucide-react";
import { TechyBackground } from "../components/TechyBackground";
import { IrisMark } from "../components/IrisMark";

const FEATURES = [
  { icon: Mic, label: "Hands-free voice commands" },
  { icon: Radar, label: "Live system telemetry" },
  { icon: ShieldCheck, label: "Runs entirely in your browser" },
];

export function Home() {
  return (
    <div className="min-h-screen flex flex-col text-slate-100 relative overflow-hidden">
      <TechyBackground />

      <header className="flex items-center justify-between px-6 py-5 border-b border-cyan-glow/10">
        <div className="flex items-center gap-2.5">
          <IrisMark size={28} />
          <span className="text-base font-display font-semibold tracking-[0.3em] text-slate-100">IRIS</span>
        </div>
        <Link
          to="/login"
          className="text-sm text-slate-300 hover:text-cyan-glow transition-colors border border-cyan-glow/20 rounded-md px-4 py-1.5"
        >
          Sign In
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <IrisMark size={140} />

        <h1 className="mt-8 text-4xl sm:text-5xl font-display font-semibold tracking-tight [text-shadow:0_0_18px_rgba(94,200,255,0.6)]">
          Meet <span className="text-cyan-glow">IRIS</span>
        </h1>
        <p className="mt-4 max-w-md text-slate-400">
          A JARVIS-style voice assistant dashboard. Say "Hey IRIS" and it listens —
          no clicking, no typing required.
        </p>

        <Link
          to="/login"
          className="mt-9 inline-flex items-center gap-2 rounded-md bg-cyan-glow text-iris-950 font-medium px-6 py-3 hover:brightness-110 transition"
        >
          Get Started
          <ArrowRight size={16} />
        </Link>

        <div className="mt-14 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-slate-400">
              <Icon size={15} className="text-cyan-glow/70" />
              {label}
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center text-xs text-slate-600 py-6">
        Frontend demo — no account data leaves your browser.
      </footer>
    </div>
  );
}
