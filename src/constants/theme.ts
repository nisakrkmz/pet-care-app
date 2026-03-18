import { moderateScale, scale, verticalScale } from '../utils/responsive';

export const Colors = {
  // Brand - More vibrant and colorful
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  secondary: '#EC4899',
  accent: '#10B981',
  
  // Neon/Gradient colors for modern look
  neon: {
    pink: '#FF006E',
    blue: '#00D9FF',
    green: '#39FF14',
    purple: '#BF00FF',
    orange: '#FF6B35',
    yellow: '#FFD60A',
  },
  
  // Gradient combinations
  gradients: {
    sunset: ['#FF6B6B', '#FFE66D'],
    ocean: ['#4ECDC4', '#44A08D'],
    galaxy: ['#667EEA', '#764BA2'],
    candy: ['#F093FB', '#F5576C'],
    neon: ['#00F260', '#0575E6'],
  },
  
  // Neutral
  background: '#FAFBFC',
  surface: '#FFFFFF',
  text: '#1A202C',
  textSecondary: '#718096',
  border: '#E2E8F0',
  
  // Game Stats - More vibrant
  hunger: '#FF6B6B',
  happiness: '#FFD93D',
  energy: '#6BCF7F',
  health: '#FF6B9D',
  
  // Indicator
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Utility
  white: '#FFFFFF',
  black: '#000000',
  shadowColor: 'rgba(139, 92, 246, 0.15)',
  
  // Glass morphism
  glass: {
    white: 'rgba(255, 255, 255, 0.25)',
    border: 'rgba(255, 255, 255, 0.18)',
    shadow: 'rgba(31, 38, 135, 0.15)',
  }
};

export const Spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
};

export const FontSize = {
  xs: moderateScale(10),
  sm: moderateScale(12),
  md: moderateScale(14),
  lg: moderateScale(18),
  xl: moderateScale(24),
  xxl: moderateScale(32),
  xxxl: moderateScale(40),
};

export const Corners = {
  sm: scale(8),
  md: scale(12),
  lg: scale(20),
  xl: scale(30),
  round: scale(100),
};

export const Shadows = {
  soft: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.1,
    shadowRadius: scale(10),
    elevation: 3,
  },
  medium: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.2,
    shadowRadius: scale(15),
    elevation: 6,
  },
  premium: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: verticalScale(10) },
    shadowOpacity: 0.15,
    shadowRadius: scale(20),
    elevation: 8,
  }
};
