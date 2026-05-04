/**
 * Typography tokens — Aurum Design System
 *
 * Atomic axes (family / size / weight / lineHeight / letterSpacing) plus a
 * pre-composed `textStyle` map that bundles them into role-named recipes.
 * Components should reach for `textStyle.body` not the atoms directly.
 */

export const fontFamily = {
  /**
   * Primary UI face. Inter (variable, user-supplied) — see /fonts. Variable
   * axes: opsz (optical size) and wght (weight 100–900). Italic is a separate
   * variable file. The `opsz` axis can be tuned per role; the textStyle
   * recipes below leave it to the browser's default for now.
   */
  sans: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
  /** Same family, used wherever `font-variant-numeric: tabular-nums` matters. */
  mono: `'Inter', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`,
} as const;

/** Numeric size scale — px values from the spec. */
export const fontSize = {
  xs:    11,
  sm:    13,
  md:    15,   // body default
  lg:    18,
  xl:    22,
  '2xl': 28,
  '3xl': 36,
  '4xl': 44,
  '5xl': 56,
} as const;

export const fontWeight = {
  regular:  '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
} as const;

/** Multipliers, not px. Apply against fontSize at composition time. */
export const lineHeight = {
  tight:   1,      // single-line numeric readouts
  display: 1.2,    // 22+
  heading: 1.3,    // headings (h1–h3)
  body:    1.45,   // default running text
} as const;

export const letterSpacing = {
  tight:    '-0.01em',  // display sizes
  normal:   '0',
  wide:     '0.04em',   // small caps / unit labels
} as const;

/**
 * Composed text recipes. Each entry is a complete style block.
 * Numeric line-heights are intentional (RN-compatible); web consumers can use
 * them directly — `line-height: 1.45` is valid CSS.
 */
export const textStyle = {
  display:    {
    fontFamily: fontFamily.sans,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.display,
    letterSpacing: letterSpacing.tight,
  },
  h1: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.display,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.display,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.display,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.body,
    letterSpacing: letterSpacing.normal,
  },
  bodyStrong: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.body,
    letterSpacing: letterSpacing.normal,
  },
  label: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.body,
    letterSpacing: letterSpacing.normal,
  },
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.body,
    letterSpacing: letterSpacing.normal,
  },
  micro: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.body,
    letterSpacing: letterSpacing.wide,
  },
  /** Instrument-cluster numeric readout. Use with `tabular-nums`. */
  readout: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
} as const;

export type FontSizeKey   = keyof typeof fontSize;
export type FontWeightKey = keyof typeof fontWeight;
export type TextStyleKey  = keyof typeof textStyle;
