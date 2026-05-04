/**
 * Checkbox — Aurum Design System (React Native)
 */
import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import Svg, { Path } from 'react-native-svg';
import type { ControlSize } from './types';

export interface CheckboxProps {
  size?: ControlSize;
  checked?: boolean;
  onCheckedChange?: (next: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
}

const sizes = { sm: 14, md: 16, lg: 20 } as const;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]}px;
`;
const Box = styled.View<{ $size: ControlSize; $checked: boolean }>`
  width: ${({ $size }) => sizes[$size]}px;
  height: ${({ $size }) => sizes[$size]}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.xs}px;
  border-color: ${({ theme, $checked }) => ($checked ? theme.color.primary : theme.color.border)};
  background-color: ${({ theme, $checked }) => ($checked ? theme.color.primary : theme.color.input)};
  align-items: center;
  justify-content: center;
`;
const LabelText = styled.Text`
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.md}px;
  color: ${({ theme }) => theme.color.text};
`;

export function Checkbox({ size = 'md', checked = false, onCheckedChange, indeterminate, disabled, label }: CheckboxProps) {
  const isOn = checked || !!indeterminate;
  return (
    <Pressable
      disabled={disabled}
      onPress={() => onCheckedChange?.(!checked)}
      style={({ pressed }) => ({ opacity: disabled ? 0.5 : pressed ? 0.85 : 1 })}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: indeterminate ? 'mixed' : checked, disabled }}
    >
      <Row>
        <Box $size={size} $checked={isOn}>
          {isOn && (indeterminate
            ? <Svg width={10} height={2} viewBox="0 0 10 2"><Path d="M1 1H9" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" /></Svg>
            : <Svg width={10} height={8} viewBox="0 0 10 8"><Path d="M1 4L4 7L9 1" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>)}
        </Box>
        {typeof label === 'string' ? <LabelText>{label}</LabelText> : label}
      </Row>
    </Pressable>
  );
}
