/**
 * Input + TextArea — Aurum Design System (React Native)
 *
 * RN's TextInput is the basis. `multiline` + a min-height handles TextArea —
 * exposed as a separate component for parity with the web export.
 */
import React, { forwardRef } from 'react';
import type { TextInput as RNTextInput, TextInputProps as RNTextInputProps, ViewStyle } from 'react-native';
import { View } from 'react-native';
import styled from 'styled-components/native';
import type { ControlSize, ControlStatus } from './types';

export interface InputProps extends Omit<RNTextInputProps, 'style'> {
  size?: ControlSize;
  status?: ControlStatus;
  fullWidth?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  containerStyle?: ViewStyle;
}

const heights = { sm: 28, md: 36, lg: 44 } as const;
const fontSz  = { sm: 13, md: 15, lg: 15 } as const;

const Shell = styled.View<{ $size: ControlSize; $status: ControlStatus; $fullWidth: boolean; $disabled: boolean }>`
  flex-direction: row;
  align-items: center;
  height: ${({ $size }) => heights[$size]}px;
  align-self: ${({ $fullWidth }) => ($fullWidth ? 'stretch' : 'flex-start')};
  background-color: ${({ theme }) => theme.color.input};
  border-width: 1px;
  border-color: ${({ theme, $status }) =>
    $status === 'error' ? theme.color.error
    : $status === 'success' ? theme.color.success
    : theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: 0 ${({ theme }) => theme.space[3]}px;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

const StyledInput = styled.TextInput<{ $size: ControlSize }>`
  flex: 1;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ $size }) => fontSz[$size]}px;
  color: ${({ theme }) => theme.color.text};
  padding: 0;
`;

const Slot = styled.View<{ $side: 'before' | 'after' }>`
  ${({ $side, theme }) => $side === 'before' ? `margin-right: ${theme.space[2]}px;` : `margin-left: ${theme.space[2]}px;`}
`;

export const Input = forwardRef<RNTextInput, InputProps>(function Input(
  { size = 'md', status = 'default', fullWidth = false, iconBefore, iconAfter, editable, containerStyle, ...rest },
  ref,
) {
  const disabled = editable === false;
  return (
    <Shell $size={size} $status={status} $fullWidth={fullWidth} $disabled={disabled} style={containerStyle}>
      {iconBefore && <Slot $side="before">{iconBefore}</Slot>}
      <StyledInput
        ref={ref}
        $size={size}
        editable={!disabled}
        placeholderTextColor={undefined}
        {...rest}
      />
      {iconAfter && <Slot $side="after">{iconAfter}</Slot>}
    </Shell>
  );
});

// ---------------------------------------------------------------------------
// TextArea
// ---------------------------------------------------------------------------

export interface TextAreaProps extends Omit<RNTextInputProps, 'multiline' | 'style'> {
  status?: ControlStatus;
  fullWidth?: boolean;
  /** Minimum visible height in px. */
  minHeight?: number;
  containerStyle?: ViewStyle;
}

const TAShell = styled.View<{ $status: ControlStatus; $fullWidth: boolean; $disabled: boolean; $minHeight: number }>`
  background-color: ${({ theme }) => theme.color.input};
  border-width: 1px;
  border-color: ${({ theme, $status }) =>
    $status === 'error' ? theme.color.error
    : $status === 'success' ? theme.color.success
    : theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: ${({ theme }) => theme.space[3]}px;
  align-self: ${({ $fullWidth }) => ($fullWidth ? 'stretch' : 'flex-start')};
  min-height: ${({ $minHeight }) => $minHeight}px;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

const TAInput = styled.TextInput`
  flex: 1;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.md}px;
  color: ${({ theme }) => theme.color.text};
  text-align-vertical: top;
  padding: 0;
`;

export const TextArea = forwardRef<RNTextInput, TextAreaProps>(function TextArea(
  { status = 'default', fullWidth = false, minHeight = 96, editable, containerStyle, ...rest },
  ref,
) {
  const disabled = editable === false;
  return (
    <TAShell $status={status} $fullWidth={fullWidth} $disabled={disabled} $minHeight={minHeight} style={containerStyle}>
      <TAInput ref={ref} multiline editable={!disabled} {...rest} />
    </TAShell>
  );
});
