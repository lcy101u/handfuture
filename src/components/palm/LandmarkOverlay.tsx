import { HAND_CONNECTIONS } from "@/content/landmarks";
import type { HandLandmark } from "@/lib/hand-detector";

interface LandmarkOverlayProps {
  image: string;
  alt: string;
  landmarks: HandLandmark[];
  overlayLabel: string;
}

const percent = (value: number) => Math.max(0, Math.min(100, value * 100));

export default function LandmarkOverlay({ image, alt, landmarks, overlayLabel }: LandmarkOverlayProps) {
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg border border-border bg-black shadow-lg">
      <img src={image} alt={alt} className="block h-auto w-full" />
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={overlayLabel}>
        {HAND_CONNECTIONS.map(([from, to]) => {
          const start = landmarks[from];
          const end = landmarks[to];
          if (!start || !end) return null;
          return <line key={`${from}-${to}`} data-testid="detected-connection" x1={percent(start.x)} y1={percent(start.y)} x2={percent(end.x)} y2={percent(end.y)} className="stroke-amber-300" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />;
        })}
        {landmarks.map((landmark, index) => (
          <circle key={index} data-testid="detected-landmark" cx={percent(landmark.x)} cy={percent(landmark.y)} r="1.2" className="fill-amber-300 stroke-slate-950" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
    </div>
  );
}
