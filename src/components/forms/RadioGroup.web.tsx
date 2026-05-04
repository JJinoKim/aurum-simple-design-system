/**
 * RadioGroup — Aurum Design System (Web)
 *
 * Controlled or uncontrolled. Renders a stack/row of radios with shared name.
 */
import { useId, useState } from 'react';
import styled from 'styled-components';
import type { SelectableOption } from './types';

export interface RadioGroupProps<T extends string = string> {
  name?: string;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  options: SelectableOption<T>[];
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
}

const Group = styled.div<{ $orientation: 'vertical' | 'horizontal' }>`
  display: flex;
  flex-direction: ${({ $orientation }) => ($orientation === 'horizontal' ? 'row' : 'column')};
  gap: ${({ theme, $orientation }) => $orientation === 'horizontal' ? theme.space[5] : theme.space[3]}px;
`;

const Row = styled.label<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]}px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.md}px;
  color: ${({ theme }) => theme.color.text};
`;

const HiddenInput = styled.input`
  position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0;
`;

const Dot = styled.span<{ $checked: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid ${({ theme, $checked }) => ($checked ? theme.color.primary : theme.color.border)};
  background: ${({ theme }) => theme.color.input};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: ${({ theme }) => theme.transition.fast};
  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.color.primary};
    transform: scale(${({ $checked }) => ($checked ? 1 : 0)});
    transition: ${({ theme }) => theme.transition.fast};
  }
  ${HiddenInput}:focus-visible + & {
    outline: 2px solid ${({ theme }) => theme.color.primary};
    outline-offset: 2px;
  }
`;

export function RadioGroup<T extends string = string>({
  name, value, defaultValue, onChange, options, orientation = 'vertical', disabled,
}: RadioGroupProps<T>) {
  const [internal, setInternal] = useState<T | undefined>(defaultValue);
  const current = value ?? internal;
  const generatedId = useId();
  const groupName = name ?? generatedId;

  return (
    <Group $orientation={orientation} role="radiogroup">
      {options.map(opt => {
        const isChecked = current === opt.value;
        const isDisabled = disabled || opt.disabled;
        return (
          <Row key={String(opt.value)} $disabled={!!isDisabled}>
            <HiddenInput
              type="radio"
              name={groupName}
              value={opt.value}
              checked={isChecked}
              disabled={isDisabled}
              onChange={() => {
                if (value === undefined) setInternal(opt.value);
                onChange?.(opt.value);
              }}
            />
            <Dot $checked={isChecked} />
            {opt.label}
          </Row>
        );
      })}
    </Group>
  );
}
