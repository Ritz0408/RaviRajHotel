# Hotel Raviraj — Digital Identity & Homepage Plan

> *The Bonding of Brother's Love*
> A premium, cinematic re-imagining of the real Hotel Raviraj — not a generic five-star template.
> Everything a visitor sees should still feel like **our** Hotel Raviraj: red terracotta walls,
> Maharashtrian character, tiled roofs, courtyards, family tables, cricket and brotherhood.

---

## 1 · Project architecture

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 App Router + TypeScript | Image + font optimisation, fast static homepage |
| Styling | Tailwind CSS v4, tokens in `src/app/globals.css` (`@theme`) | One source of truth for colour/type |
| Motion | Framer Motion | Text masks, clip-path reveals, location transitions |
| Scroll choreography | GSAP ScrollTrigger (only where scrubbing/pinning is needed) | Brotherhood section pin, gallery drift |
| Smooth scroll | Lenis, synced to the GSAP ticker; disabled for reduced motion | Slow, weighted, hospitable pace |
| WebGL | `three` (raw, one quad) — **hero only** | The single ThreeUI interaction; no R3F needed |

```
src/
  app/            layout.tsx (fonts, metadata) · page.tsx (section order) · globals.css (tokens)
  lib/            content.ts (ALL copy, addresses, photo paths) · motion.ts (eases, helpers)
  components/
    providers/    SmoothScroll (Lenis + GSAP)
    ui/           RevealLines (masked type) · RevealImage (clip-path + parallax)
    nav/          Nav
    hero/         Hero · LamplightHero (WebGL) · lamplightShader
    sections/     Story · Experience · Brotherhood · Dining · Locations · Gallery · Culture · Testimonials · Visit · Footer
public/images/raviraj/   the real Hotel Raviraj photographs
```

## 2 · Visual direction

**"Dusk at Raviraj."** The hour when the terracotta walls glow, the lamps come on in the courtyard
and the family tables fill. Dark, warm, lamplit — the red is the *architecture*, never a UI accent.

- Photography first: full-bleed, cinematic crops, deep shadows, warm highlights. Grading is gentle
  (slight warm lift + soft vignette) — the hotel must still look real.
- Editorial composition: a 12-column grid deliberately broken; large serif type as an image in its own right;
  hairline rules instead of boxes. No rounded cards, no glassmorphism, no gradients except photo scrims.
- Cultural detail, used sparingly: the Marathi wordmark **हॉटेल रविराज** as a quiet signature,
  and a fine geometric border motif drawn from traditional Maharashtrian patterning as section dividers.

## 3 · Colour system

| Token | Hex | Role |
|---|---|---|
| `ink` | `#0e0807` | Near black — night, base ground |
| `ink-2` | `#170d0b` | Raised dark surface |
| `burgundy-900` | `#230b0b` | Dark burgundy sections |
| `burgundy` | `#3f1012` | Dark burgundy — Locations ground |
| `raviraj` | `#8c211d` | **Deep Raviraj Red** — the walls; hover fills, key hairlines |
| `terracotta` | `#b0562f` | Terracotta — roof-tile warmth; numerals, small accents |
| `ivory` | `#f3ebdf` | Warm ivory — type on dark, light sections |
| `offwhite` | `#faf6ef` | Off white — the brightest light ground |
| `sand` | `#c9b496` | Muted sand — secondary text, captions |
| `champagne` | `#c4a573` | Very subtle — one hairline at most per screen |

Section rhythm (dark/light gives an editorial pulse):
Hero (photo) → Story (**ivory**) → Experience (ink) → Brotherhood (burgundy-900) → Dining (ink) →
Locations (**burgundy**) → Gallery (ink) → Culture (**offwhite**) → Testimonials (ink) → Visit (photo) → Footer (ink).

## 4 · Typography

- **Display — Cormorant Garamond** (300/400/500 + italic). High-contrast editorial serif for
  headlines; italic for one emotive word per line ("*brother's love*", "*tradition*").
- **UI / body — Manrope** (300–600). Navigation, labels, buttons, descriptions.
- **Cultural accent — Tiro Devanagari Marathi.** Only for the Marathi wordmark and one or two
  short Marathi words. *(Marathi copy to be confirmed by the client.)*
- Scale: hero wordmark `clamp(3.5rem, 11vw, 12rem)`; section titles `clamp(2.6rem, 6vw, 6.5rem)`;
  eyebrow 11px uppercase / 0.32em tracking; body 15–17px / 1.7, max ~40ch.

## 5 · Animation language

Slow, warm, intentional. Ease `cubic-bezier(0.22, 1, 0.36, 1)`, 1.1–1.6 s.

| Device | Used for |
|---|---|
| Masked line reveal, staggered 110 ms | Every headline |
| Clip-path wipe + 1.15 → 1 photo settle | Section photography, gallery |
| Scrubbed parallax (≤ 10 %) | Story, Experience, Dining, Visit |
| Pinned scrub | Brotherhood story (desktop) |
| Clip wipe + numeral/type swap | Locations |
| Nav hides on scroll-down, returns on scroll-up | Global |

Nothing loops except the hero's slow light drift and the scroll cue. Nothing bounces.
**Reduced motion:** Lenis off, WebGL off (static graded photo), reveals become opacity fades, pins released.

## 6a · CURRENT HERO — scroll-cooked Chicken Kadai (replaces Lamplight)

The one WOW moment is now a scroll-scrubbed cooking film (`components/hero/Hero.tsx`):
- Source: ChatGPT start/end frames (red laterite wall + white motifs, black iron kadai) → Kling AI 3.0,
  5 s, 1916×1080, locked camera. Original kept in `media-source/hero-kadai.mp4` (not served).
- 121 WebP frames, 1600 px, bottom 8 % cropped to remove the Kling watermark → `public/frames/kadai/` (~9 MB);
  phones load every 2nd frame (~4.6 MB). Frames stream in 6 parallel batches; the first frame is the LCP image.
- Section is 420 vh (340 vh mobile) with a sticky canvas; scroll 0–86 % drives frames, the rest holds the dish.
- Chapters: brand → 01 The Masala (ingredients fall) → 02 The Fire (flame) → 03 Chicken Kadai (+ CTAs).
- Layout switches on aspect ratio (`wide:` = ≥ 13/10 and ≥ 768 px): copy left of the kadai on wide screens,
  copy above a bottom-anchored kadai on phones/tablets/square windows.
- Reduced motion: no pin, static finished-dish frame with the brand copy.
- `three` was removed from dependencies.

## 6 · (Superseded) ThreeUI interaction — "Lamplight"

ThreeUI categories reviewed: **Hero, Background, Three.js, Text Animation, UI Elements, CSS.**
Most are futuristic (globes, CRTs, point-cloud busts, portals, particle vortexes, neon) — rejected per brief.
The fit is ThreeUI's **image-shader / fluid-distortion backgrounds** (Fluid Field, Liquid Form family):
a shader that *treats the photograph*, rather than adding an object.

**Lamplight** (`components/hero/LamplightHero.tsx`) — one full-screen quad over the real Raviraj photographs
(village arch → Raviraj gate → cricket lawn):

1. **Entrance (the WOW):** the page opens in darkness. Warm light blooms outward from the centre with a soft,
   organic edge — like the hotel's evening lamps being lit.
2. **Liquid dissolve:** every ~7 s the photograph melts into the next through a noise-driven wipe that rises
   from the ground, with a glowing laterite-red front. Slow push-in on each photo.
3. **Dusk grade:** the overcast daylight photos are gently graded towards dusk (sky sinks, reds warm up)
   and finished with film grain, which also hides the softness of the ~1250 px source photos.
4. **Cursor:** a pool of warm lamplight + a barely-there lens follows the pointer (drifts on its own on touch).
5. **Scroll:** the hero dims into the Story section.

### Photography notes
- Supplied photos are ~1250 px wide; converted to quality-90 JPGs (~200 KB) in `public/images/raviraj`.
- The permit-room signage is never shown: `motif-door.jpg` is a sign-free crop of the hand-painted wall.
- The phone reel (`public/videos/evenings.mp4`) is used framed, not full-bleed, looping the packed
  dining-hall segment (4 s–11.5 s), and only loads/plays when near the viewport.
- **Better source photography (dusk, 3000 px+, landscape video) would lift the whole site further.**

Guarantees: shader sits *behind* a CSS scrim and all text; text appears only after the light has bloomed.
Perf: DPR ≤ 1.5 (1 on touch), renders only while visible, no cursor effect on touch (light drifts on its own),
static fallback if WebGL is missing or reduced motion is on. No other ThreeUI effects anywhere.

## 7 · Homepage structure

| # | Section | Composition | Motion |
|---|---|---|---|
| 01 | Hero | Strongest façade photo, HOTEL RAVIRAJ wordmark + Marathi signature, "The Bonding of Brother's Love", CTAs EXPLORE HOTEL / OUR LOCATIONS, scroll cue | Lamplight |
| 02 | The Raviraj Story | Ivory ground, large serif statement, offset portrait photo, family/heritage copy | Masked lines, parallax |
| 03 | The Raviraj Experience | Courtyard, greenery, rooms, lighting — asymmetric editorial grid | Clip reveals |
| 04 | Brotherhood | "Where brotherhood becomes a tradition." Cricket sculptures as cinematic still-lifes, words on friendship/family | Pinned scrub (desktop) |
| 05 | Dining | Family-restaurant atmosphere, overlapping photos + copy | Two-speed parallax |
| 06 | Discover Our Locations | One dominant photo stage + numbered list: 01 Gijawane·Gadhinglaj, 02 Ajra·Madilage, 03 Coming soon | Clip wipe, numeral + type swap; swipe on mobile |
| 07 | Gallery | Asymmetric, overlapping mosaic of real photos | Staggered reveals, slow drift |
| 08 | Culture & Character | Patterns, tiled roofs, Maharashtrian detail — off-white editorial spread | Masked lines |
| 09 | Testimonials | One large quote at a time | Crossfade |
| 10 | Visit / Booking | Full-bleed dusk photo, "Your table is waiting." CTA + both addresses | Scale on scroll |
| 11 | Footer | Wordmark, branch addresses, minimal links | — |

**Facts used:** name, tagline, Branch 01 (Gijawane, Gadhinglaj, Maharashtra 416502) and Branch 02
(Ajra, Madilage, Maharashtra 416505). Branch 03 shows **Coming soon** only. Story copy and testimonials
are clearly marked placeholders in `content.ts` for the client to replace.
