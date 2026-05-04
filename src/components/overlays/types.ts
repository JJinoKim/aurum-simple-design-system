/**
 * Shared types — Aurum overlays + panels.
 *
 * `Side` and `Align` describe how a floating element positions itself relative
 * to its anchor. The web implementations consume these via inline style /
 * absolute positioning; native sheets ignore `align` and treat `side` as the
 * edge to attach to.
 */

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'start' | 'center' | 'end';

export interface PositionedProps {
  side?: Side;
  align?: Align;
  /** Offset from the anchor along the side axis, in px. */
  sideOffset?: number;
  /** Offset perpendicular to the side, in px. */
  alignOffset?: number;
}

export interface ControlledOpenProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type Tone = 'default' | 'danger';
