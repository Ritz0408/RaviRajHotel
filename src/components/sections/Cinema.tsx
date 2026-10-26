"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cinema, video } from "@/lib/content";

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

/**
 * The evening reel as a short film: portrait phone footage in a viewfinder frame,
 * with big outline titles drifting past it in opposite directions as you scroll.
 * The 6 MB file is only requested when the section is near, plays only while visible,
 * and falls back to a still + play button on reduced-motion / data-saver.
 */
export default function Cinema() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const [near, setNear] = useState(false); // start fetching the file
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [saveData, setSaveData] = useState(false);

  const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const still = reduced || saveData;
  const wordA = useTransform(p, [0, 1], still ? ["0%", "0%"] : ["12%", "-14%"]);
  const wordB = useTransform(p, [0, 1], still ? ["0%", "0%"] : ["-14%", "12%"]);
  const scale = useTransform(p, [0.05, 0.4], still ? [1, 1] : [0.86, 1]);
  const lift = useTransform(p, [0, 1], still ? [0, 0] : [28, -28]);
  const bars = useTransform(p, [0.1, 0.38], still ? [0, 0] : [1, 0]);

  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only capability check
    setSaveData(!!nav.connection?.saveData);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      setNear(true);
      setVisible(true);
      return;
    }
    const nearIO = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "500px 0px" });
    const visIO = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    nearIO.observe(el);
    visIO.observe(el);
    return () => {
      nearIO.disconnect();
      visIO.disconnect();
    };
  }, []);

  // play only while visible and not paused by the viewer
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !near) return;
    if (visible && !userPaused && !still) v.play().catch(() => {});
    else v.pause();
  }, [near, visible, userPaused, still]);

  // loop the dining-hall segment; timecode written straight to the DOM (no re-render)
  const onTime = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.currentTime >= video.loopTo) v.currentTime = video.loopFrom;
    if (tcRef.current) {
      const t = Math.max(0, v.currentTime - video.loopFrom);
      tcRef.current.textContent = `00:${pad(t)}:${pad((t % 1) * 24)}`;
    }
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      v.play().catch(() => {});
    } else {
      setUserPaused(true);
      v.pause();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ink py-24 text-ivory md:py-40"
      aria-label={cinema.eyebrow}
    >
      <div className="cinema-glow pointer-events-none absolute left-1/2 top-1/2 h-[120vw] max-h-[1100px] w-[120vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2" />

      {/* drifting outline titles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-[2vw] select-none">
        <motion.div style={{ x: wordA }} className="display outline-type whitespace-nowrap text-[clamp(4.5rem,19vw,17rem)] leading-[0.85] will-change-transform">
          {cinema.words[0]} · {cinema.words[0]}
        </motion.div>
        <motion.div style={{ x: wordB }} className="display outline-type whitespace-nowrap text-[clamp(4.5rem,19vw,17rem)] leading-[0.85] will-change-transform">
          {cinema.words[1]} · {cinema.words[1]}
        </motion.div>
      </div>

      <div className="relative mx-auto flex max-w-[1680px] flex-col items-center px-5 md:px-10">
        <motion.div style={{ scale, y: lift }} className="relative w-[78vw] max-w-[400px] will-change-transform md:w-[26vw] md:min-w-[320px]">
          {/* offset hairline frame */}
          <div className="absolute -right-3 -top-3 h-full w-full border border-champagne/30 md:-right-5 md:-top-5" />

          <div className="relative aspect-[9/14] overflow-hidden bg-ink-2 shadow-[0_50px_90px_-30px_rgba(0,0,0,0.85)]">
            {/* still: shown first, and kept for reduced-motion / data-saver */}
            <Image
              src={cinema.poster.src}
              alt={cinema.poster.alt}
              fill
              sizes="(min-width: 768px) 26vw, 78vw"
              style={{ objectPosition: cinema.poster.position }}
              className="object-cover"
            />
            {near && !still && (
              <video
                ref={videoRef}
                src={`${video.src}#t=${video.loopFrom}`}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                onTimeUpdate={onTime}
                onPlaying={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                aria-label="Evening at the Hotel Raviraj dining hall"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                  playing ? "opacity-100" : "opacity-0"
                }`}
              />
            )}

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_50%,rgba(14,8,7,0.6)_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/40" />

            {/* letterbox bars retreat as the film opens */}
            <motion.div style={{ scaleY: bars }} className="pointer-events-none absolute inset-x-0 top-0 h-[14%] origin-top bg-ink" />
            <motion.div style={{ scaleY: bars }} className="pointer-events-none absolute inset-x-0 bottom-0 h-[14%] origin-bottom bg-ink" />

            {/* viewfinder corners */}
            <span className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t border-ivory/60" />
            <span className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-ivory/60" />
            <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-ivory/60" />
            <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r border-ivory/60" />

            <div className="absolute inset-x-5 top-6 flex items-center justify-between">
              <span className="eyebrow flex items-center gap-2 text-[0.58rem] text-ivory/85">
                <span className={`h-1.5 w-1.5 rounded-full bg-raviraj ${playing ? "animate-pulse" : ""}`} /> REC
              </span>
              <span ref={tcRef} className="eyebrow text-[0.58rem] tabular-nums text-ivory/70">
                00:00:00
              </span>
            </div>

            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause the evening reel" : "Play the evening reel"}
              className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full border border-ivory/40 bg-ink/50 text-ivory transition-colors active:bg-raviraj md:hover:bg-raviraj"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M7 4.5v15l12-7.5z" />
                </svg>
              )}
            </button>
            <span className="eyebrow absolute bottom-6 left-5 text-[0.6rem] text-ivory/85">{cinema.eyebrow}</span>
          </div>
        </motion.div>

        <p className="relative mt-14 max-w-[40ch] text-center font-serif text-xl italic leading-snug text-ivory/85 md:mt-20 md:text-3xl">
          {cinema.copy}
        </p>
      </div>
    </section>
  );
}
