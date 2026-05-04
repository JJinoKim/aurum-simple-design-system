/**
 * Progress — Aurum Design System (React Native)
 *
 * Determinate or indeterminate. Indeterminate uses a looping Animated.Value.
 */
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import type { ControlStatus } from './types';

export interface ProgressProps {
  value?: number;
  status?: ControlStatus;
  thickness?: number;
  fullWidth?: boolean;
}

const Track = styled.View<{ $thickness: number; $fullWidth: boolean }>`
  height: ${({ $thickness }) => $thickness}px;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : '200px')};
  background-color: ${({ theme }) => theme.color.input};
  border-radius: 999px;
  overflow: hidden;
`;
const FillView = styled(Animated.View)<{ $status: ControlStatus }>`
  height: 100%;
  border-radius: 999px;
  background-color: ${({ theme, $status }) =>
    $status === 'error' ? theme.color.error
    : $status === 'success' ? theme.color.success
    : theme.color.primary};
`;

export function Progress({ value, status = 'default', thickness = 4, fullWidth = false }: ProgressProps) {
  const theme = useTheme() as any;
  const determinate = typeof value === 'number';
  const clamped = determinate ? Math.max(0, Math.min(100, value!)) : 0;

  const sweep = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (determinate) return;
    const loop = Animated.loop(
      Animated.timing(sweep, { toValue: 1, duration: 1400, useNativeDriver: false }),
    );
    loop.start();
    return () => loop.stop();
  }, [determinate, sweep]);

  if (determinate) {
    return (
      <Track $thickness={thickness} $fullWidth={fullWidth} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: clamped }}>
        <FillView $status={status} style={{ width: `${clamped}%` }} />
      </Track>
    );
  }

  const left = sweep.interpolate({ inputRange: [0, 1], outputRange: ['-30%', '100%'] });
  return (
    <Track $thickness={thickness} $fullWidth={fullWidth} accessibilityRole="progressbar">
      <FillView $status={status} style={{ width: '30%', position: 'absolute', left: left as any }} />
    </Track>
  );
}
