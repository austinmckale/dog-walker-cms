"use client";
import { useWalkTracker } from '@/hooks/useWalkTracker'

export default function DogLiveWalkClient({ dogId }: { dogId: string }) {
  const { start, end, isTracking, distanceM, durationS } = useWalkTracker({ dogId })
  const mins = Math.floor(durationS / 60), secs = durationS % 60

  return (
    <div className="max-w-md mx-auto p-0 space-y-4">
      <div className="rounded border p-4 bg-white">
        <div>Distance: {(distanceM/1000).toFixed(2)} km</div>
        <div>Duration: {mins}:{secs.toString().padStart(2,"0")}</div>
      </div>
      {!isTracking ? (
        <button className="btn-primary w-full" onClick={start}>Start Walk</button>
      ) : (
        <button className="btn-secondary w-full" onClick={end}>End Walk</button>
      )}
      <p className="text-sm text-gray-500">GPS tracking & photo report included with every walk.</p>
    </div>
  )
}

