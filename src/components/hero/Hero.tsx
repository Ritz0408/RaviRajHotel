"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import RevealLines from "@/components/ui/RevealLines";
import SplitLetters from "@/components/ui/SplitLetters";
import { brand, hero } from "@/lib/content";
import { EASE_LUXE } from "@/lib/motion";
import { scrollToHash, useLenis } from "@/components/providers/SmoothScroll";

const { video } = hero;

/** One screen, no pinning: the video loops behind the brand, and the next scroll is already the next section. */
export default function Hero() {
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStatic, setIsStatic] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Reduced motion and data-saver visitors get the first frame instead of autoplaying video.
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only capability check
    setIsStatic(window.matchMedia("(prefers-reduced-motion: reduce)").matches || !!nav.connection?.saveData);
  }, []);

  // play only while the hero is on screen
  useEffect(() => {
    const el = sectionRef.current;
    const v = videoRef.current;
    if (!el || !v || isStatic || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [isStatic]);

  // keep the loop inside the clean part of the footage (before its end card)
  const onTime = () => {
    const v = videoRef.current;
    if (v && v.currentTime >= video.to) v.currentTime = video.from;
  };

  const go = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToHash(lenis, hash);
  };

  return (
    <section id="top" ref={sectionRef} className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-[#120a08]">
      {/* Background video: full-bleed on phones, right-hand panel on landscape screens */}
      <motion.div
        className="absolute inset-0 wide:left-[38%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        <video
          ref={videoRef}
          src={`${video.src}#t=${video.from + 0.1}`}
          autoPlay={!isStatic}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onTimeUpdate={onTime}
          onPlaying={() => setPlaying(true)}
          aria-label="Sizzling spices and slow-cooked dishes from the Raviraj kitchen"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            playing || isStatic ? "opacity-100" : "opacity-90"
          }`}
        />
      </motion.div>

      {/* Readability: dark left field (desktop) / top field (mobile) + vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#120a08] via-[#120a08]/50 to-transparent wide:bg-gradient-to-r wide:from-[#120a08]/95 wide:via-[#120a08]/45 wide:to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,transparent_45%,rgba(14,8,7,0.65)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      {/* ---- Copy ---------------------------------------------------------- */}
      <div className="relative z-20 mx-auto flex h-full max-w-[1680px] flex-col px-5 pt-28 md:px-10 wide:justify-center wide:pt-0">
        <div className="md:max-w-xl wide:w-[44%] wide:max-w-none lg:wide:w-[40%]">
          <motion.div
            className="mb-6 flex items-center gap-4 md:mb-8"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 0.2 }}
          >
            <span className="h-px w-10 bg-terracotta" />
            <span className="eyebrow text-ivory/80">{hero.eyebrow}</span>
          </motion.div>
          <h1 className="flex flex-col">
            <span className="eyebrow mb-1 pl-[0.35em] text-[0.8rem] tracking-[0.75em] text-ivory/85">
              <SplitLetters text="HOTEL" play stagger={0.06} delay={0.3} />
            </span>
            <SplitLetters
              text="Raviraj"
              play
              delay={0.4}
              stagger={0.06}
              className="display -ml-[0.04em] text-[clamp(4.5rem,11vw,10.5rem)] leading-[0.85] text-ivory"
            />
          </h1>
          <motion.p
            lang="mr"
            className="mt-4 font-marathi text-xl text-sand md:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.9 }}
          >
            {brand.marathi}
          </motion.p>
          <RevealLines
            as="h2"
            play
            delay={0.8}
            lines={["The Bonding of *Brother's Love*"]}
            className="display mt-8 text-[clamp(1.75rem,2.6vw,2.6rem)] text-ivory/95"
          />
          <motion.p
            lang="mr"
            className="mt-5 inline-block border-l-2 border-terracotta pl-4 font-marathi text-[1.35rem] leading-snug text-champagne md:text-3xl"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 1.0 }}
          >
            {brand.slogan.mr}
          </motion.p>
          <motion.div
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 1.1 }}
          >
            <a href="#brothers" onClick={go("#brothers")} className="btn-primary eyebrow">
              Explore hotel
            </a>
            <a href="#locations" onClick={go("#locations")} className="link-line eyebrow self-start text-ivory sm:self-auto">
              Our locations <span aria-hidden>→</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-20 border-t border-ivory/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
      >
        <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-5 md:h-20 md:px-10">
          <span className="eyebrow text-[0.6rem] text-sand/70">{brand.kind}</span>
          <span className="eyebrow flex items-center gap-4 text-[0.62rem] text-ivory/60">
            <span className="hidden sm:inline">Scroll</span>
            <span className="relative h-10 w-px overflow-hidden bg-ivory/20">
              <span className="absolute inset-0 bg-ivory/80 [animation:scroll-cue_2.4s_cubic-bezier(0.76,0,0.24,1)_infinite]" />
            </span>
          </span>
        </div>
      </motion.div>
    </section>
  );
}
