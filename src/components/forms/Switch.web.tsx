/**
 * Switch — Aurum Design System (Web)
 *
 * Pill toggle. Off → border + input bg. On → primary bg. Thumb is a
 * 4px-inset white circle. Animation is the standard 200ms curve.
 */
import React, { forwardRef } from 'react';
import styled from 'styled-components';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: React.ReactNode;
}

const Row = styled.label<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]}px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.md}px;
  color: ${({ theme }) => theme.color.text};
`;

const HiddenInput = styled.input`
  position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0;
`;

const Track = styled.span<{ $on: boolean }>`
  position: relative;
  width: 36px;
  height: 20px;
  border-radius: 10px;
  background: ${({ theme, $on }) => ($on ? theme.color.primary : theme.color.input)};
  border: 1px solid ${({ theme, $on }) => ($on ? theme.color.primary : theme.color.border)};
  transition: ${({ theme }) => theme.transition.base};
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $on }) => ($on ? '18px' : '2px')};
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    transition: ${({ theme }) => theme.transition.base};
  }

  ${HiddenInput}:focus-visible + & {
    outline: 2px solid ${({ theme }) => theme.color.primary};
    outline-offset: 2px;
  }
`;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, checked, defaultChecked, disabled, ...rest },
  ref,
) {
  const on = !!(checked ?? defaultChecked);
  return (
    <Row $disabled={!!disabled}>
      <HiddenInput ref={ref} type="checkbox" role="switch" checked={checked} defaultChecked={defaultChecked} disabled={disabled} {...rest} />
      <Track $on={on} />
      {label}
    </Row>
  );
});
