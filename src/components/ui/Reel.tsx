"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  /** Loop window in seconds — `to` stops short of any end card or fade-out. */
  from?: number;
  to: number;
  label: string;
  className?: string;
  /** Shows a sound toggle (starts muted, as browsers require). */
  sound?: boolean;
};

/**
 * A muted looping video that costs nothing until it is needed: the file is requested only when
 * the frame is near the viewport, plays only while mostly visible, and a tap pauses / resumes it.
 * Reduced-motion / data-saver visitors get the first frame and a play button.
 */
export default function Reel({ src, from = 0, to, label, className = "", sound = false }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const vref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only capability check
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches || !!nav.connection?.saveData);
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      setNear(true);
      setVisible(true);
      return;
    }
    const nearIO = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "400px 0px" });
    const visIO = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.45 });
    nearIO.observe(el);
    visIO.observe(el);
    return () => {
      nearIO.disconnect();
      visIO.disconnect();
    };
  }, []);

  useEffect(() => {
    const v = vref.current;
    if (!v || !near) return;
    v.muted = muted;
    if (visible && !paused && !still) {
      v.play().catch(() => {
        // sound can be refused without a gesture: fall back to muted playback
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {});
      });
    } else v.pause();
  }, [near, visible, paused, still, muted]);

  const onTime = useCallback(() => {
    const v = vref.current;
    if (v && v.currentTime >= to) v.currentTime = from;
  }, [from, to]);

  const toggle = () => {
    const v = vref.current;
    if (!v) return;
    if (v.paused) {
      setPaused(false);
      v.play().catch(() => {});
    } else {
      setPaused(true);
      v.pause();
    }
  };

  return (
    <div ref={boxRef} className={`relative overflow-hidden bg-ink ${className}`}>
      {/* the first frame shows as a poster while the file is still unloaded */}
      <video
        ref={vref}
        src={near || still ? `${src}#t=${Math.max(from, 0.1)}` : undefined}
        muted
        playsInline
        preload={near ? "auto" : "none"}
        disablePictureInPicture
        onTimeUpdate={onTime}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label={label}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {sound && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          className="absolute bottom-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-ivory/40 bg-ink/50 text-ivory transition-colors active:bg-raviraj md:hover:bg-raviraj"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 9v6h4l5 4V5L8 9z" />
            {muted ? <path d="M17 9l5 6M22 9l-5 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}
          </svg>
        </button>
      )}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause: ${label}` : `Play: ${label}`}
        className="absolute inset-0 z-10 cursor-pointer"
      >
        <span
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-ivory/40 bg-ink/40 text-ivory transition-opacity duration-300 ${
            playing ? "opacity-0" : "opacity-100"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
            <path d="M7 4.5v15l12-7.5z" />
          </svg>
        </span>
      </button>
    </div>
  );
}
