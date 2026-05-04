/**
 * Shadow tokens — Aurum Design System
 *
 * Dark mode: shadows are essentially absent. Elevation is communicated by
 * tone-shift between background → surface → card. A single `sm` exists for
 * floating menus that escape the surface stack.
 *
 * Light mode: subtle, single-direction, neutral-tinted. Never colored.
 *
 * The value is a CSS `box-shadow` string for web. RN consumers should map
 * these into the equivalent shadow* / elevation props using `shadowRn` below.
 */

export const shadowDark = {
  none: 'none',
  sm:   '0 2px 8px rgba(0, 0, 0, 0.4)',
  md:   '0 4px 16px rgba(0, 0, 0, 0.5)',
  lg:   '0 12px 32px rgba(0, 0, 0, 0.55)',
} as const;

export const shadowLight = {
  none: 'none',
  sm:   '0 1px 2px rgba(0, 0, 0, 0.04)',
  md:   '0 4px 12px rgba(0, 0, 0, 0.06)',
  lg:   '0 12px 32px rgba(0, 0, 0, 0.08)',
} as const;

export type ShadowKey = keyof typeof shadowDark;

/** React Native shadow descriptors — iOS uses shadow*, Android uses elevation. */
export const shadowRn = {
  none: { shadowColor: '#000', shadowOpacity: 0, shadowRadius: 0, shadowOffset: { width: 0, height: 0 }, elevation: 0 },
  sm:   { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  md:   { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  lg:   { shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 8 },
} as const;
