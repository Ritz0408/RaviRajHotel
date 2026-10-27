import Image from "next/image";
import { brand, brotherhood } from "@/lib/content";

/**
 * One screen, no pinning. The photograph sits behind the statement; when the section scrolls
 * into view the passage lights up word by word on its own (CSS transitions, started by the
 * shared reveal observer) and the four pillars settle in after it.
 */
export default function Brotherhood() {
  const words = brotherhood.passage.split(" ");
  const step = 0.035; // seconds between words

  return (
    <section className="relative overflow-hidden bg-burgundy-900 text-ivory" aria-label="Brotherhood">
      <div className="absolute inset-0">
        <Image
          src={brotherhood.image.src}
          alt={brotherhood.image.alt}
          fill
          sizes="100vw"
          quality={75}
          style={{ objectPosition: brotherhood.image.position }}
          className="object-cover saturate-[0.9]"
        />
        <div className="absolute inset-0 bg-burgundy-900/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/70" />
      </div>

      <div className="relative mx-auto max-w-[1680px] px-5 py-28 md:px-10 md:py-44">
        <span data-reveal className="eyebrow mb-6 block text-terracotta">
          04 — {brotherhood.eyebrow}
        </span>
        <h2 data-reveal className="display text-[clamp(3rem,9vw,10rem)] leading-[0.9]">
          Where <em className="italic text-sand">brotherhood</em>
          <br />
          becomes a tradition.
        </h2>

        <div className="mt-16 md:mt-24 md:max-w-[70%]">
          <span data-reveal lang="mr" className="mb-8 block font-marathi text-xl text-sand/80">
            {brand.marathi} — बंधुप्रेम
          </span>
          <p data-reveal="words" className="display max-w-[26ch] text-[clamp(1.55rem,3.6vw,3.8rem)] leading-[1.15]">
            {words.map((w, i) => (
              <span
                key={i}
                style={{ "--d": `${0.3 + i * step}s` } as React.CSSProperties}
                className="word mr-[0.28em] inline-block"
              >
                {w}
              </span>
            ))}
          </p>
        </div>

        <ul
          data-reveal
          style={{ "--d": `${0.5 + words.length * step}s` } as React.CSSProperties}
          className="mt-14 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-4 border-t border-ivory/15 pt-8 md:mt-20 md:grid-cols-4"
        >
          {brotherhood.pillars.map((pillar, i) => (
            <li key={pillar} className="flex items-baseline gap-3">
              <span className="eyebrow text-[0.6rem] text-terracotta">0{i + 1}</span>
              <span className="font-serif text-2xl italic">{pillar}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
