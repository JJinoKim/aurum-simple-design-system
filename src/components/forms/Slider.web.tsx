/**
 * Slider — Aurum Design System (Web)
 *
 * Single-thumb range. Track is `input` color, fill is `primary`. Thumb is a
 * 16px white circle with a 1px border. Uses the native input for behavior;
 * the visible track is a layered background-image gradient so the fill
 * follows the value without JS.
 */
import React, { forwardRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  fullWidth?: boolean;
}

const Range = styled.input<{ $pct: number; $fullWidth: boolean }>`
  appearance: none;
  -webkit-appearance: none;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : '200px')};
  height: 24px;
  background: transparent;
  outline: none;
  cursor: pointer;

  /* Track */
  &::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.color.primary} 0%,
      ${({ theme }) => theme.color.primary} ${({ $pct }) => $pct}%,
      ${({ theme }) => theme.color.input} ${({ $pct }) => $pct}%,
      ${({ theme }) => theme.color.input} 100%
    );
  }
  &::-moz-range-track {
    height: 4px;
    border-radius: 2px;
    background: ${({ theme }) => theme.color.input};
  }
  &::-moz-range-progress {
    height: 4px;
    border-radius: 2px;
    background: ${({ theme }) => theme.color.primary};
  }

  /* Thumb */
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 1px solid ${({ theme }) => theme.color.border};
    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
    margin-top: -6px;
    cursor: pointer;
    transition: ${({ theme }) => theme.transition.fast};
  }
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 1px solid ${({ theme }) => theme.color.border};
    cursor: pointer;
  }

  &:focus-visible::-webkit-slider-thumb {
    outline: 2px solid ${({ theme }) => theme.color.primary};
    outline-offset: 2px;
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { min = 0, max = 100, step = 1, value, defaultValue, onValueChange, onChange, fullWidth = false, ...rest },
  ref,
) {
  const current = value ?? defaultValue ?? min;
  const pct = useMemo(() => ((current - min) / (max - min)) * 100, [current, min, max]);

  const handle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(Number(e.target.value));
    onChange?.(e);
  }, [onChange, onValueChange]);

  return (
    <Range
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      defaultValue={defaultValue}
      onChange={handle}
      $pct={pct}
      $fullWidth={fullWidth}
      {...rest}
    />
  );
});
