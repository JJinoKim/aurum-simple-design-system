/**
 * Animation tokens — Aurum Design System
 *
 * One easing curve. Three durations. No bounces.
 */

export const duration = {
  fast:   120,  // hover, press feedback
  base:   200,  // component state transitions (default)
  slow:   320,  // sheet / modal entrances
} as const;

/**
 * Single easing for the whole system — approximates Material's "standard"
 * curve. Mechanical, never bouncy.
 */
export const easing = {
  standard: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  /** Linear is reserved for indeterminate progress only. */
  linear:   'linear',
} as const;

/** Pre-composed `transition` shorthand for web. */
export const transition = {
  fast: `all ${duration.fast}ms ${easing.standard}`,
  base: `all ${duration.base}ms ${easing.standard}`,
  slow: `all ${duration.slow}ms ${easing.standard}`,
} as const;

export type DurationKey = keyof typeof duration;
export type EasingKey   = keyof typeof easing;
