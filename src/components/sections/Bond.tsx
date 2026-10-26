import { bond } from "@/lib/content";
import { splitEmphasis } from "@/lib/motion";

/** Crossed bats and a ball inside a stitched ring: the brothers, one at each end of the pitch. */
function Emblem() {
  return (
    <svg viewBox="0 0 320 320" className="h-full w-full" role="img" aria-label="Two crossed cricket bats and a ball inside a stitched ring">
      <circle
        className="seam-draw"
        cx="160"
        cy="160"
        r="150"
        pathLength="1"
        fill="none"
        stroke="#c4a573"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="1"
        transform="rotate(-90 160 160)"
      />
      <circle cx="160" cy="160" r="138" fill="none" stroke="#c4a573" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 7" />
      <g className="bat bat-l" fill="#f3ebdf">
        <rect x="153" y="30" width="14" height="86" rx="7" />
        <rect x="139" y="108" width="42" height="170" rx="18" />
      </g>
      <g className="bat bat-r" fill="#c9b496">
        <rect x="153" y="30" width="14" height="86" rx="7" />
        <rect x="139" y="108" width="42" height="170" rx="18" />
      </g>
      <g className="ball-pop">
        <circle cx="160" cy="236" r="26" fill="#8c211d" />
        <path d="M138 226c14 6 30 6 44 0M138 246c14-6 30-6 44 0" fill="none" stroke="#f3ebdf" strokeOpacity="0.85" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 3" />
      </g>
    </svg>
  );
}

export default function Bond() {
  return (
    <section className="relative overflow-hidden bg-burgundy-900 py-28 text-ivory md:py-44" aria-label={bond.eyebrow}>
      {/* giant Marathi watermark */}
      <div
        lang="mr"
        aria-hidden
        className="pointer-events-none absolute -left-[3vw] top-[6vh] select-none whitespace-nowrap font-marathi text-[30vw] leading-none text-ivory/[0.035]"
      >
        भाऊ
      </div>

      <div className="relative mx-auto grid max-w-[1680px] gap-16 px-5 md:grid-cols-12 md:gap-6 md:px-10">
        <div className="md:col-span-5 md:col-start-1">
          <div data-reveal="scale" className="bond-emblem mx-auto aspect-square w-[68vw] max-w-[380px] md:sticky md:top-32 md:w-full">
            <Emblem />
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <span data-reveal className="eyebrow mb-8 flex items-center gap-4 text-terracotta">
            <span className="h-px w-10 bg-terracotta" />
            {bond.eyebrow}
          </span>

          <h2 data-reveal className="display text-[clamp(2.6rem,6.4vw,6.4rem)] leading-[0.95]">
            {bond.title.map((line, i) => (
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

          <p data-reveal lang="mr" className="mt-6 font-marathi text-2xl text-sand md:text-3xl">
            {bond.marathi}
          </p>

          <div className="mt-12 space-y-7 md:mt-16">
            {bond.beats.map((b, i) => (
              <p
                key={i}
                data-reveal
                style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}
                className="max-w-[44ch] border-l border-ivory/20 pl-5 text-[1.02rem] leading-[1.85] text-ivory/80 md:text-[1.1rem]"
              >
                {b}
              </p>
            ))}
          </div>

          <p data-reveal className="display mt-12 max-w-[26ch] text-[clamp(1.6rem,3vw,2.6rem)] italic text-champagne md:mt-16">
            {bond.closing}
          </p>

          <blockquote data-reveal className="mt-14 border-t border-ivory/15 pt-8 md:mt-20">
            <p className="font-serif text-xl italic leading-snug text-ivory/70 md:text-2xl">“{bond.quote}”</p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
