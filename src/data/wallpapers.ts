import { Wallpaper, WallpaperCategory, DownloadResolution } from '../types';

export const CATEGORIES: { id: WallpaperCategory; label: string; count: number; icon: string }[] = [
  { id: 'all', label: 'All Wallpapers', count: 320, icon: 'Sparkles' },
  { id: 'nature', label: 'Nature & Scenery', count: 68, icon: 'Mountain' },
  { id: 'minimalist', label: 'Beige & Minimalist', count: 54, icon: 'Layers' },
  { id: 'anime', label: 'Anime & Waifu', count: 85, icon: 'Flame' },
  { id: 'cyberpunk', label: 'Cyberpunk & Neon', count: 42, icon: 'Zap' },
  { id: 'tech', label: 'Tech & Architecture', count: 36, icon: 'Cpu' },
  { id: 'dark', label: 'Dark & AMOLED', count: 48, icon: 'Moon' },
  { id: 'abstract', label: 'Abstract & 3D', count: 32, icon: 'Shapes' },
  { id: 'space', label: 'Deep Space', count: 28, icon: 'Globe' },
];

// Rich library of curated high-resolution photographic sources with verified Unsplash IDs
export const SEED_WALLPAPERS: Wallpaper[] = [
  // BEIGE & MINIMALIST (Aesthetic warm beige / cream / luxury)
  {
    id: 'beige-1',
    title: 'Travertine Stone Arch & Warm Morning Sunlight',
    category: 'minimalist',
    fullUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2560&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=720&q=80',
    authorName: 'R architecture',
    authorLink: 'https://unsplash.com',
    width: 3840,
    height: 2160,
    tags: ['Beige', 'Minimalist', 'Stone', 'Architecture', 'Warm', 'Aesthetic', 'Desktop', 'Calm'],
    description: 'Minimalist travertine marble portal bathed in gentle warm morning rays. Perfect cream wallpaper for calm, distraction-free workspaces.',
    source: 'unsplash',
    views: 38200,
    downloads: 14500,
    likes: 3820,
    orientation: 'landscape',
    color: '#d6c7b2'
  },
  {
    id: 'beige-2',
    title: 'Minimalist Japandi Linen & Textured Plaster',
    category: 'minimalist',
    fullUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1920&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=720&q=80',
    authorName: 'Japandi Interiors',
    authorLink: 'https://unsplash.com',
    width: 1920,
    height: 2880,
    tags: ['Linen', 'Cream', 'Beige', 'PhoneWallpaper', 'WarmAesthetic', 'Organic', 'Zen'],
    description: 'Subtle textured ivory plaster with natural woven linen folds, creating an organic warm minimalist mobile wallpaper.',
    source: 'unsplash',
    views: 29400,
    downloads: 11800,
    likes: 2910,
    orientation: 'portrait',
    color: '#e2d8cb'
  },
  {
    id: 'beige-3',
    title: 'Terracotta & Sandstone Curved Silhouette',
    category: 'minimalist',
    fullUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2560&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=720&q=80',
    authorName: 'Aesthetic Studios',
    authorLink: 'https://unsplash.com',
    width: 3840,
    height: 2160,
    tags: ['Terracotta', 'Beige', 'Sandstone', 'Curved', 'WarmNeutrals', '4K Desktop'],
    description: 'Warm sandy neutrals and architectural geometry casting soft, refined shadows on an alabaster wall.',
    source: 'unsplash',
    views: 24100,
    downloads: 9800,
    likes: 2400,
    orientation: 'landscape',
    color: '#cfbca6'
  },
  {
    id: 'beige-4',
    title: 'Golden Sand Dune Ridges at Sahara Dawn',
    category: 'minimalist',
    fullUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2560&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=720&q=80',
    authorName: 'Jeremy Bishop',
    authorLink: 'https://unsplash.com/@jeremybishop',
    width: 3840,
    height: 2400,
    tags: ['Dune', 'Desert', 'Sand', 'Zen', 'Creamy', 'Warm', 'Aesthetic', '4K'],
    description: 'Fluid ripples across creamy desert dunes sculpted by wind, capturing the warm essence of minimalist natural earth tones.',
    source: 'unsplash',
    views: 31200,
    downloads: 13900,
    likes: 3100,
    orientation: 'landscape',
    color: '#bf9b7a'
  },

  // NATURE & SCENERY
  {
    id: 'nature-1',
    title: 'Alpine Emerald Lake & Misty Pine Peaks',
    category: 'nature',
    fullUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=720&q=80',
    authorName: 'Bailey Zindel',
    authorLink: 'https://unsplash.com/@baileyzindel',
    width: 3840,
    height: 2160,
    tags: ['Nature', 'Mountains', 'Lake', 'Emerald', 'Fog', '4K Ultra HD', 'Desktop', 'Calm'],
    description: 'Breathtaking alpine glacial lake surrounded by evergreen pine forests and misty granite mountain ridges during tranquil dawn twilight.',
    source: 'unsplash',
    views: 48450,
    downloads: 16240,
    likes: 4420,
    orientation: 'landscape',
    color: '#2a4439'
  },
  {
    id: 'nature-2',
    title: 'Autumn Mountain Valley at Golden Sunset',
    category: 'nature',
    fullUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2560&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=720&q=80',
    authorName: 'Vadim Sherbakov',
    authorLink: 'https://unsplash.com/@madebyvadim',
    width: 3840,
    height: 2400,
    tags: ['Nature', 'Sunset', 'Autumn', 'Valley', 'Golden Hour', 'Atmospheric', 'DesktopWallpaper'],
    description: 'Golden hour sunlight cascading over rugged mountain cliffs with vibrant autumnal valley canopy.',
    source: 'unsplash',
    views: 34200,
    downloads: 11120,
    likes: 2980,
    orientation: 'landscape',
    color: '#6e4b2d'
  },
  {
    id: 'nature-3',
    title: 'Emerald Forest Waterfall Solitude',
    category: 'nature',
    fullUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1920&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=720&q=80',
    authorName: 'Tim Swaan',
    authorLink: 'https://unsplash.com/@timswaanphotography',
    width: 1920,
    height: 2560,
    tags: ['Waterfall', 'Forest', 'Lush', 'Vertical', 'MobileWallpaper', 'Relaxing'],
    description: 'Serene vertical cascading waterfall plunging through ancient moss-covered basalt boulders.',
    source: 'unsplash',
    views: 21900,
    downloads: 9300,
    likes: 1875,
    orientation: 'portrait',
    color: '#283c31'
  },
  {
    id: 'nature-4',
    title: 'Icelandic Black Sand & Sea Foam Waves',
    category: 'nature',
    fullUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=720&q=80',
    authorName: 'Sean Oulashin',
    authorLink: 'https://unsplash.com/@oulashin',
    width: 3840,
    height: 2160,
    tags: ['Ocean', 'Waves', 'Aerial', 'Coast', 'Summer', 'Turquoise', '4K Wallpaper'],
    description: 'Pristine turquoise oceanic waves rolling onto soft sands in clean crystal clarity with radiant sunlight.',
    source: 'unsplash',
    views: 36800,
    downloads: 14890,
    likes: 3210,
    orientation: 'landscape',
    color: '#1b4a57'
  },

  // ANIME & ART
  {
    id: 'anime-1',
    title: 'Starlight Anime Girl Under Celestial Sakura Night',
    category: 'anime',
    fullUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=2560&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=720&q=80',
    authorName: 'Waifu Gallery Curators',
    authorLink: 'https://waifu.pics',
    width: 3840,
    height: 2160,
    tags: ['Anime', 'Waifu', 'Sakura', 'StarrySky', 'AestheticAnime', '4K Wallpaper'],
    description: 'Luminous anime art piece displaying an ethereal heroine under blooming sakura petals and glittering milky way.',
    source: 'waifupics',
    views: 44100,
    downloads: 21800,
    likes: 5200,
    orientation: 'landscape',
    color: '#341539'
  },
  {
    id: 'anime-2',
    title: 'Cyberpunk Anime Shrine Maiden in Rain',
    category: 'anime',
    fullUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=2560&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=720&q=80',
    authorName: 'Anime Visual Arts',
    authorLink: 'https://waifu.pics',
    width: 3840,
    height: 2160,
    tags: ['Anime', 'Cyberpunk', 'Katana', 'Neon', 'JapaneseAesthetic', '4K'],
    description: 'Striking anime character with flowing cyber-kimono standing amidst glistening futuristic rain puddles.',
    source: 'waifupics',
    views: 39200,
    downloads: 18500,
    likes: 4890,
    orientation: 'landscape',
    color: '#2a1233'
  },
  {
    id: 'anime-3',
    title: 'Cozy Anime Studio Cat & Lo-Fi Window View',
    category: 'anime',
    fullUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=720&q=80',
    authorName: 'Lo-Fi Aesthetic Studios',
    authorLink: 'https://waifu.pics',
    width: 1920,
    height: 2560,
    tags: ['Anime', 'Lofi', 'Cozy', 'Pastel', 'MobileBackground', 'WarmAnime'],
    description: 'Charming lo-fi anime illustration featuring warm sunlight through bedroom blinds, house plants, and relaxing study ambiance.',
    source: 'waifupics',
    views: 31800,
    downloads: 14400,
    likes: 3180,
    orientation: 'portrait',
    color: '#4a2f42'
  },

  // CYBERPUNK
  {
    id: 'cyber-1',
    title: 'Neo-Tokyo Rain-Slicked Neon Alleyway',
    category: 'cyberpunk',
    fullUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=2560&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=720&q=80',
    authorName: 'Aleksandar Pasaric',
    authorLink: 'https://unsplash.com/@apasaric',
    width: 3840,
    height: 2160,
    tags: ['Cyberpunk', 'Neon', 'Tokyo', 'Rain', 'Night', 'Reflections', '4K'],
    description: 'Vibrant neon signs reflecting on wet asphalt in an ambient Tokyo cyberpunk street corner with glowing magenta lights.',
    source: 'unsplash',
    views: 39300,
    downloads: 17400,
    likes: 4120,
    orientation: 'landscape',
    color: '#2e0854'
  },
  {
    id: 'cyber-2',
    title: 'Futuristic Megacity Skyscraper Skyline',
    category: 'cyberpunk',
    fullUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=2560&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=720&q=80',
    authorName: 'Denys Nevozhai',
    authorLink: 'https://unsplash.com/@dnevozhai',
    width: 3840,
    height: 2160,
    tags: ['Megacity', 'Skyline', 'Cyberpunk', 'Hologram', 'DesktopWallpaper'],
    description: 'Towering illuminated cyber skyscrapers piercing twilight mist with glowing aerial highways.',
    source: 'unsplash',
    views: 32100,
    downloads: 13800,
    likes: 3450,
    orientation: 'landscape',
    color: '#1a2238'
  },

  // TECH & ARCHITECTURE
  {
    id: 'tech-1',
    title: 'Silicon Microprocessor Macro Circuitry',
    category: 'tech',
    fullUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2560&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=720&q=80',
    authorName: 'Alexandre Debiève',
    authorLink: 'https://unsplash.com',
    width: 3840,
    height: 2160,
    tags: ['Technology', 'Hardware', 'Motherboard', 'CPU', 'Circuits', 'Engineering', '4K'],
    description: 'Ultra-detailed macro photography of high-performance integrated silicon chip architecture and gold printed circuitry conductors.',
    source: 'unsplash',
    views: 29400,
    downloads: 12700,
    likes: 2950,
    orientation: 'landscape',
    color: '#153026'
  },
  {
    id: 'tech-2',
    title: 'Modern Organic Curved Beige Atrium',
    category: 'tech',
    fullUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2560&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=720&q=80',
    authorName: 'Simone Hutsch',
    authorLink: 'https://unsplash.com',
    width: 3840,
    height: 2160,
    tags: ['Architecture', 'Modern', 'Clean', 'Beige', 'Minimalist', 'Atrium'],
    description: 'Sculptural architectural atrium featuring smooth curvilinear concrete galleries and warm skylight illumination.',
    source: 'unsplash',
    views: 25100,
    downloads: 10200,
    likes: 2140,
    orientation: 'landscape',
    color: '#c4b9aa'
  },

  // DARK AMOLED
  {
    id: 'dark-1',
    title: 'Obsidian Liquid Chrome & Pure Black Wave',
    category: 'dark',
    fullUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=2560&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=720&q=80',
    authorName: 'Lucas Benjamin',
    authorLink: 'https://unsplash.com',
    width: 3840,
    height: 2160,
    tags: ['AMOLED', 'Dark', 'OLED', 'LiquidMetal', 'PureBlack', '4K Desktop'],
    description: 'Flawless true black 100% OLED-friendly wallpaper showcasing glossy liquid mercury waves.',
    source: 'unsplash',
    views: 48900,
    downloads: 23400,
    likes: 5900,
    orientation: 'landscape',
    color: '#08080a'
  },

  // DEEP SPACE
  {
    id: 'space-1',
    title: 'James Webb Cosmic Pillars of Creation Nebula',
    category: 'space',
    fullUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2560&q=85',
    thumbUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=720&q=80',
    authorName: 'NASA Hubble & Webb',
    authorLink: 'https://unsplash.com/@nasa',
    width: 3840,
    height: 2160,
    tags: ['Space', 'Nebula', 'Galaxy', 'NASA', 'Stars', 'Cosmic', '4K Wallpaper'],
    description: 'Astronomical deep field telescope photograph of gas nebulas and stellar nursery clusters in ultra high definition.',
    source: 'unsplash',
    views: 51200,
    downloads: 24900,
    likes: 6400,
    orientation: 'landscape',
    color: '#08172c'
  },
];

// Pool of additional verified photographic sets for continuous fresh generation
const DYNAMIC_PHOTO_POOL = [
  {
    urlId: 'photo-1519681393784-d120267933ba',
    title: 'Starry Mountain Night & Cosmic Milky Way',
    category: 'nature',
    tags: ['Stars', 'Mountains', 'NightSky', 'Scenic', '4K'],
    orientation: 'landscape',
    color: '#1a1f36',
  },
  {
    urlId: 'photo-1579783900882-c0d3dad7b119',
    title: 'Creamy Ivory Plaster Sculptural Vase & Shadows',
    category: 'minimalist',
    tags: ['Beige', 'Cream', 'Ceramics', 'Aesthetic', 'Warm', 'Clean'],
    orientation: 'portrait',
    color: '#dfd4c5',
  },
  {
    urlId: 'photo-1507525428034-b723cf961d3e',
    title: 'Tropical Azure Coastline & Cream Sandy Shore',
    category: 'nature',
    tags: ['Ocean', 'Coast', 'Sand', 'Beach', 'Cyan', 'Relaxing'],
    orientation: 'landscape',
    color: '#489fb5',
  },
  {
    urlId: 'photo-1518005020951-eccb494ad742',
    title: 'Warm Sandstone Arches of Mediterranean Villa',
    category: 'minimalist',
    tags: ['Beige', 'Architecture', 'WarmStone', 'Minimal', 'Sunny'],
    orientation: 'landscape',
    color: '#d4ba9f',
  },
  {
    urlId: 'photo-1541701494587-cb58502866ab',
    title: 'Chromatic Fluid Acrylic Nebula Pour',
    category: 'abstract',
    tags: ['FluidArt', 'Acrylic', 'Liquid', 'ColorSplash', 'Aesthetic'],
    orientation: 'portrait',
    color: '#6c2b5d',
  },
  {
    urlId: 'photo-1511447333015-45b65e60f6d5',
    title: 'Cyberpunk Neon Cyber Shinjuku Crossroads',
    category: 'cyberpunk',
    tags: ['Tokyo', 'Neon', 'Rain', 'CyberCity', 'NightView'],
    orientation: 'landscape',
    color: '#381647',
  },
  {
    urlId: 'photo-1618005182384-a83a8bd57fbe',
    title: 'Ethereal Iridescent Ribbon Floating in Violet Air',
    category: 'abstract',
    tags: ['3DRender', 'Iridescent', 'Curves', 'Violet', 'Modern'],
    orientation: 'landscape',
    color: '#422154',
  },
  {
    urlId: 'photo-1534447677768-be436bb09401',
    title: 'Nordic Aurora Borealis Over Snowy Fjord Peaks',
    category: 'nature',
    tags: ['NorthernLights', 'Aurora', 'Fjords', 'Winter', 'Norway'],
    orientation: 'landscape',
    color: '#12382e',
  },
  {
    urlId: 'photo-1508739773434-c26b3d09e071',
    title: 'Sci-Fi Cyber Skyline with Glowing Flyways',
    category: 'cyberpunk',
    tags: ['Futuristic', 'Skyline', 'Hologram', 'DarkAesthetic'],
    orientation: 'landscape',
    color: '#1b1b2f',
  },
  {
    urlId: 'photo-1558494949-ef010cbdcc31',
    title: 'High-Density Datacenter Fiber Conduits',
    category: 'tech',
    tags: ['Datacenter', 'Server', 'LEDs', 'Network', 'TechMobile'],
    orientation: 'portrait',
    color: '#102542',
  },
  {
    urlId: 'photo-1600585154340-be6161a56a0c',
    title: 'Warm Alabaster Stone Facet & Palm Shadows',
    category: 'minimalist',
    tags: ['Beige', 'Cream', 'PalmShadows', 'Sunlit', 'Editorial'],
    orientation: 'portrait',
    color: '#e0d5c3',
  },
  {
    urlId: 'photo-1506744038136-46273834b3fb',
    title: 'Misty Alpine Pine Crests at Dawn Silence',
    category: 'nature',
    tags: ['Mountains', 'MistyPine', 'Reflection', 'UltraHD'],
    orientation: 'landscape',
    color: '#21332a',
  },
];

let dynamicCounter = 100;

/**
 * Generates fresh unique wallpapers on the fly (continuous stream engine)
 */
export function generateFreshWallpaperBatch(count: number = 6, specificCategory?: WallpaperCategory): Wallpaper[] {
  const result: Wallpaper[] = [];
  const pool = specificCategory && specificCategory !== 'all'
    ? DYNAMIC_PHOTO_POOL.filter(p => p.category === specificCategory)
    : DYNAMIC_PHOTO_POOL;

  const candidatePool = pool.length > 0 ? pool : DYNAMIC_PHOTO_POOL;

  for (let i = 0; i < count; i++) {
    dynamicCounter++;
    const template = candidatePool[Math.floor(Math.random() * candidatePool.length)];
    const uniqueTimestamp = Date.now() + Math.floor(Math.random() * 10000);
    const id = `stream-wp-${dynamicCounter}-${uniqueTimestamp}`;

    // Add unique width/height seeds
    const isPortrait = template.orientation === 'portrait' || (i % 3 === 0);
    const width = isPortrait ? 1920 : 3840;
    const height = isPortrait ? 2880 : 2160;

    const fullUrl = `https://images.unsplash.com/${template.urlId}?auto=format&fit=crop&w=${isPortrait ? 1920 : 2560}&q=85&sig=${dynamicCounter}`;
    const thumbUrl = `https://images.unsplash.com/${template.urlId}?auto=format&fit=crop&w=720&q=80&sig=${dynamicCounter}`;

    result.push({
      id,
      title: `${template.title} #${dynamicCounter}`,
      category: (specificCategory && specificCategory !== 'all' ? specificCategory : template.category) as WallpaperCategory,
      fullUrl,
      thumbUrl,
      authorName: 'Curated Studio Artist',
      authorLink: 'https://unsplash.com',
      width,
      height,
      tags: [...template.tags, 'FreshDrop', 'HD', 'NewRelease'],
      description: `Newly added ultra-high-definition ${template.category} background. Freshly indexed in 4K resolution for mobile and desktop screens with warm creamy tones and optimal pixel clarity.`,
      source: 'curated',
      views: Math.floor(Math.random() * 500) + 120,
      downloads: Math.floor(Math.random() * 200) + 40,
      likes: Math.floor(Math.random() * 90) + 15,
      orientation: isPortrait ? 'portrait' : 'landscape',
      color: template.color || '#d6c7b2',
    });
  }

  return result;
}

/**
 * Fetch fresh anime images from Waifu.pics free public API
 */
export async function fetchWaifuPicsWallpapers(type: 'waifu' | 'neko' | 'shinobu' | 'megumin' = 'waifu'): Promise<Wallpaper[]> {
  try {
    const response = await fetch(`https://api.waifu.pics/many/sfw/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`Waifu.pics API returned status ${response.status}`);
    }

    const data = await response.json();
    if (data && Array.isArray(data.files)) {
      return data.files.slice(0, 16).map((url: string, index: number) => {
        const id = `waifu-live-${type}-${Date.now()}-${index}`;
        const titleFormatted = type.charAt(0).toUpperCase() + type.slice(1);
        return {
          id,
          title: `Artistic Anime ${titleFormatted} #${index + 1}`,
          category: 'anime' as WallpaperCategory,
          fullUrl: url,
          thumbUrl: url,
          authorName: 'Waifu.pics Artists',
          authorLink: 'https://waifu.pics',
          width: 1920,
          height: 1080,
          tags: ['Anime', titleFormatted, 'WaifuPics', 'Aesthetic', 'Otaku', '4K Anime', 'MobileWallpaper'],
          description: `High-resolution aesthetic anime wallpaper featuring ${titleFormatted} artwork. Sourced via Waifu.pics community API for mobile and desktop screens.`,
          source: 'waifupics',
          views: Math.floor(Math.random() * 8000) + 2000,
          downloads: Math.floor(Math.random() * 3000) + 800,
          likes: Math.floor(Math.random() * 700) + 200,
          orientation: index % 2 === 0 ? 'portrait' : 'landscape',
          color: '#341539'
        };
      });
    }
  } catch (error) {
    console.warn('Waifu.pics API fetch warning:', error);
  }
  return [];
}

/**
 * Helper to compute download parameters for Unsplash CDN
 */
export function getOptimizedDownloadUrl(url: string, resolution: DownloadResolution): string {
  if (!url.includes('unsplash.com')) {
    return url;
  }
  const baseUrl = url.split('?')[0];

  switch (resolution) {
    case 'desktop': // 1920x1080
      return `${baseUrl}?auto=format&fit=crop&w=1920&h=1080&q=90`;
    case 'mobile': // 1080x1920
      return `${baseUrl}?auto=format&fit=crop&w=1080&h=1920&q=90`;
    case 'tablet': // 2048x1536
      return `${baseUrl}?auto=format&fit=crop&w=2048&h=1536&q=90`;
    case '4k': // 3840x2160
      return `${baseUrl}?auto=format&fit=crop&w=3840&h=2160&q=95`;
    case 'original':
    default:
      return `${baseUrl}?auto=format&fit=crop&w=3840&q=95`;
  }
}

/**
 * Client-side Canvas Image Resizer and Downloader
 */
export async function downloadWithResizing(
  imageUrl: string,
  filename: string,
  targetWidth: number,
  targetHeight: number,
  onProgress?: (status: string) => void
): Promise<void> {
  onProgress?.('Rendering resolution...');

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let fetchUrl = imageUrl;
    if (imageUrl.includes('unsplash.com')) {
      const base = imageUrl.split('?')[0];
      fetchUrl = `${base}?auto=format&fit=crop&w=${targetWidth}&h=${targetHeight}&q=92`;
    }

    img.onload = () => {
      onProgress?.('Rendering pixels...');
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error('Canvas 2D context unavailable');

        const imgAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;

        let renderWidth = targetWidth;
        let renderHeight = targetHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (imgAspect > targetAspect) {
          renderWidth = targetHeight * imgAspect;
          offsetX = (targetWidth - renderWidth) / 2;
        } else {
          renderHeight = targetWidth / imgAspect;
          offsetY = (targetHeight - renderHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

        onProgress?.('Generating file...');
        canvas.toBlob((blob) => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
            onProgress?.('Downloaded!');
            resolve();
          } else {
            triggerDirectDownload(fetchUrl, filename);
            resolve();
          }
        }, 'image/jpeg', 0.95);
      } catch (err) {
        console.warn('Canvas render error, direct link fallback:', err);
        triggerDirectDownload(fetchUrl, filename);
        resolve();
      }
    };

    img.onerror = () => {
      triggerDirectDownload(fetchUrl, filename);
      resolve();
    };

    img.src = fetchUrl;
  });
}

function triggerDirectDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
