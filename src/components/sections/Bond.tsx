import { bond } from "@/lib/content";
import { splitEmphasis } from "@/lib/motion";

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
        <div className="md:col-span-9 md:col-start-2">
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
