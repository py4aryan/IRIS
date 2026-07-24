import { useCallback, useEffect, useRef, useState } from "react";

export type LogEntry = {
  id: number;
  role: "user" | "iris";
  text: string;
  time: string;
};

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function respond(command: string): string {
  const c = command.toLowerCase();
  if (c.includes("time")) return `It's ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`;
  if (c.includes("date")) return `Today is ${new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}.`;
  if (c.includes("weather")) return "Currently 25.2°C and overcast — humidity's high, you'll want a jacket later.";
  if (c.includes("status") || c.includes("system")) return "All systems nominal. CPU and memory within normal range, no alerts queued.";
  if (c.includes("camera")) return c.includes("off") ? "Powering down the camera feed." : "Bringing the camera feed online.";
  if (c.includes("joke")) return "I'd tell you a UDP joke, but you might not get it.";
  if (c.includes("thank")) return "Always glad to help, sir.";
  if (c.includes("hello") || c.includes("hi ") || c === "hi") return "Hello. Standing by for your instructions.";
  return "Command received and logged. I don't have a specific routine for that yet, but I'm listening.";
}

export function useVoiceCommands() {
  const [log, setLog] = useState<LogEntry[]>([
    {
      id: 0,
      role: "iris",
      text: "IRIS online. Voice recognition is ready — say something, or type a command below.",
      time: timeNow(),
    },
  ]);
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [supported, setSupported] = useState(true);
  const [commandCount, setCommandCount] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const idRef = useRef(1);

  useEffect(() => {
    setSupported(!!getRecognitionCtor());
  }, []);

  const pushEntry = useCallback((role: LogEntry["role"], text: string) => {
    setLog((prev) => [...prev, { id: idRef.current++, role, text, time: timeNow() }]);
  }, []);

  const submitCommand = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      pushEntry("user", trimmed);
      setCommandCount((n) => n + 1);
      setProcessing(true);
      window.setTimeout(() => {
        pushEntry("iris", respond(trimmed));
        setProcessing(false);
      }, 500 + Math.random() * 500);
    },
    [pushEntry]
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const startListening = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      pushEntry("iris", "Voice recognition isn't supported in this browser — try Chrome, or type a command instead.");
      return;
    }
    const recognition = new Ctor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (ev) => {
      const transcript = ev.results[ev.results.length - 1][0].transcript;
      submitCommand(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [pushEntry, submitCommand]);

  const toggleListening = useCallback(() => {
    if (listening) stopListening();
    else startListening();
  }, [listening, startListening, stopListening]);

  const clearLog = useCallback(() => {
    setLog([]);
  }, []);

  return {
    log,
    listening,
    processing,
    supported,
    commandCount,
    toggleListening,
    submitCommand,
    clearLog,
  };
}
