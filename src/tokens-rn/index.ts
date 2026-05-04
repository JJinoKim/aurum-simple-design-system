/**
 * React Native — token convenience export
 *
 * Identical surface to the web tokens, but pre-stripped of any web-specific
 * fields (`spacePx`, `radiusPx`, `transition`, `shadowDark`/`shadowLight` CSS
 * strings) that RN cannot consume directly.
 *
 * In practice you can import from `@aurum/tokens` and just ignore the unused
 * fields — this file exists so RN-only codebases get a smaller, cleaner type.
 */

import {
  darkColors,
  lightColors,
  space,
  spaceSemantic,
  radius,
  size,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textStyle,
  shadowRn,
  zIndex,
  duration,
  easing,
} from '../../tokens';

export const aurumNative = {
  light: {
    color: lightColors,
    shadow: shadowRn, // RN uses shadow descriptors, identical between modes
  },
  dark: {
    color: darkColors,
    shadow: shadowRn,
  },
  space,
  spaceSemantic,
  radius,
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
} as const;

export type AurumNative = typeof aurumNative;

export {
  darkColors,
  lightColors,
  space,
  spaceSemantic,
  radius,
  size,
  fontFamily,
  fontSize,
  fontWeight,
  textStyle,
  shadowRn,
};
