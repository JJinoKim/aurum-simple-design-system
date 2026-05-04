/**
 * ToggleGroup — Aurum Design System (React Native)
 */
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
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
const padX    = { sm: 10, md: 14, lg: 18 } as const;
const fontSz  = { sm: 13, md: 15, lg: 15 } as const;

const Track = styled.View<{ $size: ControlSize }>`
  flex-direction: row;
  padding: 2px;
  background-color: ${({ theme }) => theme.color.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  height: ${({ $size }) => heights[$size]}px;
  align-self: flex-start;
`;
const Segment = styled.View<{ $active: boolean; $size: ControlSize }>`
  height: 100%;
  padding: 0 ${({ $size }) => padX[$size]}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $active }) => ($active ? theme.color.card : 'transparent')};
  border-width: 1px;
  border-color: ${({ theme, $active }) => ($active ? theme.color.border : 'transparent')};
  border-radius: ${({ theme }) => theme.radius.xs}px;
`;
const SegText = styled.Text<{ $active: boolean; $size: ControlSize }>`
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ $size }) => fontSz[$size]}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme, $active }) => ($active ? theme.color.text : theme.color.subtext)};
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
    <Track $size={size} accessibilityRole={isMulti ? undefined : 'radiogroup'}>
      {options.map(opt => {
        const active = isActive(opt.value);
        const isDisabled = disabled || opt.disabled;
        return (
          <Pressable
            key={String(opt.value)}
            disabled={isDisabled}
            onPress={() => onSegment(opt.value)}
            style={({ pressed }) => ({ opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1 })}
            accessibilityRole={isMulti ? 'button' : 'radio'}
            accessibilityState={isMulti ? { selected: active } : { selected: active }}
          >
            <Segment $active={active} $size={size}>
              <SegText $active={active} $size={size}>{opt.label}</SegText>
            </Segment>
          </Pressable>
        );
      })}
    </Track>
  );
}
