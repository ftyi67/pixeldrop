export type WallpaperCategory = 
  | 'all'
  | 'trending'
  | 'anime'
  | 'fantasy'
  | 'cyberpunk'
  | 'nature'
  | 'minimalist'
  | 'tech'
  | 'abstract'
  | 'dark'
  | 'space'
  | 'city'
  | 'amoled'
  | 'cars';

export type WallpaperOrientation = 'all' | 'landscape' | 'portrait' | 'square';

export interface PexelsPhotoSrc {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

export interface NormalizedWallpaper {
  id: string;
  url: string; // High-res download link
  thumbnail: string; // Preview image
  source: 'pexels' | 'wallhaven';
  title?: string;
  authorName?: string;
  authorProfile?: string;
  width?: number;
  height?: number;
  category?: WallpaperCategory;
  orientation?: 'landscape' | 'portrait' | 'square';
}

export interface UnifiedWallpaperItem {
  id: string;
  imageUrl: string;
  authorName: string;
  authorProfile: string;
  width: number;
  height: number;
  source: 'pexels' | 'wallhaven' | 'pixabay';
}

export interface Wallpaper {
  id: string;
  url?: string; // High-res download link
  thumbnail?: string; // Preview image
  imageUrl?: string;
  authorProfile?: string;
  title: string;
  category: WallpaperCategory;
  fullUrl: string;
  thumbUrl: string;
  authorName: string;
  authorLink?: string;
  photographerId?: number;
  width: number;
  height: number;
  tags: string[];
  description: string;
  source: 'pexels' | 'wallhaven' | 'pixabay' | 'unsplash' | 'curated' | 'waifupics';
  views: number;
  downloads: number;
  likes: number;
  orientation: 'landscape' | 'portrait' | 'square';
  color?: string;
  rawSrc?: PexelsPhotoSrc;
}

export type DownloadResolution = 
  | 'desktop'   // 16:9 (1920x1080)
  | 'mobile'    // 9:16 (1080x1920)
  | 'tablet'    // 4:3 (2048x1536)
  | '4k'        // 3840x2160
  | 'original'; // Native size

export interface GradientConfig {
  id: string;
  name: string;
  color1: string;
  color2: string;
  color3?: string;
  angle: number;
  type: 'linear' | 'radial';
  category?: string;
}

export interface ConsentSettings {
  hasConsented: boolean;
  necessary: boolean;
  analytics: boolean;
  marketing: boolean; // For AdSense personalized ads
  doNotSellCCPA: boolean;
  timestamp?: number;
}
