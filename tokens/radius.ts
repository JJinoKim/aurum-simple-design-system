/**
 * Border-radius scale — Aurum Design System
 *
 * Five steps. No fully-rounded pill except for status dots (use `radius.full`).
 * Default component radius is `md` (12).
 */

export const radius = {
  xs:  4,    // small chips, status dots when not full
  sm:  8,    // inputs, buttons
  md:  12,   // cards, panels  ← default
  lg:  16,   // modals, sheets
  xl:  24,   // full-bleed media, hero
  full: 9999,
} as const;

export type RadiusKey = keyof typeof radius;

export const radiusPx = {
  xs:  '4px',
  sm:  '8px',
  md:  '12px',
  lg:  '16px',
  xl:  '24px',
  full: '9999px',
} as const;
