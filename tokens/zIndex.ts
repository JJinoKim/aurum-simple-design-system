/**
 * z-index scale — Aurum Design System
 *
 * Discrete layers. Components should NEVER use raw numbers; reach for a name.
 */

export const zIndex = {
  base:     0,
  raised:   1,    // cards on a page
  sticky:   100,  // sticky headers
  dropdown: 1000,
  overlay:  1100, // scrim
  modal:    1200,
  popover:  1300, // floating menus, tooltips on top of modals
  toast:    1400, // always on top
} as const;

export type ZIndexKey = keyof typeof zIndex;
