/**
 * Progress — Aurum Design System (Web)
 *
 * Determinate (0–100) or indeterminate. Single-track, single-fill. No
 * shimmer, no gradient. Indeterminate uses a 200ms-eased keyframe that
 * sweeps a 30%-wide segment across the track.
 */
import React from 'react';
import styled, { keyframes } from 'styled-components';
import type { ControlStatus } from './types';

export interface ProgressProps {
  /** 0–100. Omit for indeterminate. */
  value?: number;
  status?: ControlStatus;
  /** Track height in px. Default 4. */
  thickness?: number;
  fullWidth?: boolean;
  ariaLabel?: string;
}

const sweep = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
`;

const Track = styled.div<{ $thickness: number; $fullWidth: boolean }>`
  position: relative;
  overflow: hidden;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : '200px')};
  height: ${({ $thickness }) => $thickness}px;
  background: ${({ theme }) => theme.color.input};
  border-radius: 999px;
`;

const Fill = styled.div<{ $pct: number; $status: ControlStatus }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ theme, $status }) =>
    $status === 'error' ? theme.color.error
    : $status === 'success' ? theme.color.success
    : theme.color.primary};
  border-radius: 999px;
  transition: width ${({ theme }) => theme.duration.base}ms ${({ theme }) => theme.easing.standard};
`;

const Indeterminate = styled.div<{ $status: ControlStatus }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 30%;
  background: ${({ theme, $status }) =>
    $status === 'error' ? theme.color.error
    : $status === 'success' ? theme.color.success
    : theme.color.primary};
  border-radius: 999px;
  animation: ${sweep} 1.4s ${({ theme }) => theme.easing.standard} infinite;
`;

export function Progress({ value, status = 'default', thickness = 4, fullWidth = false, ariaLabel }: ProgressProps) {
  const determinate = typeof value === 'number';
  const clamped = determinate ? Math.max(0, Math.min(100, value!)) : undefined;
  return (
    <Track
      $thickness={thickness}
      $fullWidth={fullWidth}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
    >
      {determinate
        ? <Fill $pct={clamped!} $status={status} />
        : <Indeterminate $status={status} />}
    </Track>
  );
}
