import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Reference dimensions based on a standard mobile screen (e.g., iPhone 11)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Scales a size based on the screen width.
 */
export const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

/**
 * Scales a size based on the screen height.
 */
export const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

/**
 * Moderately scales a size (useful for fonts).
 */
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export const SIZES = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};
