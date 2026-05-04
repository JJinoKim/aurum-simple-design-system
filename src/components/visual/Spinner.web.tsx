/**
 * Spinner — Aurum Design System (Web)
 *
 * Indeterminate loading indicator. Single-arc style, rotates infinitely.
 * Uses currentColor so it picks up its parent's color by default.
 */
import React from 'react';
import styled, { keyframes } from 'styled-components';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';

const SIZE: Record<SpinnerSize, number> = { xs: 12, sm: 16, md: 20, lg: 32 };
const STROKE: Record<SpinnerSize, number> = { xs: 1.5, sm: 2, md: 2, lg: 2.5 };

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  /** Color override. Default `currentColor`. */
  color?: 'text' | 'subtext' | 'primary' | 'inverse' | string;
  /** Visible label for screen readers. */
  label?: string;
}

const spin = keyframes`to { transform: rotate(360deg); }`;

const Ring = styled.span<{ $size: SpinnerSize; $color: SpinnerProps['color'] }>`
  display: inline-block;
  width: ${({ $size }) => SIZE[$size]}px;
  height: ${({ $size }) => SIZE[$size]}px;
  border-radius: 50%;
  border: ${({ $size }) => STROKE[$size]}px solid ${({ theme, $color }) => {
    if (!$color) return 'currentColor';
    return ($color in theme.color) ? (theme.color as any)[$color] : $color;
  }};
  border-right-color: transparent;
  animation: ${spin} 0.7s linear infinite;
  flex-shrink: 0;
`;

const Label = styled.span`
  position: absolute !important;
  width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
`;

export function Spinner({ size = 'md', color, label, ...rest }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" style={{ display: 'inline-flex', position: 'relative' }} {...rest}>
      <Ring $size={size} $color={color} aria-hidden="true" />
      {label && <Label>{label}</Label>}
    </span>
  );
}
