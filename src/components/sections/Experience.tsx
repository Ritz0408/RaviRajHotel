"use client";

import RevealLines from "@/components/ui/RevealLines";
import RevealImage from "@/components/ui/RevealImage";
import SectionLabel from "@/components/ui/SectionLabel";
import { experience } from "@/lib/content";

/** The four moments as an editorial stack (two columns on desktop) — no pinning, one scroll. */
export default function Experience() {
  return (
    <section id="experience" className="relative overflow-hidden bg-ink text-ivory">
      <div className="mx-auto max-w-[1680px] px-5 py-24 md:px-10 md:py-36">
        <SectionLabel index="03" label={experience.eyebrow} className="mb-12 text-sand" />
        <RevealLines lines={experience.title} className="display mb-16 text-[clamp(2.75rem,11vw,5rem)]" />
        <div className="flex flex-col gap-20 lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-28">
          {experience.items.map((item, i) => (
            <article key={item.index} className={i % 2 ? "pl-10 md:pl-32" : "pr-10 md:pr-32"}>
              <div className="relative">
                <RevealImage
                  src={item.media.src}
                  alt={item.media.alt}
                  position={item.media.position}
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  from={i % 2 ? "right" : "left"}
                  className="aspect-[4/5] w-full md:aspect-[16/11]"
                />
                <span className="display pointer-events-none absolute -top-10 left-3 text-7xl text-ivory/90">
                  {item.index}
                </span>
              </div>
              <h3 className="display mt-6 text-4xl">{item.title}</h3>
              <p className="mt-3 max-w-[38ch] leading-[1.75] text-sand/85">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
