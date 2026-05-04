/**
 * ToggleGroup — Aurum Design System (Web)
 *
 * Segmented control. Single or multi select. Each segment is a button; the
 * active one fills with `card` (vs `surface` background) and gains an inner
 * 1px border. Mode-agnostic: feels right in dark + light.
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import type { ControlSize, SelectableOption } from './types';

type SingleProps<T extends string> = {
  type?: 'single';
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};
type MultiProps<T extends string> = {
  type: 'multiple';
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[]) => void;
};

export type ToggleGroupProps<T extends string = string> =
  & { options: SelectableOption<T>[]; size?: ControlSize; disabled?: boolean }
  & (SingleProps<T> | MultiProps<T>);

const heights = { sm: 28, md: 36, lg: 44 } as const;

const Track = styled.div<{ $size: ControlSize }>`
  display: inline-flex;
  padding: 2px;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  height: ${({ $size }) => heights[$size]}px;
`;

const Segment = styled.button<{ $active: boolean; $size: ControlSize }>`
  appearance: none;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.color.border : 'transparent')};
  background: ${({ theme, $active }) => ($active ? theme.color.card : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.color.text : theme.color.subtext)};
  padding: 0 ${({ theme, $size }) => ($size === 'sm' ? theme.space[3] : theme.space[4])}px;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme, $size }) => $size === 'sm' ? theme.font.size.sm : theme.font.size.md}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  border-radius: ${({ theme }) => theme.radius.xs}px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.fast};
  &:hover:not(:disabled) { color: ${({ theme }) => theme.color.text}; }
  &:disabled { cursor: not-allowed; opacity: 0.5; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.color.primary}; outline-offset: 2px; }
`;

export function ToggleGroup<T extends string = string>(props: ToggleGroupProps<T>) {
  const { options, size = 'md', disabled } = props;
  const isMulti = props.type === 'multiple';

  const [single, setSingle] = useState<T | undefined>(
    !isMulti ? (props as SingleProps<T>).defaultValue : undefined,
  );
  const [multi, setMulti] = useState<T[]>(
    isMulti ? ((props as MultiProps<T>).defaultValue ?? []) : [],
  );

  const singleValue = !isMulti ? ((props as SingleProps<T>).value ?? single) : undefined;
  const multiValue  =  isMulti ? ((props as MultiProps<T>).value ?? multi)   : [];

  const isActive = (v: T) => isMulti ? multiValue.includes(v) : singleValue === v;

  const onSegment = (v: T) => {
    if (isMulti) {
      const next = multiValue.includes(v) ? multiValue.filter(x => x !== v) : [...multiValue, v];
      if ((props as MultiProps<T>).value === undefined) setMulti(next);
      (props as MultiProps<T>).onChange?.(next);
    } else {
      if ((props as SingleProps<T>).value === undefined) setSingle(v);
      (props as SingleProps<T>).onChange?.(v);
    }
  };

  return (
    <Track $size={size} role={isMulti ? 'group' : 'radiogroup'}>
      {options.map(opt => (
        <Segment
          key={String(opt.value)}
          type="button"
          $active={isActive(opt.value)}
          $size={size}
          disabled={disabled || opt.disabled}
          aria-pressed={isMulti ? isActive(opt.value) : undefined}
          aria-checked={!isMulti ? isActive(opt.value) : undefined}
          onClick={() => onSegment(opt.value)}
        >
          {opt.label}
        </Segment>
      ))}
    </Track>
  );
}
