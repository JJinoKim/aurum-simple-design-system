/**
 * Select — Aurum Design System (React Native)
 *
 * RN doesn't ship a native select. This is a tap-to-open Modal sheet that
 * lists options. Single-select. The trigger looks like an Input.
 */
import React, { useState } from 'react';
import { Modal, Pressable, FlatList } from 'react-native';
import styled from 'styled-components/native';
import type { ControlSize, ControlStatus, SelectableOption } from './types';

export interface SelectProps {
  size?: ControlSize;
  status?: ControlStatus;
  fullWidth?: boolean;
  options: SelectableOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}

const heights = { sm: 28, md: 36, lg: 44 } as const;
const fontSz  = { sm: 13, md: 15, lg: 15 } as const;

const Trigger = styled.View<{ $size: ControlSize; $status: ControlStatus; $fullWidth: boolean; $disabled: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${({ $size }) => heights[$size]}px;
  padding: 0 ${({ theme }) => theme.space[3]}px;
  background-color: ${({ theme }) => theme.color.input};
  border-width: 1px;
  border-color: ${({ theme, $status }) =>
    $status === 'error' ? theme.color.error
    : $status === 'success' ? theme.color.success
    : theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  align-self: ${({ $fullWidth }) => ($fullWidth ? 'stretch' : 'flex-start')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;
const TriggerText = styled.Text<{ $size: ControlSize; $placeholder: boolean }>`
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ $size }) => fontSz[$size]}px;
  color: ${({ theme, $placeholder }) => ($placeholder ? theme.color.placeholder : theme.color.text)};
`;
const Chevron = styled.Text`
  color: ${({ theme }) => theme.color.subtext};
  font-size: 12px;
`;

const Backdrop = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.scrim};
  justify-content: flex-end;
`;
const Sheet = styled.View`
  background-color: ${({ theme }) => theme.color.surface};
  border-top-left-radius: ${({ theme }) => theme.radius.lg}px;
  border-top-right-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.space[4]}px;
  max-height: 60%;
`;
const OptionRow = styled.View<{ $selected: boolean }>`
  padding: ${({ theme }) => theme.space[3]}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $selected }) => ($selected ? theme.color.primarySubtle : 'transparent')};
`;
const OptionText = styled.Text<{ $selected: boolean }>`
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.md}px;
  color: ${({ theme, $selected }) => ($selected ? theme.color.primaryText : theme.color.text)};
`;

export function Select({
  size = 'md', status = 'default', fullWidth = false, options, value, defaultValue, placeholder = 'Select…', disabled, onValueChange,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<string | undefined>(defaultValue);
  const current = value ?? internal;
  const currentLabel = options.find(o => o.value === current)?.label ?? '';

  return (
    <>
      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
      >
        <Trigger $size={size} $status={status} $fullWidth={fullWidth} $disabled={!!disabled}>
          <TriggerText $size={size} $placeholder={!current}>{current ? currentLabel : placeholder}</TriggerText>
          <Chevron>▾</Chevron>
        </Trigger>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)}>
          <Backdrop>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <Sheet>
                <FlatList
                  data={options}
                  keyExtractor={(o) => String(o.value)}
                  renderItem={({ item }) => (
                    <Pressable
                      disabled={item.disabled}
                      onPress={() => {
                        if (value === undefined) setInternal(String(item.value));
                        onValueChange?.(String(item.value));
                        setOpen(false);
                      }}
                      style={({ pressed }) => ({ opacity: item.disabled ? 0.5 : pressed ? 0.85 : 1 })}
                    >
                      <OptionRow $selected={current === item.value}>
                        <OptionText $selected={current === item.value}>{item.label}</OptionText>
                      </OptionRow>
                    </Pressable>
                  )}
                />
              </Sheet>
            </Pressable>
          </Backdrop>
        </Pressable>
      </Modal>
    </>
  );
}
