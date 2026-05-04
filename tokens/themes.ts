/**
 * Assembled themes — Aurum Design System
 *
 * The single object styled-components' ThemeProvider consumes. Same shape in
 * both modes; only the color values differ. All non-color tokens live at the
 * theme root because they are mode-agnostic.
 */

import { darkColors, lightColors, type ColorTokens } from './color';
import { space, spaceSemantic, spacePx } from './space';
import { radius, radiusPx } from './radius';
import { size } from './size';
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textStyle,
} from './typography';
import { shadowDark, shadowLight, shadowRn, type ShadowKey } from './shadow';
import { zIndex } from './zIndex';
import { duration, easing, transition } from './animation';

const sharedTokens = {
  space,
  spaceSemantic,
  spacePx,
  radius,
  radiusPx,
  size,
  font: {
    family: fontFamily,
    size: fontSize,
    weight: fontWeight,
    lineHeight,
    letterSpacing,
  },
  textStyle,
  zIndex,
  duration,
  easing,
  transition,
  shadowRn,
} as const;

export const lightTheme = {
  name: 'light' as const,
  color: lightColors,
  shadow: shadowLight,
  ...sharedTokens,
};

export const darkTheme = {
  name: 'dark' as const,
  color: darkColors,
  shadow: shadowDark,
  ...sharedTokens,
};

/**
 * Public theme type — extend styled-components' DefaultTheme with this.
 * Defined as a structural type so both lightTheme and darkTheme satisfy it.
 */
export type Theme = {
  name: 'light' | 'dark';
  color: ColorTokens;
  shadow: Record<ShadowKey, string>;
} & typeof sharedTokens;

export type ThemeName = Theme['name'];

/** Compile-time guards: both themes must satisfy the common shape. */
const _lightCheck: Theme = lightTheme;
const _darkCheck: Theme = darkTheme;
void _lightCheck; void _darkCheck;

/** Both color palettes share key set (already enforced in color.ts). */
export type { ColorTokens };
