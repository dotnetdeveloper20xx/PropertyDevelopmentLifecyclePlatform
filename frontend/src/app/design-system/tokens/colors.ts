/**
 * Design System — Colour Tokens
 * Centralized colour governance. No component hardcodes colours.
 * These map to DaisyUI/Tailwind semantic classes.
 *
 * Usage in templates: Use DaisyUI semantic classes (text-primary, bg-base-100, etc.)
 * Usage in TypeScript: Import these tokens for programmatic colour needs.
 */
export const COLORS = {
  // Brand
  primary: 'oklch(0.42 0.17 265)',      // Deep indigo
  primaryFocus: 'oklch(0.35 0.17 265)',
  primaryContent: 'oklch(0.98 0 0)',

  secondary: 'oklch(0.55 0.15 250)',
  secondaryFocus: 'oklch(0.48 0.15 250)',
  secondaryContent: 'oklch(0.98 0 0)',

  accent: 'oklch(0.65 0.2 145)',
  accentFocus: 'oklch(0.58 0.2 145)',
  accentContent: 'oklch(0.98 0 0)',

  neutral: 'oklch(0.27 0.02 260)',
  neutralFocus: 'oklch(0.22 0.02 260)',
  neutralContent: 'oklch(0.92 0 0)',

  // Semantic
  success: 'oklch(0.65 0.17 145)',
  warning: 'oklch(0.75 0.18 80)',
  error: 'oklch(0.58 0.22 25)',
  info: 'oklch(0.62 0.15 240)',

  // Surfaces
  base100: 'oklch(0.98 0 0)',
  base200: 'oklch(0.95 0 0)',
  base300: 'oklch(0.90 0 0)',
  baseContent: 'oklch(0.25 0.02 260)',
} as const;

export type ColorToken = keyof typeof COLORS;
