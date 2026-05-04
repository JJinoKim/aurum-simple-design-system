/**
 * RadioGroup — Aurum Design System (React Native)
 */
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import type { SelectableOption } from './types';

export interface RadioGroupProps<T extends string = string> {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  options: SelectableOption<T>[];
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
}

const Group = styled.View<{ $orientation: 'vertical' | 'horizontal' }>`
  flex-direction: ${({ $orientation }) => ($orientation === 'horizontal' ? 'row' : 'column')};
  gap: ${({ theme, $orientation }) => $orientation === 'horizontal' ? theme.space[5] : theme.space[3]}px;
`;
const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]}px;
`;
const Outer = styled.View<{ $checked: boolean }>`
  width: 16px; height: 16px; border-radius: 8px;
  border-width: 1px;
  border-color: ${({ theme, $checked }) => ($checked ? theme.color.primary : theme.color.border)};
  background-color: ${({ theme }) => theme.color.input};
  align-items: center; justify-content: center;
`;
const Inner = styled.View<{ $checked: boolean }>`
  width: 8px; height: 8px; border-radius: 4px;
  background-color: ${({ theme }) => theme.color.primary};
  opacity: ${({ $checked }) => ($checked ? 1 : 0)};
`;
const TextEl = styled.Text`
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.md}px;
  color: ${({ theme }) => theme.color.text};
`;

export function RadioGroup<T extends string = string>({
  value, defaultValue, onChange, options, orientation = 'vertical', disabled,
}: RadioGroupProps<T>) {
  const [internal, setInternal] = useState<T | undefined>(defaultValue);
  const current = value ?? internal;

  return (
    <Group $orientation={orientation} accessibilityRole="radiogroup">
      {options.map(opt => {
        const isOn = current === opt.value;
        const isDisabled = disabled || opt.disabled;
        return (
          <Pressable
            key={String(opt.value)}
            disabled={isDisabled}
            onPress={() => {
              if (value === undefined) setInternal(opt.value);
              onChange?.(opt.value);
            }}
            style={({ pressed }) => ({ opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1 })}
            accessibilityRole="radio"
            accessibilityState={{ selected: isOn, disabled: isDisabled }}
          >
            <Row>
              <Outer $checked={isOn}><Inner $checked={isOn} /></Outer>
              <TextEl>{opt.label}</TextEl>
            </Row>
          </Pressable>
        );
      })}
    </Group>
  );
}
