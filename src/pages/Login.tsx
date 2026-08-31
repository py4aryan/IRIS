import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { TechyBackground } from "../components/TechyBackground";
import { IrisMark } from "../components/IrisMark";

type AuthResult = { ok: true } | { ok: false; error: string };

interface LoginProps {
  onSignup: (name: string, email: string, password: string) => Promise<AuthResult>;
  onSignIn: (email: string, password: string) => Promise<AuthResult>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Login({ onSignup, onSignIn }: LoginProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
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
    setSubmitting(true);
    const result =
      mode === "signup" ? await onSignup(name.trim(), email, password) : await onSignIn(email, password);
    setSubmitting(false);

    if (!result.ok) setError(result.error);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative text-slate-100">
      <TechyBackground />

      <Link to="/" className="mb-8 flex items-center gap-2.5">
        <IrisMark size={34} />
        <span className="text-lg font-display font-semibold tracking-[0.3em] text-slate-100">IRIS</span>
      </Link>

      <div className="w-full max-w-sm rounded-3xl bg-iris-800/60 backdrop-blur-md p-6 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.75)]">
        <div className="flex rounded-full bg-black/20 p-1 mb-6 text-sm">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 rounded-full py-1.5 transition-colors ${
              mode === "signin" ? "bg-cyan-glow/15 text-cyan-glow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-full py-1.5 transition-colors ${
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
                className="w-full bg-black/25 rounded-2xl px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-cyan-glow/40"
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
              className="w-full bg-black/25 rounded-2xl px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-cyan-glow/40"
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
              className="w-full bg-black/25 rounded-2xl px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-cyan-glow/40"
            />
          </div>

          {error && <p className="text-xs text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-cyan-glow text-iris-950 font-medium px-4 py-2.5 hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <>
                {mode === "signup" ? "Create Account" : "Sign In"}
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-xs text-slate-600 max-w-sm text-center">
        Backed by a small local server — your password is hashed and never
        leaves this machine. No third-party auth provider involved.
      </p>
    </div>
  );
}
