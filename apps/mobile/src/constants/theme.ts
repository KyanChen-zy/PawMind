export const COLORS = {
  primary: '#FF8C42',
  primaryLight: '#FFB380',
  secondary: '#4ECDC4',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#333333',
  textSecondary: '#999999',
  border: '#EEEEEE',
  error: '#FF4757',
  warning: '#FFA502',
  success: '#2ED573',
  alertObserve: '#3498DB',
  alertCaution: '#FFA502',
  alertUrgent: '#FF4757',
};

export const FONTS = {
  regular: { fontSize: 14, color: COLORS.text },
  medium: { fontSize: 16, color: COLORS.text },
  large: { fontSize: 18, color: COLORS.text },
  title: { fontSize: 22, fontWeight: '700' as const, color: COLORS.text },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
