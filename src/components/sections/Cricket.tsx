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

/** A six, side-on: bowler runs in and delivers, the batsman (his brother) swings, the ball clears the boundary. Transform-only CSS animation. */
function Pitch() {
  return (
    <div
      data-live-scene
      data-live="false"
      className="cricket-scene relative overflow-hidden border border-ivory/10 bg-[#140a09]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(176,86,47,0.3),transparent_65%)]" />
      <svg viewBox="0 24 1000 224" className="relative block h-auto w-full" role="img" aria-label="Side view of a cricket match: a bowler delivers, his brother the batsman swings, and the ball sails over the boundary for six">
        {/* stadium floodlights + distant crowd */}
        <g fill="#f3ebdf" fillOpacity="0.5">
          {[60, 90, 150, 330, 410, 520, 600, 690, 770, 880, 930].map((x, i) => (
            <circle key={x} cx={x} cy={178 + (i % 3) * 5} r="2.4" />
          ))}
        </g>
        {/* ground */}
        <rect x="0" y="200" width="1000" height="60" fill="#241209" />
        <rect x="70" y="200" width="860" height="9" fill="#5a3a22" />
        <path d="M0 200h1000" stroke="#f3ebdf" strokeOpacity="0.25" />
        <path d="M250 200v10M880 200v10" stroke="#f3ebdf" strokeOpacity="0.55" strokeWidth="2" />

        {/* wicketkeeper, crouched behind the stumps */}
        <g>
          <path d="M60 200v-26q0-22 18-22l16 8v40z" fill="#c9b496" />
          <circle cx="78" cy="148" r="9" fill="#c9a27a" />
          <path d="M69 148a9 9 0 0 1 18 0z" fill="#3f1012" />
          <circle cx="100" cy="176" r="7" fill="#f3ebdf" />
        </g>
        {/* stumps */}
        <g fill="#f3ebdf">
          <rect x="110" y="128" width="4" height="72" rx="2" />
          <rect x="120" y="128" width="4" height="72" rx="2" />
          <rect x="130" y="128" width="4" height="72" rx="2" />
          <rect x="110" y="123" width="12" height="3" rx="1.5" fill="#c4a573" />
          <rect x="122" y="123" width="12" height="3" rx="1.5" fill="#c4a573" />
        </g>

        {/* batsman — brother one */}
        <g>
          <rect x="159" y="150" width="11" height="50" rx="4" fill="#f3ebdf" />
          <rect x="180" y="150" width="11" height="50" rx="4" fill="#f3ebdf" />
          <rect x="156" y="196" width="18" height="6" rx="3" fill="#140a09" />
          <rect x="178" y="196" width="18" height="6" rx="3" fill="#140a09" />
          <rect x="157" y="100" width="36" height="54" rx="13" fill="#8c211d" />
          <path d="M176 110L198 135" stroke="#c9a27a" strokeWidth="7" strokeLinecap="round" />
          <circle cx="178" cy="86" r="11" fill="#c9a27a" />
          <path d="M166 86a12 12 0 0 1 24 0v2h-24z" fill="#3f1012" />
          <rect x="186" y="85" width="11" height="3" rx="1.5" fill="#3f1012" />
          <g className="cr-bat">
            <rect x="194.5" y="135" width="7" height="24" rx="3" fill="#c9b496" />
            <rect x="190" y="158" width="16" height="50" rx="4" fill="#e8d5a8" />
            <rect x="196.5" y="158" width="3" height="50" fill="#c4a573" fillOpacity="0.6" />
          </g>
        </g>

        {/* bowler — brother two, runs in and delivers */}
        <g className="cr-bowler">
          <rect x="811" y="152" width="10" height="48" rx="4" fill="#f3ebdf" />
          <rect x="826" y="152" width="10" height="48" rx="4" fill="#f3ebdf" />
          <rect x="808" y="196" width="16" height="6" rx="3" fill="#140a09" />
          <rect x="824" y="196" width="16" height="6" rx="3" fill="#140a09" />
          <rect x="806" y="100" width="34" height="54" rx="13" fill="#b0562f" />
          <path d="M812 112L800 134" stroke="#c9a27a" strokeWidth="7" strokeLinecap="round" />
          <circle cx="823" cy="86" r="10" fill="#c9a27a" />
          <path d="M813 85a10 10 0 0 1 20 0z" fill="#f3ebdf" />
          <rect x="806" y="84" width="9" height="3" rx="1.5" fill="#f3ebdf" />
          <g className="cr-arm">
            <path d="M820 108v42" stroke="#c9a27a" strokeWidth="7" strokeLinecap="round" />
          </g>
        </g>

        {/* contact flash */}
        <g className="cr-flash" fill="none" stroke="#c4a573">
          <circle cx="222" cy="168" r="9" strokeWidth="2" />
          <circle cx="222" cy="168" r="20" strokeWidth="1" strokeDasharray="3 5" />
        </g>

        {/* the ball: bounce, strike, six */}
        <g className="cr-ball">
          <circle r="6" fill="#8c211d" />
          <path d="M-4.5 -2c3 2 6 2 9 0" stroke="#f3ebdf" strokeWidth="1" fill="none" />
        </g>

        <g className="cr-six">
          <text x="700" y="96" textAnchor="middle" fontSize="76" fill="#c4a573" className="font-serif italic">
            SIX!
          </text>
        </g>

        <g className="font-sans" fontSize="11" letterSpacing="3" fill="#f3ebdf" fillOpacity="0.55" textAnchor="middle">
          <text x="176" y="232">BROTHER ONE</text>
          <text x="823" y="232">BROTHER TWO</text>
        </g>
      </svg>
      <p className="eyebrow absolute left-4 top-3 text-[0.55rem] text-ivory/50">One last over</p>
    </div>
  );
}
export default function Cricket() {
  return (
    <section id="cricket" className="relative overflow-hidden bg-ink py-28 text-ivory md:py-44" aria-label={cricket.eyebrow}>
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

        <div data-reveal className="mt-14 md:mt-24">
          <Pitch />
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
