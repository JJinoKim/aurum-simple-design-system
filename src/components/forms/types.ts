/**
 * Shared types for Forms primitives — Aurum Design System
 *
 * Web and native components both reach for these so prop names stay parallel
 * across platforms. Anything platform-specific (HTML element refs, RN
 * GestureResponderEvent) lives in the per-platform component file.
 */

export type ControlSize = 'sm' | 'md' | 'lg';
export type ControlVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ControlStatus = 'default' | 'success' | 'error';

export interface FieldBaseProps {
  /** Form-level disabled state. */
  disabled?: boolean;
  /** Display-only state. */
  readOnly?: boolean;
  /** Marks the field as required (visual + a11y). */
  required?: boolean;
  /** Error / success / default — drives border + helper color. */
  status?: ControlStatus;
  /** Helper text shown beneath; if `status === 'error'` this is the error message. */
  hint?: string;
  /** Field label, shown above the control via the `<Label>` primitive. */
  label?: string;
  /** Programmatic id. Auto-generated if omitted. */
  id?: string;
}

export interface SelectableOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}
