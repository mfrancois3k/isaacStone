/**
 * Single source of truth for site content.
 *
 * Provenance matters here — this is a real business. Everything below is either
 * recovered verbatim from the client's own former site (jafettile.com, Wayback
 * crawl 2025-07-11), taken from their public Angi listing, or clearly marked as
 * a placeholder awaiting client sign-off. Do not invent project names, view
 * counts, or testimonials.
 */

export const BUSINESS = {
  name: 'Isaac Stone and Tile',
  legalName: 'Isaac Stone and Tile LLC',
  tagline: 'Tile · Granite · Marble',
  established: 2000,
  city: 'Brentwood',
  state: 'New York',
  phone: '(631) 530-5883',
  phoneHref: 'tel:+16315305883',
  ownerName: 'Jonathan',
  ownerRole: 'Owner & lead installer',
  ownerPhone: '(347) 622-8386',
  ownerPhoneHref: 'tel:+13476228386',
  email: 'jafet.tile@gmail.com',
  hours: 'Monday to Saturday, 7:00 AM – 6:30 PM',
  hoursShort: 'MON–SAT 7:00–18:30',
  areas: 'Brentwood, NY · Suffolk · Nassau · NYC · the Hamptons · South Florida',
  instagram: 'https://www.instagram.com/jafettile____com/',
  instagramHandle: '@JAFETTILE____COM',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Brentwood%2C+NY',
  angiUrl:
    'https://www.angi.com/companylist/us/ny/highland-mills/jafet-home-improvement-reviews-1.htm',
} as const;

export const HERO = {
  eyebrow: 'EST. 2000 · BRENTWOOD, NEW YORK · TILE, GRANITE & MARBLE',
  headline: ['Set in', 'stone.'],
  body:
    'Marble, granite and tile across Long Island, New York City, and Florida. ' +
    'Twenty-five years, one crew, and a phone that gets answered by the person who does the work.',
  primaryCta: 'Get a free estimate',
  badges: ['NY & FL', 'FREE ON-SITE VISIT', 'NO OBLIGATION', 'SAME-DAY REPLY'],
} as const;

/**
 * The hero image is a RENDER, not one of the client's jobs. This caption says so
 * on the page. Do not remove it — the disclosure is the point.
 */
export const HERO_RENDER = {
  eyebrow: 'DESIGN REFERENCE · TRAVERTINE',
  title: 'The finish we work toward',
  noteLead: 'Rendering. Real jobs are in ',
  noteLinkText: 'Our work',
  noteTail: ' below.',
  imageAlt:
    'Rendered living room with a travertine fireplace surround — a design reference, not a completed job',
} as const;

/** Intro sequence copy. */
export const LOADER = {
  headline: 'Tiles Tailored to Your Home',
  meta: 'ISAAC STONE AND TILE · BRENTWOOD, NY',
} as const;

/** Rendered reference images. Labelled as renders on the page — they are not jobs. */
export const RENDERS = {
  hero: '/assets/isaacstone/render-living-travertine.jpg',
  kitchen: '/assets/isaacstone/render-kitchen-calacatta.jpg',
  bath: '/assets/isaacstone/render-bath-bookmatch.jpg',
  samples: '/assets/isaacstone/render-samples.jpg',
  patio: '/assets/isaacstone/render-patio.jpg',
  living: '/assets/isaacstone/render-living-travertine.jpg',
  crewOnSite: '/assets/isaacstone/render-crew-onsite.jpg',
} as const;

export const MARQUEE_ITEMS = [
  'TILE INSTALLATION',
  'GRANITE COUNTERTOPS',
  'MARBLE BATHROOMS',
  'SUPERSTRUCTURE & FOUNDATION',
  'BRENTWOOD',
  'NASSAU COUNTY',
  'SUFFOLK COUNTY',
  'THE HAMPTONS',
  'NEW YORK CITY',
  'SOUTH FLORIDA',
  'MON–SAT 7:00–18:30',
];

export const FIRM = {
  label: '[ 00 // THE FIRM ]',
  statement:
    'Twenty-five years of tile, granite and marble across Long Island — installed by the same hands that measured it.',
  stats: [
    { key: 'EXPERIENCE', value: 25, suffix: '+ years', decimals: 0 },
    { key: 'RATING', value: 5, suffix: 'on Angi', decimals: 1 },
    { key: 'TERRITORY', text: 'NY & Florida' },
    { key: 'LICENSED & INSURED', text: 'New York · Florida' },
  ],
} as const;

export interface Service {
  number: string;
  title: string;
  /** Recovered verbatim from the client's archived homepage. */
  blurb: string;
  points: string[];
  image: string;
  imageAlt: string;
}

export const SERVICES: Service[] = [
  {
    number: '01',
    title: 'Tile Installation',
    blurb: 'Our team offers exquisite solutions on tile installation.',
    points: ['Experienced staff', 'Quality materials', 'Detailing finishes'],
    image: RENDERS.crewOnSite,
    imageAlt: 'Tile crew setting a large-format floor',
  },
  {
    number: '02',
    title: 'Granite Installation',
    blurb:
      'We can renovate any part of your home. Here are some of the most common.',
    points: ['Exquisite detailing', 'Kitchen & bath remodels', 'Additions'],
    image: '/assets/isaacstone/granite-horizontal-2.jpg',
    imageAlt: 'L-shaped granite countertop installation in progress',
  },
  {
    number: '03',
    title: 'Marble Installation',
    blurb:
      'We provide the owner with the confidence and peace of mind that their project is effectively finished and well done.',
    points: ['Quality materials', 'Attention to detail', 'Work well performed'],
    image: '/assets/isaacstone/marble-alcove.jpg',
    imageAlt: 'Carved marble alcove with wood trim',
  },
  {
    number: '04',
    title: 'Superstructure & Foundation',
    blurb: 'Our experience guarantees a well done foundation work.',
    points: ['Build to suit', 'Quality materials', 'Excellent performance'],
    image: '/assets/isaacstone/superstructure-2.jpg',
    imageAlt: 'Rebar grid tied across a foundation slab',
  },
];

/** Closing line of the services sequence; links to the main phone number. */
export const SERVICES_CTA_LABEL = 'Not sure which? Call and ask';

export interface WorkItem {
  number: string;
  caption: string;
  category: string;
  image: string;
}

/** Real photographs of the client's own completed / in-progress work. */
export const WORK: WorkItem[] = [
  {
    number: '01',
    caption: 'Dual carved marble sinks with matching backsplash',
    category: 'MARBLE',
    image: '/assets/isaacstone/marble-sinks.jpg',
  },
  {
    number: '02',
    caption: 'The marble alcove',
    category: 'MARBLE',
    image: '/assets/isaacstone/marble-alcove.jpg',
  },
  {
    number: '03',
    caption: 'L-shaped granite countertop',
    category: 'GRANITE',
    image: '/assets/isaacstone/granite-horizontal-2.jpg',
  },
  {
    number: '04',
    caption: 'Underpinning between NYC row houses',
    category: 'FOUNDATION',
    image: '/assets/isaacstone/foundation-1.jpg',
  },
  {
    number: '05',
    caption: 'Rooftop-level concrete formwork',
    category: 'SUPERSTRUCTURE',
    image: '/assets/isaacstone/superstructure-1.jpg',
  },
  {
    number: '06',
    caption: 'Excavation, wider angle',
    category: 'FOUNDATION',
    image: '/assets/isaacstone/foundation-structure.jpg',
  },
];

export interface Review {
  quote: string;
  author: string;
  meta: string;
}

/**
 * Verbatim from the public Angi listing. Pending client sign-off on featuring
 * them; the listing is under the previous trading name, which the page states.
 */
export const FEATURED_REVIEW: Review = {
  quote: 'A very honest, reliable, and highly professional contractor.',
  author: 'ISSAC K.',
  meta: 'ANGI · DECEMBER 2025',
};

export const REVIEWS: Review[] = [
  {
    quote:
      'It was a pleasure working with Jonathan from Jafet Home Improvement on multiple renovation projects.',
    author: 'ISSAC K.',
    meta: 'DEC 2025',
  },
  {
    quote: 'Very professional, definitely recommended.',
    author: 'JONATHAN T.',
    meta: 'JUN 2025',
  },
  {
    quote: 'Great service.',
    author: 'DEVIN P.',
    meta: 'MAR 2025',
  },
];

export const OWNER = {
  label: '[ 03b // THE CREW ]',
  quote:
    "Twenty-five years ago I set my first floor in Brentwood. I still measure every job myself, and the crew that starts your bathroom is the crew that finishes it. If something isn't right, you call me, not an office.",
  credentials: ['OWNER & LEAD INSTALLER', 'LICENSED & INSURED', 'EST. 2000'],
  image: RENDERS.crewOnSite,
  imageAlt: 'The crew, mid-set — large-format floor levelled and cut by hand',
} as const;

/**
 * Placeholder pair. Two different jobs stand in until the client supplies a
 * matched before/after from one room. The page says so out loud.
 */
export const BEFORE_AFTER = {
  label: '[ 03c // BEFORE & AFTER ]',
  headline: 'Same room. Six days.',
  before: RENDERS.crewOnSite,
  after: '/assets/isaacstone/marble-alcove.jpg',
  note:
    'Prototype pair: two different jobs stand in until a matched before/after from one room is dropped into these two slots.',
} as const;

export const PROCESS = {
  label: '[ 04 // PROCESS ]',
  subhead: 'Four steps. The price you agree to is the price you pay.',
  steps: [
    {
      number: '01',
      title: 'You call or write',
      body:
        'Tell us the room, the material you have in mind, and roughly when you want it done.',
    },
    {
      number: '02',
      title: 'We come and measure',
      body:
        'A free visit to look at the space, check the substrate, and bring material samples.',
    },
    {
      number: '03',
      title: 'Written estimate',
      body:
        'Itemized: materials, labor, prep. Nothing gets added later without asking you first.',
    },
    {
      number: '04',
      title: 'We install',
      body:
        'Same crew start to finish, site cleaned each day, walkthrough with you at the end.',
    },
  ],
} as const;

export const CONTACT = {
  label: '[ 05 // CONTACT ]',
  headline: 'Get an estimate. Call, or send the details.',
  body:
    'We answer the phone ourselves and reply to every request the same day, Monday to Saturday.',
  pricingNote:
    'Price depends on the material, the square footage, and the state of the floor or wall underneath. We tell you the range on the phone before anyone drives out.',
  jobTypes: [
    'Tile installation',
    'Granite installation',
    'Marble installation',
    'Superstructure & foundation',
    'Something else',
  ],
  form: {
    label: 'ESTIMATE REQUEST',
    submit: 'Send and get a call back',
    submitPending: 'Sending…',
    /** Shown after a successful submit. No promise beyond the same-day reply above. */
    success:
      'Got it. We have your details and will call you back — same day, Monday to Saturday.',
    /** Shown when the request fails. Always followed by the phone number. */
    failure: 'That did not send. Please call us instead:',
  },
} as const;

export const NAV_LINKS = [
  { index: '[01]', label: 'SERVICES', href: '#services' },
  { index: '[02]', label: 'WORK', href: '#work' },
  { index: '[03]', label: 'REVIEWS', href: '#reviews' },
  { index: '[04]', label: 'CONTACT', href: '#contact' },
];

/* ------------------------------------------------------------------
   Work ("Our work") + Reviews section chrome.
   ------------------------------------------------------------------ */

export const WORK_SECTION = {
  label: '[ 02 // WORK ]',
  heading: 'Our work',
  /** Hint next to the 01 / 06 counter on the horizontal strip. */
  scrollHint: 'SCROLL TO MOVE →',
  /** Closing card at the end of the strip. */
  outro: 'More from the job site.',
  /** Marquee band that follows the strip. */
  marquee: ['Tile', 'Granite', 'Marble', 'Brentwood'],
} as const;

export const REVIEWS_SECTION = {
  label: '[ 03 // REVIEWS ]',
} as const;

/**
 * Legally load-bearing disclosure. The Angi listing is under the company's
 * previous trading name, so the page has to say so next to the reviews.
 * Rendered verbatim as `before` + a link labelled `linkText` + `after`.
 */
export const REVIEWS_DISCLOSURE = {
  before: '5.0 average from 3 verified reviews on ',
  linkText: 'Angi',
  after: ', where the company is listed under its previous trading name.',
} as const;

/** Captions for the on-site photograph shown beside the reviews. */
export const ON_SITE_PHOTO = {
  label: 'ON SITE',
  title: 'The crew, mid-set',
  caption: 'Large-format floor, levelled and cut by hand',
} as const;
