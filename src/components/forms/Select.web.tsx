/**
 * Select — Aurum Design System (Web)
 *
 * Native `<select>` styled to match Input. Custom popover dropdowns are a
 * follow-up; for an instrument-cluster system the native control is correct
 * — predictable, accessible, no surprises.
 */
import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import type { ControlSize, ControlStatus, SelectableOption } from './types';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: ControlSize;
  status?: ControlStatus;
  fullWidth?: boolean;
  options: SelectableOption[];
  placeholder?: string;
}

const sizeStyles = {
  sm: css`height: ${({ theme }) => theme.size.controlSm}px; font-size: ${({ theme }) => theme.font.size.sm}px;`,
  md: css`height: ${({ theme }) => theme.size.controlMd}px; font-size: ${({ theme }) => theme.font.size.md}px;`,
  lg: css`height: ${({ theme }) => theme.size.controlLg}px; font-size: ${({ theme }) => theme.font.size.md}px;`,
};

const StyledSelect = styled.select<{ $size: ControlSize; $status: ControlStatus; $fullWidth: boolean }>`
  appearance: none;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  background: ${({ theme }) => theme.color.input};
  color: ${({ theme }) => theme.color.text};
  border: 1px solid ${({ theme, $status }) =>
    $status === 'error' ? theme.color.error
    : $status === 'success' ? theme.color.success
    : theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: 0 ${({ theme }) => theme.space[6]}px 0 ${({ theme }) => theme.space[3]}px;
  font-family: ${({ theme }) => theme.font.family.sans};
  outline: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.fast};

  /* Down-chevron */
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1L6 6L11 1' stroke='%23888888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;

  ${({ $size }) => sizeStyles[$size]}
  &:focus { border-color: ${({ theme, $status }) => $status === 'error' ? theme.color.error : theme.color.primary}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { size = 'md', status = 'default', fullWidth = false, options, placeholder, value, defaultValue, ...rest },
  ref,
) {
  return (
    <StyledSelect ref={ref} $size={size} $status={status} $fullWidth={fullWidth} value={value} defaultValue={defaultValue} {...rest}>
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map(opt => (
        <option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>{opt.label}</option>
      ))}
    </StyledSelect>
  );
});
