"use client";

import { motion } from "framer-motion";
import PatternRule from "@/components/ui/PatternRule";
import { brand, locations, nav } from "@/lib/content";
import { scrollToHash, useLenis } from "@/components/providers/SmoothScroll";

export default function Footer() {
  const lenis = useLenis();
  const go = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToHash(lenis, hash);
  };

  return (
    <footer className="relative overflow-hidden bg-ink pt-14 text-ivory md:pt-20">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="mb-10 text-raviraj md:mb-14">
          <PatternRule className="opacity-70" />
        </div>
        <div className="grid gap-8 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-4">
            <p className="display text-4xl leading-tight">
              The Bonding of <em className="italic text-sand">Brother&apos;s Love</em>
            </p>
            <p lang="mr" className="mt-4 font-marathi text-xl text-sand/70">
              {brand.marathi} · {brand.kindMarathi}
            </p>
            <p lang="mr" className="mt-6 border-l-2 border-terracotta pl-4 font-marathi text-2xl text-champagne">
              {brand.slogan.mr}
            </p>
          </div>

          {locations.map((l) => (
            <div key={l.id} className="md:col-span-2">
              <span className="eyebrow text-[0.6rem] text-terracotta">{l.index}</span>
              <address className="mt-4 not-italic leading-[1.9] text-sand/80">
                {l.address.map((a) => (
                  <span key={a} className="block">
                    {a}
                  </span>
                ))}
              </address>
            </div>
          ))}

          <nav className="md:col-span-2" aria-label="Footer">
            <ul className="flex flex-col gap-3">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} onClick={go(n.href)} className="link-line eyebrow pb-1 text-ivory/70 hover:text-ivory">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-ivory/10 py-6 text-xs text-sand/50 sm:flex-row md:mt-14">
          <span>© {new Date().getFullYear()} Hotel Raviraj. All rights reserved.</span>
          <a href="#top" onClick={go("#top")} className="eyebrow text-[0.6rem] hover:text-ivory">
            Back to top ↑
          </a>
        </div>
      </div>

      <motion.p
        aria-hidden
        className="display pointer-events-none select-none whitespace-nowrap pb-[0.08em] text-center text-[25vw] leading-[0.95] text-raviraj/80"
        initial={{ y: "30%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        Raviraj
      </motion.p>
    </footer>
  );
}
