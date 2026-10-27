"use client";

import RevealLines from "@/components/ui/RevealLines";
import RevealImage from "@/components/ui/RevealImage";
import SectionLabel from "@/components/ui/SectionLabel";
import { gallery } from "@/lib/content";

export default function Gallery() {
  return (
    <section id="gallery" className="relative overflow-hidden bg-ink py-28 text-ivory md:py-44">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <SectionLabel index="06" label="Gallery" className="mb-12 text-sand" />
        <div className="mb-16 grid gap-8 md:mb-28 md:grid-cols-12">
          <RevealLines
            lines={["Moments", "at *Raviraj*."]}
            className="display text-[clamp(2.9rem,8vw,8.5rem)] md:col-span-8"
          />
          <p className="self-end leading-[1.8] text-sand/75 md:col-span-3 md:col-start-10">
            Red walls, tiled roofs, painted motifs and the people who make it home.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-y-8 md:gap-x-6">
          {gallery.map((g, i) => (
            <figure
              key={g.src}
              className={`col-span-12 ${g.span} ${g.offset ?? ""} ${i % 2 ? "pl-10 md:pl-0" : "pr-10 md:pr-0"}`}
              data-cursor="View"
            >
              <RevealImage
                src={g.src}
                alt={g.alt}
                position={g.position}
                sizes="(min-width: 768px) 60vw, 100vw"
                parallax={g.speed}
                from={i % 2 ? "top" : "bottom"}
                className={`${g.aspect} w-full`}
              />
              <figcaption className="eyebrow mt-4 flex items-center gap-3 text-[0.6rem] text-sand/60">
                <span className="tabular-nums text-terracotta">{String(i + 1).padStart(2, "0")}</span>
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
