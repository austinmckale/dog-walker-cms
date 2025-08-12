"use client";
import { useWalkTracker } from "@/hooks/useWalkTracker";

export default function LiveWalk() {
  const { start, end, isTracking, distanceM, durationS } = useWalkTracker();
  const mins = Math.floor(durationS / 60), secs = durationS % 60;

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Live Walk</h1>
      <p className="text-sm text-muted-foreground">We only track during a walk you start and end. Keep your screen on for best GPS reliability.</p>
      <div className="rounded border p-4">
        <div>Distance: {(distanceM/1000).toFixed(2)} km</div>
        <div>Duration: {mins}:{secs.toString().padStart(2,"0")}</div>
      </div>
      {!isTracking ? (
        <button className="btn btn-primary w-full" onClick={start}>Start Walk</button>
      ) : (
        <button className="btn w-full" onClick={end}>End Walk</button>
      )}
      <p className="text-sm text-muted-foreground">GPS tracking & photo report included with every walk.</p>
    </div>
  );
}
