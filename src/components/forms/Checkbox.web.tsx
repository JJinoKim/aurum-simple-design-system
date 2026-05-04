/**
 * Checkbox — Aurum Design System (Web)
 *
 * Square 16/18/20 with a 1.5px check stroke. Hides the native input behind
 * the styled box; keeps full keyboard / a11y semantics.
 */
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import type { ControlSize } from './types';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: ControlSize;
  /** Renders as `-` instead of `✓`. */
  indeterminate?: boolean;
  label?: React.ReactNode;
}

const sizes = { sm: 14, md: 16, lg: 20 } as const;

const Row = styled.label<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]}px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  user-select: none;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.md}px;
  color: ${({ theme }) => theme.color.text};
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0; height: 0;
`;

const Box = styled.span<{ $size: ControlSize; $checked: boolean }>`
  width: ${({ $size }) => sizes[$size]}px;
  height: ${({ $size }) => sizes[$size]}px;
  border: 1px solid ${({ theme, $checked }) => ($checked ? theme.color.primary : theme.color.border)};
  background: ${({ theme, $checked }) => ($checked ? theme.color.primary : theme.color.input)};
  border-radius: ${({ theme }) => theme.radius.xs}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: ${({ theme }) => theme.transition.fast};
  flex-shrink: 0;
  ${HiddenInput}:focus-visible + & {
    outline: 2px solid ${({ theme }) => theme.color.primary};
    outline-offset: 2px;
  }
`;

const Glyph = ({ indeterminate }: { indeterminate: boolean }) => (
  indeterminate
    ? <svg width="10" height="2" viewBox="0 0 10 2" fill="none"><path d="M1 1H9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
    : <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { size = 'md', indeterminate = false, label, checked, defaultChecked, disabled, ...rest },
  ref,
) {
  const isChecked = !!(checked ?? defaultChecked) || indeterminate;
  return (
    <Row $disabled={!!disabled}>
      <HiddenInput ref={ref} type="checkbox" checked={checked} defaultChecked={defaultChecked} disabled={disabled} {...rest} />
      <Box $size={size} $checked={isChecked}>
        {isChecked && <Glyph indeterminate={indeterminate} />}
      </Box>
      {label}
    </Row>
  );
});
