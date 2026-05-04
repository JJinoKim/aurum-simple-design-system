/**
 * Forms public surface — Aurum Design System
 *
 * Bundlers resolve `.web` for web targets and `.native` for React Native via
 * platform extensions. Consumers import a single path:
 *
 *     import { Button, Input, Switch } from '@aurum/forms';
 *
 * Shared types are flat-re-exported.
 */

export * from './types';
// Re-export per-platform components. Bundlers (Metro for RN, webpack/Vite
// with `resolve.extensions`) pick the matching `.web.tsx` or `.native.tsx`.
export * from './Button.web';
export * from './Label.web';
export * from './Form.web';
export * from './Input.web';
export * from './Checkbox.web';
export * from './RadioGroup.web';
export * from './Switch.web';
export * from './ToggleGroup.web';
export * from './Select.web';
export * from './Slider.web';
export * from './Progress.web';
