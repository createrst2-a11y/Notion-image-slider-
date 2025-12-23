
export enum SliderMode {
  CAROUSEL = 'carousel',
  LINEAR = 'linear',
  FADE = 'fade'
}

export enum SlideDirection {
  LTR = 'ltr',
  RTL = 'rtl'
}

export enum TransitionStyle {
  STANDARD = 'standard',
  WHEEL = 'wheel'
}

export enum AspectRatio {
  SQUARE = '1/1',
  LANDSCAPE = '16/9',
  PORTRAIT = '4/5',
  CLASSIC = '4/3',
  AUTO = 'auto',
  CUSTOM = 'custom'
}

export enum ObjectFit {
  COVER = 'cover',
  CONTAIN = 'contain',
  FILL = 'fill'
}

export interface ImageItem {
  url: string;
  grayscale: number; // 0-100
  sepia: number;    // 0-100
  brightness: number; // 0-200
  contrast: number;   // 0-200
}

export interface SliderConfig {
  images: ImageItem[];
  mode: SliderMode;
  direction: SlideDirection;
  transitionStyle: TransitionStyle;
  aspectRatio: AspectRatio;
  customAspectWidth: number;
  customAspectHeight: number;
  objectFit: ObjectFit;
  showArrows: boolean;
  showDots: boolean;
  autoPlay: boolean;
  interval: number;
  borderRadius: number;
  gap: number;
  theme: 'light' | 'dark';
}

export const DEFAULT_FILTERS = {
  grayscale: 0,
  sepia: 0,
  brightness: 100,
  contrast: 100,
};

export const DEFAULT_CONFIG: SliderConfig = {
  images: [
    { url: 'https://picsum.photos/id/10/1200/800', ...DEFAULT_FILTERS },
    { url: 'https://picsum.photos/id/20/1200/800', ...DEFAULT_FILTERS },
    { url: 'https://picsum.photos/id/30/1200/800', ...DEFAULT_FILTERS }
  ],
  mode: SliderMode.CAROUSEL,
  direction: SlideDirection.RTL,
  transitionStyle: TransitionStyle.STANDARD,
  aspectRatio: AspectRatio.LANDSCAPE,
  customAspectWidth: 16,
  customAspectHeight: 9,
  objectFit: ObjectFit.COVER,
  showArrows: true,
  showDots: true,
  autoPlay: false,
  interval: 3000,
  borderRadius: 8,
  gap: 12,
  theme: 'light'
};
