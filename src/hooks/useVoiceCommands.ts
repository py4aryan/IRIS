import { useCallback, useEffect, useRef, useState } from "react";

export type LogEntry = {
  id: number;
  role: "user" | "iris";
  text: string;
  time: string;
};

export type VoiceState = "disabled" | "listening" | "awake" | "processing" | "speaking";

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

const BAR_COUNT = 10;

// Speech recognition can mis-transcribe "Iris" with accents or background
// noise ("eris", "irish", "iras", ...) — match near-misses instead of
// requiring an exact "hey iris" string.
const WAKE_ALIASES = ["iris", "eris", "irish", "iras", "irus", "erys", "irish's"];

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

/** Scans the first few words of a transcript for something close to "iris". */
function findWakeWord(transcript: string): { wordIndex: number; words: string[] } | null {
  const words = transcript
    .toLowerCase()
    .replace(/[^a-z\s']/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const scanLimit = Math.min(words.length, 5);
  for (let i = 0; i < scanLimit; i++) {
    const word = words[i];
    if (word.length < 3) continue;
    const threshold = word.length <= 4 ? 1 : 2;
    if (WAKE_ALIASES.some((alias) => levenshtein(word, alias) <= threshold)) {
      return { wordIndex: i, words };
    }
  }
  return null;
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function pickVoice(): SpeechSynthesisVoice | undefined {
  if (!window.speechSynthesis) return undefined;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /Google UK English Male|Daniel|Alex|Google US English/i.test(v.name)) ??
    voices.find((v) => v.lang?.startsWith("en")) ??
    voices[0]
  );
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
  const speakingRef = useRef(false);
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

  // Holds the latest startRecognitionCycle so `speak` can resume listening
  // after it finishes talking, without a circular useCallback dependency.
  const startRecognitionCycleRef = useRef<() => void>(() => {});

  const speak = useCallback((text: string, onDone?: () => void) => {
    if (!window.speechSynthesis) {
      onDone?.();
      return;
    }
    // Pause the mic while IRIS talks so it doesn't hear its own voice.
    const wasListening = shouldListenRef.current;
    if (wasListening) {
      speakingRef.current = true;
      recognitionRef.current?.stop();
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.02;
    utter.pitch = 0.95;
    const voice = pickVoice();
    if (voice) utter.voice = voice;
    const finish = () => {
      speakingRef.current = false;
      if (wasListening && shouldListenRef.current) startRecognitionCycleRef.current();
      onDone?.();
    };
    utter.onend = finish;
    utter.onerror = finish;
    window.speechSynthesis.speak(utter);
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
        const reply = respond(trimmed);
        pushEntry("iris", reply);
        setBusy(false);
        if (shouldListenRef.current) applyVoiceState("speaking");
        speak(reply, () => {
          if (shouldListenRef.current) applyVoiceState("listening");
        });
      }, 500 + Math.random() * 500);
    },
    [pushEntry, applyVoiceState, speak]
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
            submitCommand(transcript.trim());
          }
          continue;
        }

        if (voiceStateRef.current !== "listening") continue;

        const wake = findWakeWord(transcript);
        if (!wake) continue;

        const after = wake.words.slice(wake.wordIndex + 1).join(" ").trim();
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
      if (shouldListenRef.current && !speakingRef.current) {
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

  startRecognitionCycleRef.current = startRecognitionCycle;

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
      window.speechSynthesis?.cancel();
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
      window.speechSynthesis?.cancel();
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
