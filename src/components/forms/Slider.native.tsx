/**
 * Slider — Aurum Design System (React Native)
 *
 * Bare-bones, dependency-free single-thumb slider. Uses PanResponder; on
 * production we'd swap in `@react-native-community/slider` for accessibility,
 * but this matches the cross-platform "no extra deps" constraint and looks
 * identical to the web version.
 */
import React, { useRef, useState, useCallback } from 'react';
import { View, PanResponder, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import styled from 'styled-components/native';

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const Wrap = styled.View<{ $fullWidth: boolean; $disabled: boolean }>`
  height: 24px;
  align-self: ${({ $fullWidth }) => ($fullWidth ? 'stretch' : 'flex-start')};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : '200px')};
  justify-content: center;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;
const Track = styled.View`
  height: 4px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.color.input};
`;
const Fill = styled.View`
  position: absolute;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.color.primary};
`;
const Thumb = styled.View`
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: #fff;
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.border};
  top: 4px;
`;

export function Slider({
  min = 0, max = 100, step = 1, value, defaultValue, onValueChange, fullWidth = false, disabled, style,
}: SliderProps) {
  const [internal, setInternal] = useState(defaultValue ?? min);
  const [width, setWidth] = useState(0);
  const current = value ?? internal;
  const pct = ((current - min) / (max - min));

  const widthRef = useRef(0);
  const minRef = useRef(min);
  const maxRef = useRef(max);
  const stepRef = useRef(step);
  widthRef.current = width;
  minRef.current = min;
  maxRef.current = max;
  stepRef.current = step;

  const setFromX = useCallback((x: number) => {
    const w = widthRef.current;
    if (!w) return;
    const ratio = Math.max(0, Math.min(1, x / w));
    const raw = minRef.current + ratio * (maxRef.current - minRef.current);
    const stepped = Math.round(raw / stepRef.current) * stepRef.current;
    const clamped = Math.max(minRef.current, Math.min(maxRef.current, stepped));
    if (value === undefined) setInternal(clamped);
    onValueChange?.(clamped);
  }, [onValueChange, value]);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (e) => setFromX(e.nativeEvent.locationX),
      onPanResponderMove:  (e) => setFromX(e.nativeEvent.locationX),
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <Wrap $fullWidth={fullWidth} $disabled={!!disabled} style={style} onLayout={onLayout} {...responder.panHandlers}>
      <Track />
      <Fill style={{ width: `${pct * 100}%` }} />
      <Thumb style={{ left: Math.max(0, pct * width - 8) }} />
    </Wrap>
  );
}
