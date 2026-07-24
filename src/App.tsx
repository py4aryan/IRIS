import { useRef, useState } from "react";
import { TechyBackground } from "./components/TechyBackground";
import { TopBar } from "./components/TopBar";
import { SystemStatsCard } from "./components/SystemStatsCard";
import { WeatherCard } from "./components/WeatherCard";
import { CameraCard } from "./components/CameraCard";
import { UptimeCard } from "./components/UptimeCard";
import { CenterStage } from "./components/CenterStage";
import { ConversationPanel } from "./components/ConversationPanel";
import { useVoiceCommands } from "./hooks/useVoiceCommands";

function App() {
  const [cameraOn, setCameraOn] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    log,
    listening,
    processing,
    supported,
    commandCount,
    toggleListening,
    submitCommand,
    clearLog,
  } = useVoiceCommands();

  return (
    <div className="h-screen flex flex-col text-slate-100 overflow-hidden">
      <TechyBackground />
      <TopBar />

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto lg:overflow-hidden">
        <aside className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-cyan-glow/10 p-4 space-y-4 lg:overflow-y-auto">
          <SystemStatsCard />
          <WeatherCard />
          <CameraCard on={cameraOn} onToggle={() => setCameraOn((v) => !v)} />
          <UptimeCard commandCount={commandCount} />
        </aside>

        <CenterStage
          listening={listening}
          processing={processing}
          supported={supported}
          cameraOn={cameraOn}
          onToggleListening={toggleListening}
          onToggleCamera={() => setCameraOn((v) => !v)}
          onKeyboardClick={() => inputRef.current?.focus()}
        />

        <ConversationPanel
          ref={inputRef}
          log={log}
          processing={processing}
          onSubmit={submitCommand}
          onClear={clearLog}
        />
      </div>
    </div>
  );
}

export default App;
