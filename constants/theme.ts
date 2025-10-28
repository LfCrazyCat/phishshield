// constants/theme.ts
import { Platform, useColorScheme } from 'react-native';
import { DefaultTheme, DarkTheme, type Theme } from '@react-navigation/native';

/** Brand-farger */
const BRAND = {
  primary: '#003399', // PhishShield blå
  success: '#00CC66',
  warning: '#FF6600',
  danger:  '#CC0000',
};

/** Lyse/mørke paletter */
export const Colors = {
  light: {
    text: '#11181C',
    textMuted: '#667085',
    heading: '#0F172A',
    background: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E6E8EB',
    tint: BRAND.primary,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: BRAND.primary,
    link: BRAND.primary,
    success: BRAND.success,
    warning: BRAND.warning,
    danger: BRAND.danger,
    shadow: 'rgba(16,24,40,0.18)',
  },
  dark: {
    text: '#ECEDEE',
    textMuted: '#9BA1A6',
    heading: '#F8FAFC',
    background: '#0C0D0E',
    card: '#111315',
    border: '#1F2326',
    tint: '#7FA3FF',               // litt lysere i dark
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#7FA3FF',
    link: '#7FA3FF',
    success: '#28D17C',
    warning: '#FF8A33',
    danger:  '#FF5A5A',
    shadow: 'rgba(0,0,0,0.35)',
  },
};

/** Design-tokens */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999, // brukt til runde avatarer
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
};

export const font = {
  h1: 24,
  h2: 18,
  body: 16,
  sub: 15,
  small: 14,
};

/** Plattformspesifikke fontfamilier (samme navn som før) */
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

/** Enkel hook for å hente riktig palett i komponenter */
export function useThemeColors() {
  const nativeScheme = useColorScheme(); // 'light' | 'dark'
  // 👇 bruk alltid lysmodus i web for å unngå svart på svart
  const scheme = Platform.OS === 'web' ? 'light' : nativeScheme;
  const colors = scheme === 'dark' ? Colors.dark : Colors.light;
  return { scheme, colors, radius, spacing, font, Fonts };
}


/** React Navigation-tema (arver fra default for å beholde fonts.bold osv.) */
export const navLight: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.tint,
    background: Colors.light.background,
    card: Colors.light.card,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.tint,
  },
};

export const navDark: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.tint,
    background: Colors.dark.background,
    card: Colors.dark.card,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.tint,
  },
};
