
import { SliderConfig, DEFAULT_CONFIG } from '../types';

export const encodeConfig = (config: SliderConfig): string => {
  try {
    const json = JSON.stringify(config);
    return btoa(encodeURIComponent(json));
  } catch (e) {
    console.error('Encoding error', e);
    return '';
  }
};

export const decodeConfig = (hash: string): SliderConfig => {
  if (!hash || hash === '#') return DEFAULT_CONFIG;
  try {
    const base64 = hash.startsWith('#') ? hash.substring(1) : hash;
    const json = decodeURIComponent(atob(base64));
    return JSON.parse(json);
  } catch (e) {
    console.error('Decoding error', e);
    return DEFAULT_CONFIG;
  }
};
