import { useRef, useState } from "react";
import { TechyBackground } from "../components/TechyBackground";
import { TopBar } from "../components/TopBar";
import { SystemStatsCard } from "../components/SystemStatsCard";
import { WeatherCard } from "../components/WeatherCard";
import { CameraCard } from "../components/CameraCard";
import { UptimeCard } from "../components/UptimeCard";
import { CenterStage } from "../components/CenterStage";
import { ConversationPanel } from "../components/ConversationPanel";
import { useVoiceCommands } from "../hooks/useVoiceCommands";
import type { SessionData } from "../hooks/useSession";

interface DashboardProps {
  session: SessionData;
  onLogout: () => void;
}

export function Dashboard({ session, onLogout }: DashboardProps) {
  const [cameraOn, setCameraOn] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
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
  } = useVoiceCommands();

  return (
    <div className="min-h-screen text-slate-100 relative">
      <TechyBackground />
      <TopBar onLogout={onLogout} />

      <CenterStage
        voiceState={voiceState}
        voiceEnabledOnce={voiceEnabledOnce}
        audioLevel={audioLevel}
        bars={bars}
        commandCount={commandCount}
        supported={supported}
        cameraOn={cameraOn}
        userName={session.name}
        onToggleVoice={toggleVoice}
        onToggleCamera={() => setCameraOn((v) => !v)}
        onKeyboardClick={() => inputRef.current?.focus()}
      />

      <main className="px-6 md:px-10 pb-14 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-3">
            <SystemStatsCard />
          </div>
          <div className="md:col-span-3">
            <WeatherCard />
          </div>
          <div className="md:col-span-3">
            <CameraCard on={cameraOn} onToggle={() => setCameraOn((v) => !v)} />
          </div>
          <div className="md:col-span-3">
            <UptimeCard commandCount={commandCount} />
          </div>
          <div className="md:col-span-6">
            <ConversationPanel ref={inputRef} log={log} processing={busy} onSubmit={submitCommand} onClear={clearLog} />
          </div>
        </div>
      </main>
    </div>
  );
}
