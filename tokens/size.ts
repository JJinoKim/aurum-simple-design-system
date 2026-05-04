/**
 * Size tokens — Aurum Design System
 *
 * Control heights and hit targets. Kept distinct from `space` because they're
 * conceptually different: `space` is between things, `size` is the thing.
 */

export const size = {
  // Control heights
  controlSm: 28,  // dense toolbars, table-cell controls
  controlMd: 36,  // default web button / input height
  controlLg: 44,  // native-friendly hit target, large CTAs
  controlXl: 56,  // hero buttons, top app bar (web)

  // Bars
  appBarWeb:    56,
  appBarNative: 48,
  tabBarNative: 56,

  // Icons
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,

  // Hairlines
  hairline: 1,
} as const;

export type SizeKey = keyof typeof size;
