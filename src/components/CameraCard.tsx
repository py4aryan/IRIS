import { useEffect, useRef, useState } from "react";
import { Camera, Power, VideoOff } from "lucide-react";
import { Card } from "./Card";

interface CameraCardProps {
  on: boolean;
  onToggle: () => void;
}

export function CameraCard({ on, onToggle }: CameraCardProps) {
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!on) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      return;
    }
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: true })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setError(null);
      })
      .catch(() => {
        setError("Camera access denied or unavailable.");
      });
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [on]);

  return (
    <Card icon={<Camera size={15} />} title="Camera">
      <div className="relative aspect-video rounded-2xl bg-black/40 flex items-center justify-center overflow-hidden mb-2">
        {on ? (
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-slate-500">
            <VideoOff size={22} />
            <span className="text-xs">Camera Off</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-slate-500">
          {error ?? (on ? "Live feed active." : "Click the power button to start.")}
        </p>
        <button
          type="button"
          onClick={onToggle}
          className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center transition-colors ${
            on ? "text-emerald-300 bg-emerald-400/15" : "bg-black/20 text-slate-400 hover:text-cyan-glow"
          }`}
          aria-label="Toggle camera"
        >
          <Power size={13} />
        </button>
      </div>
    </Card>
  );
}
