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
    <div className="h-screen flex flex-col text-slate-100 overflow-hidden">
      <TechyBackground />
      <TopBar userName={session.name} onLogout={onLogout} />

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto lg:overflow-hidden">
        <aside className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-cyan-glow/10 p-4 space-y-4 lg:overflow-y-auto">
          <SystemStatsCard />
          <WeatherCard />
          <CameraCard on={cameraOn} onToggle={() => setCameraOn((v) => !v)} />
          <UptimeCard commandCount={commandCount} />
        </aside>

        <CenterStage
          voiceState={voiceState}
          voiceEnabledOnce={voiceEnabledOnce}
          audioLevel={audioLevel}
          bars={bars}
          commandCount={commandCount}
          supported={supported}
          cameraOn={cameraOn}
          onToggleVoice={toggleVoice}
          onToggleCamera={() => setCameraOn((v) => !v)}
          onKeyboardClick={() => inputRef.current?.focus()}
        />

        <ConversationPanel
          ref={inputRef}
          log={log}
          processing={busy}
          onSubmit={submitCommand}
          onClear={clearLog}
        />
      </div>
    </div>
  );
}
