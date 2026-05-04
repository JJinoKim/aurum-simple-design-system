/**
 * Button — Aurum Design System (React Native)
 *
 * Same prop surface as the web Button. RN gets a TouchableOpacity-style
 * Pressable wrapped by styled.View, with a styled.Text label inside.
 */
import React, { forwardRef } from 'react';
import { Pressable, ActivityIndicator, View } from 'react-native';
import type { GestureResponderEvent, PressableProps, ViewStyle, TextStyle } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import type { ControlSize, ControlVariant } from './types';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  size?: ControlSize;
  variant?: ControlVariant;
  fullWidth?: boolean;
  loading?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: (e: GestureResponderEvent) => void;
}

const heights = { sm: 28, md: 36, lg: 44 } as const;
const padX    = { sm: 12, md: 16, lg: 24 } as const;
const fontSz  = { sm: 13, md: 15, lg: 15 } as const;

const Shell = styled.View<{
  $size: ControlSize; $variant: ControlVariant; $fullWidth: boolean; $disabled: boolean;
}>`
  height: ${({ $size }) => heights[$size]}px;
  padding: 0 ${({ $size }) => padX[$size]}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]}px;
  align-self: ${({ $fullWidth }) => ($fullWidth ? 'stretch' : 'flex-start')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  background-color: ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.color.primary
    : $variant === 'danger' ? theme.color.error
    : $variant === 'secondary' ? theme.color.card
    : 'transparent'};
  border-color: ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.color.primary
    : $variant === 'danger' ? theme.color.error
    : $variant === 'secondary' ? theme.color.border
    : 'transparent'};
`;

const Label = styled.Text<{ $size: ControlSize; $variant: ControlVariant }>`
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ $size }) => fontSz[$size]}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme, $variant }) =>
    $variant === 'primary' || $variant === 'danger' ? '#fff' : theme.color.text};
`;

export const Button = forwardRef<View, ButtonProps>(function Button(
  { size = 'md', variant = 'primary', fullWidth = false, loading, disabled,
    iconBefore, iconAfter, children, style, textStyle, ...rest },
  ref,
) {
  const theme = useTheme() as any;
  return (
    <Pressable ref={ref as any} disabled={disabled || loading} {...rest}>
      {({ pressed }) => (
        <Shell
          $size={size}
          $variant={variant}
          $fullWidth={fullWidth}
          $disabled={!!disabled || !!loading}
          style={[{ opacity: pressed ? 0.85 : disabled || loading ? 0.5 : 1 }, style]}
        >
          {loading
            ? <ActivityIndicator size="small" color={variant === 'primary' || variant === 'danger' ? '#fff' : theme.color.text} />
            : iconBefore}
          {typeof children === 'string'
            ? <Label $size={size} $variant={variant} style={textStyle}>{children}</Label>
            : children}
          {!loading && iconAfter}
        </Shell>
      )}
    </Pressable>
  );
});
