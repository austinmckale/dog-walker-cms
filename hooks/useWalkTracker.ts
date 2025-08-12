"use client";
import { useEffect, useRef, useState } from "react";

type Point = { ts: string; lat: number; lng: number; accuracy?: number|null; speed?: number|null; heading?: number|null; };

const haversine = (a: Point, b: Point) => {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

export function useWalkTracker() {
  const [walkId, setWalkId] = useState<string|null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [distanceM, setDistanceM] = useState(0);
  const [durationS, setDurationS] = useState(0);
  const watchId = useRef<number|null>(null);
  const buffer = useRef<Point[]>([]);
  const last = useRef<Point|null>(null);
  const startMs = useRef<number|null>(null);

  async function flush() {
    if (!walkId || buffer.current.length === 0) return;
    const chunk = buffer.current.splice(0, buffer.current.length);
    await fetch("/api/walks/points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walkId, points: chunk })
    });
  }

  function tick() {
    if (!startMs.current) return;
    setDurationS(Math.floor((Date.now() - startMs.current) / 1000));
  }

  async function start() {
    const res = await fetch("/api/walks/start", { method: "POST" });
    if (!res.ok) { alert("Please sign in first."); return; }
    const { walkId } = await res.json();
    setWalkId(walkId); setIsTracking(true);
    setDistanceM(0); setDurationS(0); startMs.current = Date.now();

    watchId.current = navigator.geolocation.watchPosition(
      pos => {
        const p: Point = {
          ts: new Date(pos.timestamp).toISOString(),
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          speed: pos.coords.speed,
          heading: pos.coords.heading
        };
        if (last.current) setDistanceM(d => d + haversine(last.current!, p));
        last.current = p;
        buffer.current.push(p);
        if (buffer.current.length >= 8) flush();
        tick();
      },
      err => console.warn("geo error", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  }

  async function end() {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    await flush();
    if (walkId) {
      await fetch("/api/walks/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walkId, durationS, distanceM })
      });
    }
    setIsTracking(false); setWalkId(null); last.current = null; startMs.current = null;
  }

  useEffect(() => {
    if (!isTracking) return;
    const flushTimer = setInterval(flush, 10000);
    const tickTimer = setInterval(tick, 1000);
    return () => { clearInterval(flushTimer); clearInterval(tickTimer); };
  }, [isTracking]);

  return { start, end, isTracking, distanceM, durationS };
}
