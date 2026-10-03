"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealLines from "@/components/ui/RevealLines";
import RevealImage from "@/components/ui/RevealImage";
import SectionLabel from "@/components/ui/SectionLabel";
import { experience } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Desktop: the section pins and the four moments travel horizontally, each
 * photograph drifting inside its frame. Mobile / reduced motion: an
 * editorial vertical stack.
 */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      track.querySelectorAll<HTMLElement>("[data-drift]").forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
      track.querySelectorAll<HTMLElement>("[data-panel-copy]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, containerAnimation: tween, start: "left 85%" },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="relative overflow-hidden bg-ink text-ivory">
      {/* Desktop horizontal track */}
      <div className="hidden h-screen lg:block">
        <div ref={trackRef} className="flex h-full w-max items-center gap-[6vw] pl-10 pr-[10vw] will-change-transform">
          <div className="flex h-full w-[38vw] shrink-0 flex-col justify-center pr-[2vw]">
            <SectionLabel index="03" label={experience.eyebrow} className="mb-12 text-sand" />
            <RevealLines
              lines={experience.title}
              className="display text-[clamp(3rem,6vw,7rem)] text-ivory"
            />
            <p className="mt-10 flex items-center gap-4 text-sm text-sand/70">
              <span className="h-px w-10 bg-terracotta" /> Scroll to walk through the house
            </p>
          </div>

          {experience.items.map((item, i) => (
            <article
              key={item.index}
              className={`flex shrink-0 gap-8 ${i % 2 ? "flex-col-reverse self-start pt-[9vh]" : "flex-col self-end pb-[9vh]"}`}
            >
              <div
                className={`relative overflow-hidden bg-ink-2 ${i % 2 ? "h-[52vh] w-[34vw]" : "h-[62vh] w-[44vw]"}`}
                data-cursor="View"
              >
                <div data-drift className="absolute inset-y-0 -left-[10%] -right-[10%]">
                  <Image
                    src={item.media.src}
                    alt={item.media.alt}
                    fill
                    sizes="50vw"
                    loading="eager"
                    style={{ objectPosition: item.media.position }}
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                <span className="display absolute bottom-4 left-6 text-[7rem] leading-none text-ivory/90">
                  {item.index}
                </span>
              </div>
              <div data-panel-copy className="flex max-w-[30rem] items-start gap-8">
                <h3 className="display shrink-0 text-5xl text-ivory">{item.title}</h3>
                <p className="pt-2 text-[0.95rem] leading-[1.75] text-sand/85">{item.copy}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="absolute inset-x-10 bottom-8 h-px bg-ivory/10">
          <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-terracotta" />
        </div>
      </div>

      {/* Mobile / tablet editorial stack */}
      <div className="px-5 py-24 md:px-10 lg:hidden">
        <SectionLabel index="03" label={experience.eyebrow} className="mb-12 text-sand" />
        <RevealLines lines={experience.title} className="display mb-16 text-[clamp(2.75rem,11vw,5rem)]" />
        <div className="flex flex-col gap-20">
          {experience.items.map((item, i) => (
            <article key={item.index} className={i % 2 ? "pl-10 md:pl-32" : "pr-10 md:pr-32"}>
              <div className="relative">
                <RevealImage
                  src={item.media.src}
                  alt={item.media.alt}
                  position={item.media.position}
                  sizes="90vw"
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
