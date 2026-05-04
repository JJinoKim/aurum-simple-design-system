/**
 * Color tokens — Aurum Design System
 *
 * Two-tier model (Tamagui-style):
 *   1. `palette` — raw, named hex values. Never consumed directly by components.
 *   2. `lightColors` / `darkColors` — semantic, role-based aliases. THIS is the
 *      surface components import (via the assembled theme).
 *
 * The semantic surface is identical between modes; only the values differ. A
 * component referencing `theme.color.text` works in both light and dark without
 * branching.
 */

// -----------------------------------------------------------------------------
// 1. Raw palette
// -----------------------------------------------------------------------------

export const palette = {
  // Neutrals — dark
  gray950: '#1E1E1E',
  gray900: '#272727',
  gray850: '#313131',
  gray800: '#3A3A3A',
  gray500: '#888888',
  gray400: '#666666',
  gray100: '#E8E8E8',

  // Neutrals — light
  bone50:  '#F0F0EE',
  bone100: '#F7F7F5',
  bone200: '#EEEEED',
  bone300: '#D8D8D6',
  bone500: '#999999',
  bone400: '#AAAAAA',
  bone900: '#1A1A1A',

  // Brand — deep ocean teal
  teal500: '#0E7C7B',
  teal600: '#0A6362',
  teal50Light: '#D0EFED',
  teal950Dark: '#062525',

  // Status
  green500:  '#1D9E75',
  red500:    '#E24B4A',
  amber500:  '#EF9F27',

  // Pure
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
} as const;

export type PaletteKey = keyof typeof palette;

// -----------------------------------------------------------------------------
// 2. Semantic colors — dark mode
// -----------------------------------------------------------------------------

export const darkColors = {
  // Surfaces
  background:  palette.gray950, // #1E1E1E — page canvas
  surface:     palette.gray900, // #272727 — sheets, sticky bars
  card:        palette.gray850, // #313131 — raised content
  border:      palette.gray800, // #3A3A3A — hairline dividers
  input:       palette.gray900, // #272727 — inset, darker than card

  // Text
  text:        palette.gray100, // #E8E8E8 — soft white
  subtext:     palette.gray500, // #888888 — secondary
  placeholder: palette.gray400, // #666666 — field placeholder

  // Brand
  primary:        palette.teal500,
  primaryHover:   palette.teal600,
  primarySubtle:  palette.teal950Dark, // #062525 — dark-mode tint
  primaryText:    palette.teal500,     // teal stays vivid on dark

  // Status
  success: palette.green500,
  error:   palette.red500,
  warning: palette.amber500,

  // Utility
  scrim:        'rgba(0, 0, 0, 0.5)',
  transparent:  palette.transparent,
} as const;

// -----------------------------------------------------------------------------
// 3. Semantic colors — light mode
// -----------------------------------------------------------------------------

export const lightColors = {
  // Surfaces
  background:  palette.bone50,  // #F0F0EE
  surface:     palette.bone100, // #F7F7F5
  card:        palette.bone100, // #F7F7F5 — same as surface in light
  border:      palette.bone300, // #D8D8D6
  input:       palette.bone200, // #EEEEED — inset, darker than card

  // Text
  text:        palette.bone900, // #1A1A1A
  subtext:     palette.bone500, // #999999
  placeholder: palette.bone400, // #AAAAAA

  // Brand
  primary:        palette.teal500,
  primaryHover:   palette.teal600,
  primarySubtle:  palette.teal50Light, // #D0EFED — light-mode tint
  primaryText:    palette.teal600,     // deeper teal for AA on light

  // Status
  success: palette.green500,
  error:   palette.red500,
  warning: palette.amber500,

  // Utility
  scrim:        'rgba(0, 0, 0, 0.3)',
  transparent:  palette.transparent,
} as const;

// -----------------------------------------------------------------------------
// 4. Types — both modes MUST share the same key set
// -----------------------------------------------------------------------------

export type ColorTokens = typeof darkColors;
export type ColorKey = keyof ColorTokens;

// Compile-time guarantee the two palettes have identical shape:
const _shapeCheck: ColorTokens = lightColors;
void _shapeCheck;
