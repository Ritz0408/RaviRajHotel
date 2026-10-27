import Image from "next/image";
import { cricket } from "@/lib/content";
import { splitEmphasis } from "@/lib/motion";

type IconName = (typeof cricket.moments)[number]["icon"];

function Icon({ name }: { name: IconName }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
      {name === "sun" && (
        <g {...common}>
          <circle cx="24" cy="28" r="9" />
          <path d="M6 40h36M24 8v6M10 16l4 4M38 16l-4 4M4 28h6M38 28h6" />
        </g>
      )}
      {name === "ball" && (
        <g {...common}>
          <circle cx="24" cy="24" r="16" />
          <path d="M11 16c8 5 18 5 26 0M11 32c8-5 18-5 26 0" strokeDasharray="2.5 3" />
        </g>
      )}
      {name === "stumps" && (
        <g {...common}>
          <path d="M14 14v28M24 14v28M34 14v28" />
          <path d="M14 11h10M24 11h10" />
        </g>
      )}
      {name === "plate" && (
        <g {...common}>
          <circle cx="24" cy="26" r="14" />
          <circle cx="24" cy="26" r="8" strokeOpacity="0.5" />
          <path d="M6 10v10M10 10v10M8 20v18M42 10c-4 4-4 12 0 14v14" />
        </g>
      )}
    </svg>
  );
}

export default function Cricket() {
  return (
    <section id="cricket" className="relative overflow-hidden bg-ink pb-8 pt-28 text-ivory md:pb-12 md:pt-44" aria-label={cricket.eyebrow}>
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <span data-reveal className="eyebrow mb-10 flex items-center gap-4 text-terracotta md:mb-14">
          <span className="h-px w-10 bg-terracotta" />
          {cricket.eyebrow}
          <svg viewBox="0 0 24 24" className="ball-spin h-4 w-4 text-raviraj" aria-hidden>
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <path d="M4 8c5 3 11 3 16 0M4 16c5-3 11-3 16 0" stroke="#f3ebdf" strokeWidth="1" fill="none" strokeDasharray="2 2" />
          </svg>
        </span>

        <div className="grid gap-8 md:grid-cols-12 md:gap-6">
          <h2 data-reveal className="display text-[clamp(2.9rem,8vw,8.5rem)] md:col-span-8">
            {cricket.title.map((line, i) => (
              <span key={i} className="block">
                {splitEmphasis(line).map((p, j) =>
                  p.em ? (
                    <em key={j} className="font-serif italic font-light text-sand">
                      {p.text}
                    </em>
                  ) : (
                    <span key={j}>{p.text}</span>
                  ),
                )}
              </span>
            ))}
          </h2>
          <p data-reveal style={{ "--d": "0.1s" } as React.CSSProperties} className="self-end leading-[1.85] text-sand/80 md:col-span-4">
            {cricket.copy}
          </p>
        </div>

        {/* Memorable moments */}
        <ul className="mt-14 grid grid-cols-1 gap-px border border-ivory/10 bg-ivory/10 sm:grid-cols-2 lg:grid-cols-4 md:mt-20">
          {cricket.moments.map((m, i) => (
            <li
              key={m.title}
              data-reveal
              style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}
              className="group relative bg-ink p-7 transition-colors duration-500 active:bg-burgundy-900 md:p-9 md:hover:bg-burgundy-900"
            >
              <span className="eyebrow absolute right-6 top-6 text-[0.6rem] tabular-nums text-terracotta">0{i + 1}</span>
              <span className="block text-champagne transition-transform duration-500 group-hover:-translate-y-1">
                <Icon name={m.icon} />
              </span>
              <h3 className="display mt-8 text-3xl md:text-4xl">{m.title}</h3>
              <p className="mt-3 max-w-[30ch] text-[0.95rem] leading-[1.7] text-sand/75">{m.note}</p>
            </li>
          ))}
        </ul>

        {/* Match photograph + scoreboard */}
        <div className="mt-20 grid items-stretch gap-10 md:mt-32 md:grid-cols-12 md:gap-6">
          <div data-reveal="left" className="relative aspect-[4/3] overflow-hidden bg-ink-2 md:col-span-7 md:aspect-auto md:min-h-[26rem]">
            <Image
              src={cricket.image.src}
              alt={cricket.image.alt}
              fill
              sizes="(min-width: 768px) 56vw, 100vw"
              style={{ objectPosition: cricket.image.position }}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <span className="eyebrow absolute bottom-4 left-5 text-[0.6rem] text-ivory/80">The Raviraj lawn · Batsmen mid-stroke</span>
          </div>

          <div data-reveal="right" className="flex flex-col justify-between border border-champagne/30 bg-[#140a09] p-6 md:col-span-5 md:p-10">
            <div>
              <span className="eyebrow flex items-center justify-between text-[0.6rem] text-champagne">
                <span>Raviraj XI</span>
                <span className="flex items-center gap-2 text-terracotta">
                  <span className="h-1.5 w-1.5 rounded-full bg-terracotta" /> Live
                </span>
              </span>
              <dl className="mt-8 grid grid-cols-3 gap-3 text-center">
                {cricket.scoreboard.map((s) => (
                  <div key={s.label} className="border border-ivory/10 px-2 py-5">
                    <dd className="display text-5xl text-champagne md:text-6xl">{s.value}</dd>
                    <dt className="eyebrow mt-3 text-[0.52rem] text-ivory/60 md:text-[0.58rem]">{s.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
            <p className="display mt-10 text-2xl italic text-ivory/85 md:text-3xl">{cricket.result}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
