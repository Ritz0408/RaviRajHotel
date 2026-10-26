/**
 * All homepage copy, addresses and media paths.
 *
 * FACTS (from the client): name, tagline, Marathi wordmark (from the signage),
 * "Family Restaurant", Branch 01 and Branch 02 addresses.
 * Anything marked PLACEHOLDER is demo copy for the client to confirm or replace.
 */

/** Prefix public paths with the deploy base path (e.g. /hotel-raviraj on GitHub Pages). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

const photo = (file: string) => asset(`/images/raviraj/${file}`);

export type Media = { src: string; alt: string; position?: string };

export const media = {
  villageArch: {
    src: photo("village-arch.jpg"),
    alt: "The red arch of Hotel Raviraj framed by sculptures of a farmer and a woman carrying a basket",
    position: "50% 55%",
  },
  entranceArch: {
    src: photo("entrance-arch.jpg"),
    alt: "Hotel Raviraj entrance arch with white bullock sculptures and cricketer statues beyond",
    position: "50% 50%",
  },
  cricketLawn: {
    src: photo("cricket-lawn.jpg"),
    alt: "Cricketer statues on the lawn beneath the sign 'The Bonding of Brother's Love'",
    position: "50% 60%",
  },
  diningHall: {
    src: photo("dining-hall.jpg"),
    alt: "The Hotel Raviraj dining hall under a tiled roof with chandeliers and cricket photographs",
    position: "50% 50%",
  },
  // a sign-free crop of the hand-painted laterite wall
  redWalls: {
    src: photo("motif-door.jpg"),
    alt: "Red laterite wall with white hand-painted floral and zig-zag motifs beside an arched doorway",
    position: "24% 60%",
  },
} satisfies Record<string, Media>;

export const video = {
  src: asset("/videos/evenings.mp4"),
  // the packed dining hall at night (seconds within the reel)
  loopFrom: 4,
  loopTo: 11.5,
};

export const brand = {
  name: "Hotel Raviraj",
  marathi: "हॉटेल रविराज",
  tagline: "The Bonding of Brother's Love",
  kind: "Family Restaurant",
  kindMarathi: "फॅमिली रेस्टॉरंट",
};

export const nav = [
  { label: "Story", href: "#story" },
  { label: "Experience", href: "#experience" },
  { label: "Dining", href: "#dining" },
  { label: "Menu", href: "#menu" },
  { label: "Locations", href: "#locations" },
  { label: "Gallery", href: "#gallery" },
];

/**
 * Scroll-scrubbed cooking sequence (Kling AI video → 121 WebP frames, watermark cropped).
 * Scroll drives the frames: ingredients fall into the kadai → flame → finished Chicken Kadai.
 */
export const hero = {
  eyebrow: "Family Restaurant — Gadhinglaj · Ajra",
  // Two pre-sized sets: desktop (1280w, 61 frames) and phones (kadai-cropped 640w, 41 frames),
  // so a phone decodes ~40 MB of bitmaps instead of several hundred.
  frames: {
    desktop: {
      path: (i: number) => asset(`/frames/kadai-d/f${String(i).padStart(3, "0")}.webp`),
      count: 61,
    },
    mobile: {
      path: (i: number) => asset(`/frames/kadai-m/f${String(i).padStart(3, "0")}.webp`),
      count: 41,
    },
  },
  // PLACEHOLDER copy — client to confirm dish names and wording
  chapters: [
    {
      index: "01",
      label: "Raviraj Masala",
      lines: ["Kolhapuri spice,", "straight into", "the *kadai*."],
      copy: "Fresh chicken, dried red chillies, garlic, ginger and whole spices — the way Kolhapur cooks it.",
    },
    {
      index: "02",
      label: "Raviraj Kitchen",
      lines: ["Cooked on a", "*roaring* flame."],
      copy: "Iron kadai, high heat, no shortcuts. The masala catches, the chicken seals, the kitchen fills with smoke.",
    },
    {
      index: "03",
      label: "The Raviraj Table",
      lines: ["Hotel", "*Raviraj*."],
      marathi: "हॉटेल रविराज",
      copy: "Fiery Kolhapuri flavour, served sizzling to the table — and the bonding of brother's love in every plate.",
    },
  ],
};

/**
 * Pinned scroll timeline — four chapters, each with a short clip cut from the client's reels.
 * PLACEHOLDER copy (no dates invented) — client to confirm the family history and Marathi words.
 */
export const story = {
  eyebrow: "The Raviraj Story",
  chapters: [
    {
      label: "The Beginning",
      lines: ["Two brothers,", "*one* promise."],
      copy: "It started with a simple idea between brothers: a place on the road where every guest is welcomed like family.",
      marathi: "दोन भाऊ",
      stat: { value: 2, label: "Brothers" },
      video: asset("/videos/story/01-brothers.mp4"),
      poster: asset("/videos/story/01-brothers.webp"),
      alt: "Two of the Raviraj family in front of the Hotel Raviraj sign",
    },
    {
      label: "The Kitchen",
      lines: ["Cooked like", "it's *home*."],
      copy: "Real fire, iron kadais and recipes from our own homes — Kolhapuri spice, made fresh every day.",
      marathi: "घरची चव",
      video: asset("/videos/story/02-kitchen.mp4"),
      poster: asset("/videos/story/02-kitchen.webp"),
      alt: "A chicken masala cooking in a kadai over an open flame in the Raviraj kitchen",
    },
    {
      label: "The Family",
      lines: ["Every table,", "a *family*."],
      copy: "Long tables, full thalis and servers in Raviraj jerseys — evenings here are loud, warm and shared.",
      marathi: "आपली माणसं",
      video: asset("/videos/story/03-family.mp4"),
      poster: asset("/videos/story/03-family.webp"),
      alt: "Guests sharing a meal at long tables in the Raviraj dining hall",
    },
    {
      label: "Today",
      lines: ["Three homes,", "*one* bond."],
      copy: "From Gijawane to Ajra, and a third home on the way — the Raviraj family keeps growing.",
      marathi: "बंधुप्रेम",
      stat: { value: 3, label: "Locations" },
      video: asset("/videos/story/04-today.mp4"),
      poster: asset("/videos/story/04-today.webp"),
      alt: "Ribbon cutting at the opening of a new Hotel Raviraj",
    },
  ],
};

export const experience = {
  eyebrow: "The Raviraj Experience",
  title: ["Every corner", "tells a *story*."],
  items: [
    {
      index: "01",
      title: "The Arch",
      copy: "A red gateway framed by the people of the village — the farmer, the mother, the bullocks of the fields.",
      media: media.villageArch,
    },
    {
      index: "02",
      title: "The Hall",
      copy: "Chandeliers under a tiled roof, long tables, and the heroes of Indian cricket on every wall.",
      media: media.diningHall,
    },
    {
      index: "03",
      title: "The Walls",
      copy: "Laterite painted deep red, finished by hand with white floral motifs in the old Maharashtrian way.",
      media: media.redWalls,
    },
    {
      index: "04",
      title: "The Lawn",
      copy: "Green grass, potted palms and three batsmen mid-stroke — the most photographed corner of the house.",
      media: media.cricketLawn,
    },
  ],
};

export const brotherhood = {
  eyebrow: "The Bonding of Brother's Love",
  statement: "Where brotherhood becomes a tradition.",
  // revealed word by word as the visitor scrolls
  passage:
    "Cricket was never just a game here. It was evenings on the maidan, arguments over the last over, and brothers who always had each other's back. Hotel Raviraj keeps that spirit at the table — a place for friends who feel like family, and family who are your closest friends.",
  pillars: ["Friendship", "Family", "Togetherness", "Shared memories"],
  image: media.cricketLawn,
};

/** PLACEHOLDER storytelling — poetic, no dates or facts invented; client to confirm the family's own words. */
export const bond = {
  eyebrow: "The Bond",
  title: ["Before the restaurant,", "there was a *brother*."],
  marathi: "भावाचं प्रेम",
  beats: [
    "Long before the first table was laid, there were two brothers, a bat and a stretch of open ground.",
    "One would bowl. The other would bat. Neither ever kept count of who carried whom.",
    "When the light went, they walked home the same way, sharing whatever was left of the day.",
  ],
  closing: "Hotel Raviraj is that walk home — made into a place.",
  quote: "A brother is the one who stays at the other end of the pitch.",
};

export const cricket = {
  eyebrow: "The Innings",
  title: ["Cricket runs in", "the *blood*."],
  copy: "From the photographs in the dining hall to the batsmen frozen mid-stroke on the lawn, the game is everywhere at Raviraj — because it is where the brothers grew up.",
  moments: [
    { title: "Evenings on the maidan", note: "Golden hour, one bat, far too many fielders.", icon: "sun" },
    { title: "The last over", note: "Six to win. Nobody breathing. Everybody shouting.", icon: "ball" },
    { title: "Two at the crease", note: "A partnership is just trust at running speed.", icon: "stumps" },
    { title: "The team dinner", note: "Every match ends at a long, loud table.", icon: "plate" },
  ],
  scoreboard: [
    { label: "Brothers", value: "2" },
    { label: "Locations", value: "3" },
    { label: "Overs", value: "∞" },
  ],
  result: "Result: a full house, every evening.",
  image: media.cricketLawn,
};

export const cinema = {
  eyebrow: "Evenings at Raviraj",
  words: ["EVENINGS", "AT RAVIRAJ"],
  copy: "When the sun goes down, the hall fills up — families, friends and old regulars, all under one tiled roof.",
  poster: media.diningHall,
};

export const dining = {
  eyebrow: "Dining",
  title: ["Come hungry,", "leave as *family*."],
  // PLACEHOLDER — client to confirm menu highlights
  copy: "A family restaurant in the truest sense: big tables, generous plates and the flavours of Kolhapur and the Konkan, served under chandeliers and a tiled roof. Every evening the hall fills with families, friends and old regulars.",
  highlights: [
    { name: "Family Dining", note: "Long tables · All ages welcome" },
    { name: "Regional Flavours", note: "Kolhapuri & Malvani kitchens" },
    { name: "Celebrations", note: "Birthdays · Team dinners · Gatherings" },
  ],
  image: media.diningHall,
};

/**
 * Menu highlights, read from the restaurant's menu photographs on Google.
 * PLACEHOLDER — prices intentionally left out and the list is partial; client to supply the full menu.
 * `v: true` = vegetarian.
 */
export const menu = {
  eyebrow: "The Menu",
  title: ["Something for", "every *table*."],
  copy: "Thalis for the hungry, biryani for the loyal, Chinese for the kids — a big menu that suits a big family.",
  // Short reels. `to` stops each one before its end card (a studio / restaurant logo) so it is never shown.
  reels: [
    { src: asset("/videos/reels/r1.mp4"), from: 0, to: 14.2, kicker: "Fire & spice", title: "Sizzle", em: "& spice." },
    { src: asset("/videos/reels/r2.mp4"), from: 0, to: 23, kicker: "From the pan", title: "Rich, hot,", em: "all yours." },
    { src: asset("/videos/reels/r3.mp4"), from: 0, to: 26.6, kicker: "Every evening", title: "Housefull,", em: "always." },
  ],
  facts: { rating: "4.3", reviews: "594", price: "₹200–400", tags: "Family-friendly" },
  signature: {
    name: "Chicken Kadai",
    note: "Iron kadai, high flame, served sizzling — the dish from our opening reel.",
    image: asset("/frames/kadai-d/f061.webp"),
  },
  categories: [
    {
      id: "thali",
      label: "Thalis",
      items: [
        { name: "Raviraj Brother's Thali", note: "The house special, made to share", star: true },
        { name: "Raviraj Special Mutton Thali" },
        { name: "Mutton Khanda Thali" },
        { name: "Mutton Pav Thali" },
      ],
    },
    {
      id: "biryani",
      label: "Biryani",
      items: [
        { name: "Chicken Biryani" },
        { name: "Chicken Hyderabadi Biryani" },
        { name: "Mutton Biryani" },
        { name: "Egg Biryani" },
        { name: "Veg Biryani", v: true },
      ],
    },
    {
      id: "main",
      label: "Main Course",
      items: [
        { name: "Chicken Kadai", star: true },
        { name: "Paneer Butter Masala", v: true },
        { name: "Paneer Kadhai", v: true },
        { name: "Paneer Handi", v: true },
        { name: "Kaju Masala", v: true },
      ],
    },
    {
      id: "chinese",
      label: "Rice & Noodles",
      items: [
        { name: "Veg Fried Rice", v: true },
        { name: "Veg Schezwan Rice", v: true },
        { name: "Chicken Fried Rice" },
        { name: "Chicken Schezwan Rice" },
        { name: "Chicken Hakka Noodles" },
        { name: "Egg Fried Rice" },
      ],
    },
    {
      id: "soup",
      label: "Soups",
      items: [
        { name: "Veg Manchow Soup", v: true },
        { name: "Chicken Manchow Soup" },
      ],
    },
  ],
};

export const marquee = ["Family", "Brotherhood", "Flavour", "Tradition", "Togetherness", "Celebration"];

export const locations = [
  {
    id: "gadhinglaj",
    index: "01",
    place: "Gijawane",
    town: "Gadhinglaj",
    address: ["Gijawane, Gadhinglaj", "Maharashtra 416502"],
    copy: "Red arches, cricket on the lawn and a hall that fills up every evening.",
    media: media.entranceArch, // client to confirm which photograph belongs to which branch
    maps: "https://www.google.com/maps/search/?api=1&query=Hotel+Raviraj+Gijawane+Gadhinglaj+416502",
    comingSoon: false,
  },
  {
    id: "ajra",
    index: "02",
    place: "Ajra",
    town: "Madilage",
    address: ["Ajra, Madilage", "Maharashtra 416505"],
    copy: "The same welcome, the same table, the same bond — on the road to Ajra.",
    media: media.villageArch, // client to confirm which photograph belongs to which branch
    maps: "https://www.google.com/maps/search/?api=1&query=Hotel+Raviraj+Ajra+Madilage+416505",
    comingSoon: false,
  },
  {
    id: "coming-soon",
    index: "03",
    place: "Coming",
    town: "Soon",
    address: ["The third Raviraj", "Details to be announced"],
    copy: "A new home for the family is on its way.",
    media: media.redWalls,
    maps: null,
    comingSoon: true,
  },
];

export const gallery: (Media & { caption: string; span: string; aspect: string; offset?: string; speed: number })[] = [
  { ...media.villageArch, caption: "The village arch", span: "md:col-span-7", aspect: "aspect-[16/10]", speed: 0.05 },
  { ...media.redWalls, caption: "Hand-painted laterite", span: "md:col-span-4 md:col-start-9", aspect: "aspect-[4/5]", offset: "md:mt-40", speed: 0.18 },
  { ...media.diningHall, caption: "The dining hall", span: "md:col-span-5 md:col-start-2", aspect: "aspect-[4/5]", offset: "md:-mt-24", speed: 0.12 },
  { ...media.cricketLawn, caption: "The cricket lawn", span: "md:col-span-6 md:col-start-7", aspect: "aspect-[16/11]", offset: "md:mt-24", speed: 0.06 },
  { ...media.entranceArch, caption: "The Raviraj gate", span: "md:col-span-8 md:col-start-3", aspect: "aspect-[2/1]", offset: "md:mt-10", speed: 0.1 },
];

export const culture = {
  eyebrow: "Culture & Character",
  title: ["Rooted in", "*Maharashtra*."],
  copy: "Nothing here was borrowed from a catalogue. The colours come from laterite and Mangalore tile; the motifs are painted by hand; the sculptures are the people of our own villages. Hotel Raviraj is what happens when a family builds the place it grew up in.",
  details: [
    { term: "Laterite red", text: "The earth of the Konkan and Kolhapur, on every wall." },
    { term: "Mangalore tile", text: "Sloping terracotta roofs that keep the halls cool." },
    { term: "Hand-painted motifs", text: "White florals and zig-zags, renewed by hand." },
    { term: "Village sculptures", text: "Farmers, bullocks and mothers of the land at the gate." },
  ],
  image: media.villageArch,
  detail: media.redWalls,
};

// PLACEHOLDER testimonials — replace with real guest reviews before launch
export const testimonials = [
  {
    quote: "We came for one dinner and now it is where every family celebration happens.",
    name: "A family from Gadhinglaj",
  },
  {
    quote: "The cricket statues brought the kids in. The food brought us back every week.",
    name: "Regular guest, Ajra",
  },
  {
    quote: "It feels like eating at a relative's house — if your relative had chandeliers.",
    name: "Weekend traveller, Kolhapur",
  },
];

export const visit = {
  eyebrow: "Visit Us",
  title: ["Your table", "is *waiting*."],
  copy: "Bring the family, bring your brothers, bring the whole team. There is always room at Raviraj.",
  image: media.entranceArch,
};
