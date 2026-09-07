export interface VideoReelSnapshot {
  id: string;
  reelNumber: string;
  title: string;
  property: string;
  location: string;
  category: string;
  specs: string;
  duration: string;
  views: string;
  beforeUrl: string;
  beforeLabel: string;
  afterUrl: string;
  afterLabel: string;
  description: string;
  instagramUrl: string;
}

export const VIDEO_REELS: VideoReelSnapshot[] = [
  {
    id: 'reel-2', // Hero Slab
    reelNumber: 'REEL #02 • VIRAL',
    title: 'Monolithic Waterfall Quartzite Island',
    property: 'Roslyn Harbor Waterfront Residence',
    location: 'Roslyn Harbor, Nassau County, NY',
    category: 'Countertops & Island',
    specs: '134" x 58" x 3" Mitered Edge • Bookmatched Veins',
    duration: '0:34',
    views: '142K Views',
    beforeUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80',
    beforeLabel: 'BEFORE: SUBFLOOR & FRAMING DEMO',
    afterUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=90',
    afterLabel: 'AFTER: MONOLITHIC QUARTZITE WATERFALL',
    description: 'Gut renovation of kitchen island. Subfloor reinforced to L/720 deflection. 3-inch double mitered edge with continuous waterfall veining down both vertical gable ends.',
    instagramUrl: 'https://www.instagram.com/jafettile____com/'
  },
  {
    id: 'reel-1',
    reelNumber: 'REEL #01',
    title: 'Calacatta Gold Bookmatch Master Bath',
    property: 'Brentwood Executive Penthouse',
    location: 'Brentwood, Suffolk County, NY',
    category: 'Master Bath & Spa',
    specs: '260 sq ft Slab Walls • Curbless Linear Drain',
    duration: '0:28',
    views: '98K Views',
    beforeUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'BEFORE: GUTTED STUDS & OLD TILE',
    afterUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1600&q=90',
    afterLabel: 'AFTER: BOOKMATCHED CALACATTA SLAB & TILES',
    description: 'Complete gut of rotted shower pan and cracked tile. Installed Schluter-Kerdi waterproof envelope, curbless linear floor, and ceiling-height bookmatched Calacatta slabs with honed marble floor tiles.',
    instagramUrl: 'https://www.instagram.com/jafettile____com/'
  },
  {
    id: 'reel-3',
    reelNumber: 'REEL #03',
    title: '18-Foot Fluted Large-Format Fireplace',
    property: 'Garden City Modernist Estate',
    location: 'Garden City, Nassau County, NY',
    category: 'Fireplaces & Architectural Cladding',
    specs: '108" x 48" Continuous Porcelain Slabs',
    duration: '0:31',
    views: '76K Views',
    beforeUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'BEFORE: DATED 1970s SOOT BRICK',
    afterUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90',
    afterLabel: 'AFTER: MONUMENTAL 18FT SLAB HEARTH',
    description: 'Demolished uneven red brick chimney breast. Built structural metal framing and cladded with full-height Italian porcelain slabs with fluted architectural wing walls and polished stone hearth.',
    instagramUrl: 'https://www.instagram.com/jafettile____com/'
  },
  {
    id: 'reel-4',
    reelNumber: 'REEL #04',
    title: 'Chevron Large-Format Porcelain Foyer',
    property: 'Manhasset North Shore Manor',
    location: 'Manhasset, NY',
    category: 'Precision Flooring',
    specs: '850 sq ft • 24"x48" Chevron • Zero Lippage',
    duration: '0:26',
    views: '63K Views',
    beforeUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'BEFORE: UNEVEN PLYWOOD SUBSTRATE',
    afterUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=90',
    afterLabel: 'AFTER: ZERO-DEFLECTION CHEVRON FOYER',
    description: 'Laser-leveled irregular subfloors with self-leveling matrix and Ditra uncoupling. Laser-aligned Italian porcelain chevron pattern with 1/16" hairline joints and marble perimeter aprons.',
    instagramUrl: 'https://www.instagram.com/jafettile____com/'
  },
  {
    id: 'reel-5',
    reelNumber: 'REEL #05',
    title: 'Bespoke Marble Wet Room & Fluted Vanity',
    property: 'Southampton Oceanfront Estate',
    location: 'Southampton, Hamptons, NY',
    category: 'Interior Marble Wet Room',
    specs: '420 sq ft • Honed Italian Marble & Fluted Stone',
    duration: '0:42',
    views: '115K Views',
    beforeUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'BEFORE: GUTTED DRY SHELL',
    afterUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=90',
    afterLabel: 'AFTER: BESPOKE MARBLE WET ROOM & VANITY',
    description: 'Engineered waterproof wet room featuring custom-cut bookmatched Carrara marble wall tiles, integrated shower bench, and hand-mitered marble dual vanity.',
    instagramUrl: 'https://www.instagram.com/jafettile____com/'
  }
];

export const HERO_SLAB = VIDEO_REELS[0]; // Roslyn Harbor Monolithic Waterfall Island
