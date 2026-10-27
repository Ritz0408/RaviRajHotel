import Reel from "@/components/ui/Reel";
import { bond } from "@/lib/content";
import { splitEmphasis } from "@/lib/motion";

/** The story of the two brothers behind Hotel Raviraj: their own film in a feature frame, beside the words. */
export default function Bond() {
  const { video } = bond;
  return (
    <section id="brothers" className="relative overflow-hidden bg-burgundy-900 py-24 text-ivory md:py-40" aria-label={bond.eyebrow}>
      {/* giant Marathi watermark */}
      <div
        lang="mr"
        aria-hidden
        className="pointer-events-none absolute -left-[3vw] top-[4vh] select-none whitespace-nowrap font-marathi text-[30vw] leading-none text-ivory/[0.035]"
      >
        भाऊ
      </div>
      <div className="pointer-events-none absolute -left-1/4 top-1/4 h-[80vw] max-h-[1000px] w-[80vw] max-w-[1000px] bg-[radial-gradient(circle,rgba(140,33,29,0.45),transparent_62%)]" />

      <div className="relative mx-auto max-w-[1680px] px-5 md:px-10">
        <span data-reveal className="eyebrow mb-8 flex items-center gap-4 text-terracotta">
          <span className="h-px w-10 bg-terracotta" />
          {bond.eyebrow}
        </span>

        <h2 data-reveal className="display max-w-[18ch] text-[clamp(2.6rem,6.4vw,6.4rem)] leading-[0.95]">
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

        <div className="mt-14 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-6">
          {/* the film */}
          <div className="md:col-span-5">
            <div data-reveal="scale" className="md:sticky md:top-24">
              <div className="relative mx-auto w-[78vw] max-w-[400px] md:mx-0 md:w-full">
                <div className="absolute -right-3 -top-3 h-full w-full border border-champagne/40 md:-right-5 md:-top-5" />
                <div className="relative shadow-[0_50px_90px_-30px_rgba(0,0,0,0.85)]">
                  <Reel src={video.src} from={video.from} to={video.to} label={video.label} sound className="aspect-[9/16]" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent via-45% to-ink/10" />
                  <span className="eyebrow pointer-events-none absolute left-4 top-4 flex items-center gap-2 border border-ivory/30 bg-ink/50 px-3 py-2 text-[0.55rem]">
                    <span className="h-1.5 w-1.5 rounded-full bg-raviraj" />
                    {video.chip}
                  </span>
                  <p
                    lang="mr"
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 pr-20 font-marathi text-xl leading-snug text-ivory drop-shadow md:p-7 md:pr-24 md:text-2xl"
                  >
                    {video.titleMr}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* the words */}
          <div className="md:col-span-6 md:col-start-7">
            <p data-reveal className="display max-w-[26ch] text-[clamp(1.6rem,3vw,2.6rem)] italic text-champagne">
              {bond.closing}
            </p>

            <blockquote data-reveal className="mt-14 border-t border-ivory/15 pt-8 md:mt-20">
              <p className="font-serif text-xl italic leading-snug text-ivory/70 md:text-2xl">“{bond.quote}”</p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
