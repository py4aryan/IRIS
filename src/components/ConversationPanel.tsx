import { forwardRef, useEffect, useRef, useState } from "react";
import { Download, Send, Trash2 } from "lucide-react";
import type { LogEntry } from "../hooks/useVoiceCommands";
import { IrisMark } from "./IrisMark";

interface ConversationPanelProps {
  log: LogEntry[];
  processing: boolean;
  onSubmit: (text: string) => void;
  onClear: () => void;
}

export const ConversationPanel = forwardRef<HTMLInputElement, ConversationPanelProps>(
  function ConversationPanel({ log, processing, onSubmit, onClear }, ref) {
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [log, processing]);

    function extract() {
      const text = log
        .map((m) => `[${m.time}] ${m.role === "iris" ? "IRIS" : "You"}: ${m.text}`)
        .join("\n");
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "iris-conversation.txt";
      a.click();
      URL.revokeObjectURL(url);
    }

    function send() {
      if (!input.trim()) return;
      onSubmit(input);
      setInput("");
    }

    return (
      <aside className="w-full lg:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-cyan-glow/10 bg-black/20 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-cyan-glow/10">
          <h2 className="text-sm font-medium text-slate-200">Conversation</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-glow border border-cyan-glow/15 rounded-md px-2 py-1 transition-colors"
            >
              <Trash2 size={11} /> Clear
            </button>
            <button
              type="button"
              onClick={extract}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-glow border border-cyan-glow/15 rounded-md px-2 py-1 transition-colors"
            >
              <Download size={11} /> Extract
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 min-h-[240px] max-h-[420px] lg:max-h-none overflow-y-auto px-4 py-4 space-y-3">
          {log.map((m) => (
            <div key={m.id} className="flex items-start gap-2.5">
              {m.role === "iris" ? (
                <IrisMark size={22} className="mt-0.5 shrink-0" />
              ) : (
                <div className="w-[22px] h-[22px] rounded-full bg-slate-700 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <div
                  className={`text-sm leading-relaxed rounded-lg px-3 py-2 ${
                    m.role === "iris"
                      ? "bg-cyan-glow/10 border border-cyan-glow/20 text-slate-100"
                      : "bg-slate-700/30 text-slate-200"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">{m.time}</span>
              </div>
            </div>
          ))}
          {processing && (
            <div className="flex items-center gap-2.5">
              <IrisMark size={22} className="shrink-0" />
              <div className="flex gap-1.5 rounded-lg px-3 py-2.5 bg-cyan-glow/10 border border-cyan-glow/20">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-bounce"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-cyan-glow/10">
          <input
            ref={ref}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message…"
            className="flex-1 bg-black/25 border border-cyan-glow/10 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-glow/40"
          />
          <button
            type="button"
            onClick={send}
            className="shrink-0 w-9 h-9 rounded-md bg-cyan-glow text-iris-950 flex items-center justify-center hover:brightness-110 transition"
            aria-label="Send"
          >
            <Send size={15} />
          </button>
        </div>
      </aside>
    );
  }
);
