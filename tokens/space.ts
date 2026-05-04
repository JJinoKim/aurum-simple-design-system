/**
 * Spacing scale — Aurum Design System
 *
 * Modular, hand-picked. NOT a multiplier of a base unit — every step is chosen
 * for a real layout role. Whitespace is the primary compositional tool in
 * Aurum, so this scale stops where most systems are still cranking out
 * decorative steps.
 *
 * Indices are a familiar `0..8` shorthand; semantic aliases are exposed
 * alongside for code that prefers names over numbers.
 */

export const space = {
  0:  0,
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  24,
  6:  32,
  7:  48,
  8:  64,
} as const;

/** Semantic aliases — same values, named for layout intent. */
export const spaceSemantic = {
  none:  space[0],
  xxs:   space[1],   // hairline gap, icon-to-text
  xs:    space[2],   // tight inline groups
  sm:    space[3],   // chip padding, list item gap
  md:    space[4],   // default field padding
  lg:    space[5],   // card inner padding, section gap
  xl:    space[6],   // page gutter (desktop)
  xxl:   space[7],   // section break
  xxxl:  space[8],   // page-level vertical rhythm
} as const;

export type SpaceKey = keyof typeof space;
export type SpaceToken = SpaceKey;
export type SpaceSemanticKey = keyof typeof spaceSemantic;

/**
 * RN consumers expect raw numbers (no `px`). Web styled-components consumers
 * accept either, but we expose a string variant for consistency in CSS-in-JS
 * template literals.
 */
export const spacePx = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '32px',
  7: '48px',
  8: '64px',
} as const;
