"use client";

import { useState } from "react";
import Reel from "@/components/ui/Reel";
import { menu } from "@/lib/content";
import { splitEmphasis } from "@/lib/motion";

/** Indian veg / non-veg food mark. */
function Mark({ veg }: { veg?: boolean }) {
  const c = veg ? "#3f9b4f" : "#b3261e";
  return (
    <span aria-label={veg ? "Vegetarian" : "Non-vegetarian"} className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center border" style={{ borderColor: c }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
    </span>
  );
}

export default function Menu() {
  const [active, setActive] = useState(menu.categories[0].id);
  const cat = menu.categories.find((c) => c.id === active) ?? menu.categories[0];

  return (
    <section id="menu" className="relative overflow-hidden bg-offwhite py-24 text-ink md:py-40" aria-label={menu.eyebrow}>
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="grid gap-10 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-7">
            <span data-reveal className="eyebrow mb-8 flex items-center gap-4 text-raviraj">
              <span className="h-px w-10 bg-raviraj" />
              {menu.eyebrow}
            </span>
            <h2 data-reveal className="display text-[clamp(2.9rem,7.5vw,8rem)] text-burgundy">
              {menu.title.map((line, i) => (
                <span key={i} className="block">
                  {splitEmphasis(line).map((p, j) =>
                    p.em ? (
                      <em key={j} className="font-serif italic font-light text-raviraj">
                        {p.text}
                      </em>
                    ) : (
                      <span key={j}>{p.text}</span>
                    ),
                  )}
                </span>
              ))}
            </h2>
          </div>

          <div data-reveal className="flex flex-col justify-end gap-6 md:col-span-4 md:col-start-9">
            <p className="leading-[1.85] text-ink/70">{menu.copy}</p>
            <dl className="grid grid-cols-3 divide-x divide-ink/15 border-y border-ink/15 py-4 text-center">
              <div>
                <dt className="eyebrow text-[0.52rem] text-ink/50">Rated</dt>
                <dd className="display mt-1 text-2xl text-burgundy">
                  {menu.facts.rating} <span className="text-base text-terracotta">★</span>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-[0.52rem] text-ink/50">Reviews</dt>
                <dd className="display mt-1 text-2xl text-burgundy">{menu.facts.reviews}</dd>
              </div>
              <div>
                <dt className="eyebrow text-[0.52rem] text-ink/50">Per person</dt>
                <dd className="display mt-1 text-2xl text-burgundy">{menu.facts.price}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* reels: swipe on a phone, three across on desktop */}
        <div className="-mx-5 mt-12 md:mx-0 md:mt-20">
          <div
            data-lenis-prevent
            className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0"
          >
            {menu.reels.map((r, i) => (
              <figure
                key={r.src}
                data-reveal
                style={{ "--d": `${i * 0.1}s` } as React.CSSProperties}
                className={`relative w-[70vw] max-w-[340px] shrink-0 snap-center shadow-[0_30px_60px_-30px_rgba(63,16,18,0.55)] md:w-auto md:max-w-none ${
                  i === 1 ? "md:mt-14" : ""
                }`}
              >
                <Reel src={r.src} from={r.from} to={r.to} label={`${r.title} ${r.em}`} className="aspect-[3/4.4]" />
                <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-ink/85 via-transparent to-ink/20" />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-5 text-ivory md:p-7">
                  <span className="eyebrow flex items-center gap-3 text-[0.58rem] text-champagne">
                    <span className="tabular-nums text-terracotta">0{i + 1}</span>
                    {r.kicker}
                  </span>
                  <span className="display mt-3 block text-3xl leading-[1.02] md:text-4xl">
                    {r.title} <em className="font-serif font-light italic text-sand">{r.em}</em>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* category chips */}
        <div data-reveal className="-mx-5 mt-16 md:mx-0 md:mt-28">
          <p className="eyebrow mb-5 flex items-center gap-4 px-5 text-[0.6rem] text-ink/50 md:px-0">
            <span className="h-px w-8 bg-ink/25" /> Pick a course
          </p>
          <div role="tablist" aria-label="Menu categories" className="scrollbar-none flex snap-x gap-2 overflow-x-auto px-5 pb-1 md:flex-wrap md:px-0">
            {menu.categories.map((c) => {
              const on = c.id === active;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(c.id)}
                  className={`eyebrow shrink-0 snap-start whitespace-nowrap rounded-full border px-5 py-3 text-[0.62rem] transition-colors duration-300 ${
                    on ? "border-raviraj bg-raviraj text-ivory" : "border-ink/20 text-ink/70 active:bg-ink/5 md:hover:border-ink/50"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12 md:gap-6">
          {/* dishes */}
          <ul key={cat.id} role="tabpanel" className="menu-in md:col-span-7">
            {cat.items.map((it, i) => (
              <li
                key={it.name}
                style={{ animationDelay: `${i * 60}ms` }}
                className="menu-item flex items-center gap-4 border-b border-ink/12 py-5 md:py-6"
              >
                <Mark veg={"v" in it ? it.v : false} />
                <span className="display min-w-0 flex-1 text-[1.6rem] leading-tight text-burgundy md:text-4xl">
                  {it.name}
                  {"note" in it && it.note && (
                    <span className="mt-1 block font-sans text-[0.82rem] font-normal tracking-normal text-ink/55">{it.note}</span>
                  )}
                </span>
                {"star" in it && it.star && (
                  <span className="eyebrow shrink-0 rounded-full bg-terracotta/15 px-3 py-1 text-[0.5rem] text-terracotta">Signature</span>
                )}
              </li>
            ))}
          </ul>

          {/* signature card */}
          <div data-reveal="right" className="relative min-h-[22rem] overflow-hidden bg-ink md:col-span-5 md:min-h-[30rem]">
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized frame from the hero sequence */}
            <img src={menu.signature.image} alt="Chicken Kadai sizzling in a black iron kadai" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[80%_50%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-ivory md:p-9">
              <span className="eyebrow text-[0.6rem] text-champagne">House signature</span>
              <h3 className="display mt-3 text-4xl md:text-5xl">{menu.signature.name}</h3>
              <p className="mt-3 max-w-[32ch] text-[0.95rem] leading-[1.7] text-ivory/75">{menu.signature.note}</p>
            </div>
          </div>
        </div>

        <p data-reveal className="mt-10 text-sm text-ink/55 md:mt-14">
          A selection from our menu — ask at the table for the full list and today&apos;s specials. {menu.facts.tags}.
        </p>
      </div>
    </section>
  );
}
