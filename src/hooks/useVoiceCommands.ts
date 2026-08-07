import { useCallback, useEffect, useRef, useState } from "react";

export type LogEntry = {
  id: number;
  role: "user" | "iris";
  text: string;
  time: string;
};

export type VoiceState = "disabled" | "listening" | "awake" | "processing";

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionErrorEventLike {
  error: string;
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEventLike) => void) | null;
}

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const WAKE_RE = /\bhey,?\s*iris\b/i;
const BAR_COUNT = 10;

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
  if (!c) return "I didn't catch that — go ahead.";
  return "Command received and logged. I don't have a specific routine for that yet, but I'm listening.";
}

export function useVoiceCommands() {
  const [log, setLog] = useState<LogEntry[]>([
    {
      id: 0,
      role: "iris",
      text: 'IRIS online. Say "Hey IRIS" any time to give a command, or type one below.',
      time: timeNow(),
    },
  ]);
  const [voiceState, setVoiceState] = useState<VoiceState>("disabled");
  const [voiceEnabledOnce, setVoiceEnabledOnce] = useState(false);
  const [supported, setSupported] = useState(true);
  const [commandCount, setCommandCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [bars, setBars] = useState<number[]>(() => Array(BAR_COUNT).fill(0));

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldListenRef = useRef(false);
  const voiceStateRef = useRef<VoiceState>("disabled");
  const awakeTimeoutRef = useRef<number | null>(null);
  const idRef = useRef(1);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sampleIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setSupported(!!getRecognitionCtor());
  }, []);

  const applyVoiceState = useCallback((s: VoiceState) => {
    voiceStateRef.current = s;
    setVoiceState(s);
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
      setBusy(true);
      if (shouldListenRef.current) applyVoiceState("processing");
      window.setTimeout(() => {
        pushEntry("iris", respond(trimmed));
        setBusy(false);
        if (shouldListenRef.current) applyVoiceState("listening");
      }, 500 + Math.random() * 500);
    },
    [pushEntry, applyVoiceState]
  );

  const startRecognitionCycle = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (ev) => {
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const result = ev.results[i];
        const transcript = result[0].transcript;
        const isFinal = result.isFinal;

        if (voiceStateRef.current === "awake") {
          if (isFinal && transcript.trim()) {
            if (awakeTimeoutRef.current) window.clearTimeout(awakeTimeoutRef.current);
            const command = transcript.replace(WAKE_RE, "").trim() || transcript.trim();
            submitCommand(command);
          }
          continue;
        }

        if (voiceStateRef.current !== "listening") continue;

        const wakeMatch = transcript.match(WAKE_RE);
        if (!wakeMatch) continue;

        const after = transcript.slice((wakeMatch.index ?? 0) + wakeMatch[0].length).trim();
        if (after && isFinal) {
          submitCommand(after);
        } else {
          applyVoiceState("awake");
          if (awakeTimeoutRef.current) window.clearTimeout(awakeTimeoutRef.current);
          awakeTimeoutRef.current = window.setTimeout(() => {
            if (voiceStateRef.current === "awake") applyVoiceState("listening");
          }, 6000);
        }
      }
    };

    recognition.onend = () => {
      if (shouldListenRef.current) {
        window.setTimeout(() => startRecognitionCycle(), 250);
      }
    };

    recognition.onerror = (ev) => {
      if (ev?.error === "not-allowed" || ev?.error === "service-not-allowed") {
        shouldListenRef.current = false;
        applyVoiceState("disabled");
      }
      // other errors (no-speech, aborted, network) are recovered by onend's restart
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      // recognition already running — the existing cycle will continue
    }
  }, [submitCommand, applyVoiceState]);

  const startAudioMeter = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const Ctx = (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) as typeof AudioContext;
    const ctx = new Ctx();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.6;
    source.connect(analyser);
    audioCtxRef.current = ctx;

    const data = new Uint8Array(analyser.frequencyBinCount);
    const step = Math.max(1, Math.floor(data.length / BAR_COUNT));

    sampleIntervalRef.current = window.setInterval(() => {
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      setAudioLevel(sum / data.length / 255);
      setBars(Array.from({ length: BAR_COUNT }, (_, i) => (data[i * step] ?? 0) / 255));
    }, 90);
  }, []);

  const stopAudioMeter = useCallback(() => {
    if (sampleIntervalRef.current) window.clearInterval(sampleIntervalRef.current);
    sampleIntervalRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    setAudioLevel(0);
    setBars(Array(BAR_COUNT).fill(0));
  }, []);

  const toggleVoice = useCallback(async () => {
    if (!supported) return;

    if (shouldListenRef.current) {
      shouldListenRef.current = false;
      if (awakeTimeoutRef.current) window.clearTimeout(awakeTimeoutRef.current);
      recognitionRef.current?.stop();
      stopAudioMeter();
      applyVoiceState("disabled");
      return;
    }

    try {
      await startAudioMeter();
      shouldListenRef.current = true;
      setVoiceEnabledOnce(true);
      applyVoiceState("listening");
      startRecognitionCycle();
    } catch {
      pushEntry("iris", "Microphone access was blocked, so I can't listen for \"Hey IRIS\" — you can still type commands.");
    }
  }, [supported, startAudioMeter, stopAudioMeter, startRecognitionCycle, applyVoiceState, pushEntry]);

  const clearLog = useCallback(() => {
    setLog([]);
  }, []);

  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      if (awakeTimeoutRef.current) window.clearTimeout(awakeTimeoutRef.current);
      recognitionRef.current?.stop();
      stopAudioMeter();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    log,
    voiceState,
    voiceEnabledOnce,
    audioLevel,
    bars,
    supported,
    commandCount,
    busy,
    toggleVoice,
    submitCommand,
    clearLog,
  };
}
