export const COLORS = {
  primary: '#FF6B6B',
  primaryLight: '#FF8E8E',
  primaryDark: '#E55A5A',
  secondary: '#4ECDC4',
  secondaryLight: '#7EDDD7',
  secondaryDark: '#3DBAB3',
  accent1: '#FFD166',
  accent2: '#06D6A0',
  accent3: '#118AB2',
  background: '#FEFEFE',
  surface: '#FFFFFF',
  text: '#2D3142',
  textSecondary: '#4F5D75',
  textLight: '#9DA3B4',
  border: '#E0E5EC',
  error: '#EF476F',
  warning: '#FFD166',
  success: '#06D6A0',
  info: '#118AB2',
  alertObserve: '#118AB2',
  alertCaution: '#FFD166',
  alertUrgent: '#EF476F',
};

export const FONTS = {
  regular: { fontSize: 14, color: COLORS.text, fontWeight: '400' as const },
  medium: { fontSize: 16, color: COLORS.text, fontWeight: '500' as const },
  large: { fontSize: 18, color: COLORS.text, fontWeight: '600' as const },
  title: { fontSize: 22, fontWeight: '700' as const, color: COLORS.text },
  heading: { fontSize: 28, fontWeight: '800' as const, color: COLORS.text },
  small: { fontSize: 12, color: COLORS.textLight, fontWeight: '400' as const },
  tiny: { fontSize: 10, color: COLORS.textLight, fontWeight: '400' as const },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  round: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const GRADIENTS = {
  primary: ['#FF6B6B', '#FF8E8E'],
  secondary: ['#4ECDC4', '#7EDDD7'],
  accent1: ['#FFD166', '#FFE599'],
  accent2: ['#06D6A0', '#34E8B0'],
  accent3: ['#118AB2', '#073B4C'],
};
