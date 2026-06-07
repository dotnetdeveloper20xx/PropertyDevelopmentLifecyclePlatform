/**
 * Design System — Spacing Tokens
 * 4px base unit scale. All spacing must use these values.
 * Maps to Tailwind spacing utilities (p-1 = 4px, p-2 = 8px, etc.)
 */
export const SPACING = {
  xs: '0.25rem',   // 4px  → Tailwind: 1
  sm: '0.5rem',    // 8px  → Tailwind: 2
  md: '0.75rem',   // 12px → Tailwind: 3
  base: '1rem',    // 16px → Tailwind: 4
  lg: '1.5rem',    // 24px → Tailwind: 6
  xl: '2rem',      // 32px → Tailwind: 8
  '2xl': '3rem',   // 48px → Tailwind: 12
  '3xl': '4rem',   // 64px → Tailwind: 16
  '4xl': '6rem',   // 96px → Tailwind: 24
} as const;

export const GAPS = {
  card: SPACING.base,      // Gap between cards
  section: SPACING.lg,     // Gap between sections
  page: SPACING.xl,        // Page padding
  grid: SPACING.base,      // Grid gaps
} as const;
