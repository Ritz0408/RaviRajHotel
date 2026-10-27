import Image from "next/image";
import { brand, brotherhood } from "@/lib/content";

const ICONS = [
  // friendship: two linked rings
  <g key="f"><circle cx="17" cy="24" r="9" /><circle cx="31" cy="24" r="9" /></g>,
  // family: roof over a table
  <g key="m"><path d="M6 22 24 8l18 14" /><path d="M12 20v18h24V20" /><path d="M20 38V28h8v10" /></g>,
  // togetherness: three people
  <g key="t"><circle cx="24" cy="15" r="5" /><circle cx="11" cy="20" r="4" /><circle cx="37" cy="20" r="4" /><path d="M14 38c0-7 4-11 10-11s10 4 10 11" /></g>,
  // memories: ball with seam
  <g key="s"><circle cx="24" cy="24" r="15" /><path d="M11 17c8 5 18 5 26 0M11 31c8-5 18-5 26 0" strokeDasharray="2.5 3" /></g>,
];

/** Rotating text badge: the tagline set on a circle around a cricket ball. */
function Badge() {
  return (
    <svg viewBox="0 0 120 120" className="badge-spin h-full w-full" aria-hidden>
      <defs>
        <path id="badge-ring" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
      </defs>
      <text className="font-sans" fontSize="9.5" letterSpacing="3.2" fill="#f3ebdf" fillOpacity="0.9">
        <textPath href="#badge-ring">THE BONDING OF BROTHER&apos;S LOVE · THE BONDING OF BROTHER&apos;S LOVE ·</textPath>
      </text>
    </svg>
  );
}

/**
 * Bento layout, one screen of reading, no pinning. A big photograph with a turning badge,
 * the passage lighting up word by word, and four pillar cards. All motion is transform/opacity CSS.
 */
export default function Brotherhood() {
  const words = brotherhood.passage.split(" ");
  const step = 0.03; // seconds between words

  return (
    <section className="relative overflow-hidden bg-burgundy-900 text-ivory" aria-label="Brotherhood">
      {/* ambient glow + watermark */}
      <div className="pointer-events-none absolute -left-1/4 top-0 h-[70vw] max-h-[900px] w-[70vw] max-w-[900px] bg-[radial-gradient(circle,rgba(140,33,29,0.5),transparent_65%)]" />
      <div
        lang="mr"
        aria-hidden
        className="pointer-events-none absolute -right-[4vw] bottom-[2vh] select-none whitespace-nowrap font-marathi text-[26vw] leading-none text-ivory/[0.035]"
      >
        बंधुप्रेम
      </div>

      <div className="relative mx-auto max-w-[1680px] px-5 py-24 md:px-10 md:py-40">
        <span data-reveal className="eyebrow mb-6 flex items-center gap-4 text-terracotta">
          <span className="h-px w-10 bg-terracotta" />
          04 — {brotherhood.eyebrow}
        </span>
        <h2 data-reveal className="display max-w-[16ch] text-[clamp(3rem,8.5vw,9rem)] leading-[0.9]">
          Where <em className="italic text-sand">brotherhood</em> becomes a <span className="text-champagne">tradition.</span>
        </h2>

        <div className="mt-14 grid gap-4 md:mt-24 md:grid-cols-12 md:gap-5">
          {/* photograph + turning badge */}
          <div data-reveal="scale" className="relative md:col-span-7 md:row-span-2">
            <div className="relative aspect-[4/5] overflow-hidden bg-ink-2 md:aspect-auto md:h-full md:min-h-[34rem]">
              <Image
                src={brotherhood.image.src}
                alt={brotherhood.image.alt}
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                quality={75}
                style={{ objectPosition: brotherhood.image.position }}
                className="object-cover saturate-[0.92]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-burgundy-900/30" />
              <span className="eyebrow absolute left-5 top-5 border border-ivory/30 bg-ink/40 px-3 py-2 text-[0.55rem]">
                The lawn · mid-stroke
              </span>
              <p className="absolute inset-x-0 bottom-0 p-6 font-serif text-2xl italic leading-snug text-ivory md:p-9 md:text-4xl">
                &ldquo;Always the other end of the pitch.&rdquo;
              </p>
            </div>
            <div data-live-scene data-live="false" className="live-scene absolute -right-2 -top-8 h-28 w-28 md:-right-8 md:-top-12 md:h-40 md:w-40">
              <div className="absolute inset-0 rounded-full bg-raviraj shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]" />
              <Badge />
              <svg viewBox="0 0 24 24" className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-ivory md:h-11 md:w-11" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                <circle cx="12" cy="12" r="8" />
                <path d="M5 9c4 2.5 10 2.5 14 0M5 15c4-2.5 10-2.5 14 0" strokeDasharray="2 2" />
              </svg>
            </div>
          </div>

          {/* passage */}
          <div data-reveal="right" className="border border-ivory/15 bg-ink/30 p-6 md:col-span-5 md:p-10">
            <span lang="mr" className="mb-6 block font-marathi text-lg text-sand/80">
              {brand.marathi} — बंधुप्रेम
            </span>
            <p data-reveal="words" className="display text-[clamp(1.35rem,2.1vw,2.15rem)] leading-[1.28]">
              {words.map((w, i) => (
                <span
                  key={i}
                  style={{ "--d": `${0.3 + i * step}s` } as React.CSSProperties}
                  className="word mr-[0.26em] inline-block"
                >
                  {w}
                </span>
              ))}
            </p>
          </div>

          {/* pillars */}
          <ul className="grid grid-cols-2 gap-4 md:col-span-5 md:gap-5">
            {brotherhood.pillars.map((pillar, i) => (
              <li
                key={pillar}
                data-reveal
                style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}
                className="group relative overflow-hidden border border-ivory/15 bg-ink/30 p-5 transition-colors duration-500 active:bg-raviraj/30 md:p-7 md:hover:bg-raviraj/25"
              >
                <span className="eyebrow absolute right-4 top-4 text-[0.55rem] tabular-nums text-terracotta">0{i + 1}</span>
                <svg viewBox="0 0 48 48" className="h-9 w-9 text-champagne transition-transform duration-500 group-hover:-translate-y-1 md:h-11 md:w-11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                  {ICONS[i]}
                </svg>
                <h3 className="display mt-6 text-2xl leading-tight md:text-3xl">{pillar}</h3>
                <p className="mt-2 text-[0.82rem] leading-[1.6] text-sand/70 md:text-[0.9rem]">{brotherhood.pillarNotes[i]}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
