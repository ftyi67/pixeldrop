export type WallpaperCategory = 
  | 'all'
  | 'nature'
  | 'cyberpunk'
  | 'minimalist'
  | 'tech'
  | 'anime'
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

export interface UnifiedWallpaperItem {
  id: string;
  imageUrl: string;
  authorName: string;
  authorProfile: string;
  width: number;
  height: number;
  source: 'pexels' | 'pixabay';
}

export interface Wallpaper {
  id: string;
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
  source: 'pexels' | 'pixabay' | 'unsplash' | 'curated' | 'waifupics';
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
