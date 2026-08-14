import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { TechyBackground } from "../components/TechyBackground";
import { IrisMark } from "../components/IrisMark";

interface LoginProps {
  onLogin: (name: string, email: string) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase()) || "there";
}

export function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      setError("Tell us what to call you.");
      return;
    }
    setError(null);
    // No backend — this is a client-side mock. The password is never stored.
    onLogin(mode === "signup" ? name.trim() : nameFromEmail(email), email);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative text-slate-100">
      <TechyBackground />

      <Link to="/" className="mb-8 flex items-center gap-2.5">
        <IrisMark size={34} />
        <span className="text-lg font-semibold tracking-[0.3em] text-slate-100">IRIS</span>
      </Link>

      <div className="w-full max-w-sm rounded-xl border border-cyan-glow/15 bg-iris-800/50 backdrop-blur-sm p-6">
        <div className="flex rounded-md border border-cyan-glow/15 p-1 mb-6 text-sm">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 rounded py-1.5 transition-colors ${
              mode === "signin" ? "bg-cyan-glow/15 text-cyan-glow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded py-1.5 transition-colors ${
              mode === "signup" ? "bg-cyan-glow/15 text-cyan-glow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs text-slate-400 mb-1.5" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tony Stark"
                className="w-full bg-black/25 border border-cyan-glow/10 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-glow/40"
              />
            </div>
          )}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-black/25 border border-cyan-glow/10 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-glow/40"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/25 border border-cyan-glow/10 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-glow/40"
            />
          </div>

          {error && <p className="text-xs text-red-300">{error}</p>}

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-cyan-glow text-iris-950 font-medium px-4 py-2.5 hover:brightness-110 transition"
          >
            {mode === "signup" ? "Create Account" : "Sign In"}
            <ArrowRight size={15} />
          </button>
        </form>
      </div>

      <p className="mt-6 text-xs text-slate-600 max-w-sm text-center">
        Demo only — there's no backend here. Nothing you enter is sent anywhere or
        stored beyond your own browser.
      </p>
    </div>
  );
}
