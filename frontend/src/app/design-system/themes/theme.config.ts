/**
 * Design System — Theme Configuration
 * Defines available themes and their DaisyUI data-theme values.
 */
export type ThemeName = 'light' | 'dark' | 'corporate';

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  daisyUITheme: string;
}

export const THEMES: ThemeConfig[] = [
  { name: 'light', label: 'Light', daisyUITheme: 'light' },
  { name: 'dark', label: 'Dark', daisyUITheme: 'dark' },
  { name: 'corporate', label: 'Corporate', daisyUITheme: 'corporate' },
];

export const DEFAULT_THEME: ThemeName = 'light';
