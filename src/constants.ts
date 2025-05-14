import { I18nManager } from 'react-native';

export const DOUBLE_TAP_SCALE = 3;
export const MAX_SCALE = 6;
export const SPACE_BETWEEN_IMAGES = 40;

export const rtl = I18nManager.isRTL;

export const springConfig = {
  damping: 800,
  mass: 1,
  stiffness: 250,
  restDisplacementThreshold: 0.02,
  restSpeedThreshold: 4,
};
