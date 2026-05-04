/**
 * Switch — Aurum Design System (React Native)
 *
 * Manual implementation (not RN's built-in Switch) so the look matches web
 * exactly: 36×20 track, 14px thumb, 200ms standard easing.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';

export interface SwitchProps {
  value?: boolean;
  onValueChange?: (next: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
}

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]}px;
`;
const Track = styled(Animated.View)<{ $on: boolean }>`
  width: 36px; height: 20px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ theme, $on }) => ($on ? theme.color.primary : theme.color.border)};
  background-color: ${({ theme, $on }) => ($on ? theme.color.primary : theme.color.input)};
  justify-content: center;
`;
const Thumb = styled(Animated.View)`
  width: 14px; height: 14px;
  border-radius: 7px;
  background-color: #fff;
`;
const LabelText = styled.Text`
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.md}px;
  color: ${({ theme }) => theme.color.text};
`;

export function Switch({ value = false, onValueChange, disabled, label }: SwitchProps) {
  const theme = useTheme() as any;
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: theme.duration.base,
      useNativeDriver: false,
    }).start();
  }, [value, anim, theme.duration.base]);

  const left = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 18] });

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onValueChange?.(!value)}
      style={({ pressed }) => ({ opacity: disabled ? 0.5 : pressed ? 0.85 : 1 })}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <Row>
        <Track $on={value}>
          <Thumb style={{ marginLeft: left }} />
        </Track>
        {typeof label === 'string' ? <LabelText>{label}</LabelText> : label}
      </Row>
    </Pressable>
  );
}
