"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  /** Loop window in seconds — `to` stops short of any end card. */
  from?: number;
  to: number;
  label: string;
  className?: string;
};

/**
 * A muted looping reel that costs nothing until it is needed: the file is requested only when
 * the card is near the viewport, plays only while mostly visible, and a tap pauses / resumes it.
 * Reduced-motion / data-saver visitors get the first frame and a play button.
 */
export default function Reel({ src, from = 0, to, label, className = "" }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const vref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);

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
    if (visible && !paused && !still) v.play().catch(() => {});
    else v.pause();
  }, [near, visible, paused, still]);

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
