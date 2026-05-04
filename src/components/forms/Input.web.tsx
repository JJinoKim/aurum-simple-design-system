/**
 * Input — Aurum Design System (Web)
 *
 * Inset field on `theme.color.input` (one tone darker than card → reads as
 * recessed). 1px border using `theme.color.border`; in `error` status the
 * border becomes `theme.color.error`. Single transition; no glow.
 */
import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import type { ControlSize, ControlStatus } from './types';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: ControlSize;
  status?: ControlStatus;
  fullWidth?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
}

const sizeStyles = {
  sm: css`
    height: ${({ theme }) => theme.size.controlSm}px;
    padding: 0 ${({ theme }) => theme.space[3]}px;
    font-size: ${({ theme }) => theme.font.size.sm}px;
  `,
  md: css`
    height: ${({ theme }) => theme.size.controlMd}px;
    padding: 0 ${({ theme }) => theme.space[3]}px;
    font-size: ${({ theme }) => theme.font.size.md}px;
  `,
  lg: css`
    height: ${({ theme }) => theme.size.controlLg}px;
    padding: 0 ${({ theme }) => theme.space[4]}px;
    font-size: ${({ theme }) => theme.font.size.md}px;
  `,
};

const Shell = styled.div<{ $size: ControlSize; $status: ControlStatus; $fullWidth: boolean; $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  background: ${({ theme }) => theme.color.input};
  border: 1px solid ${({ theme, $status }) =>
    $status === 'error' ? theme.color.error
    : $status === 'success' ? theme.color.success
    : theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  transition: ${({ theme }) => theme.transition.fast};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:focus-within {
    border-color: ${({ theme, $status }) =>
      $status === 'error' ? theme.color.error : theme.color.primary};
  }

  ${({ $size }) => $size === 'sm' && css`min-height: ${({ theme }) => theme.size.controlSm}px;`}
  ${({ $size }) => $size === 'md' && css`min-height: ${({ theme }) => theme.size.controlMd}px;`}
  ${({ $size }) => $size === 'lg' && css`min-height: ${({ theme }) => theme.size.controlLg}px;`}
`;

const StyledInput = styled.input<{ $size: ControlSize }>`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.font.family.sans};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  ${({ $size }) => sizeStyles[$size]}
  &::placeholder { color: ${({ theme }) => theme.color.placeholder}; }
  &:disabled { cursor: not-allowed; }
`;

const IconSlot = styled.span<{ $side: 'before' | 'after' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.subtext};
  padding-${({ $side }) => ($side === 'before' ? 'left' : 'right')}: ${({ theme }) => theme.space[3]}px;
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', status = 'default', fullWidth = false, iconBefore, iconAfter, disabled, ...rest },
  ref,
) {
  return (
    <Shell $size={size} $status={status} $fullWidth={fullWidth} $disabled={!!disabled}>
      {iconBefore && <IconSlot $side="before">{iconBefore}</IconSlot>}
      <StyledInput ref={ref} $size={size} disabled={disabled} {...rest} />
      {iconAfter && <IconSlot $side="after">{iconAfter}</IconSlot>}
    </Shell>
  );
});

// ---------------------------------------------------------------------------
// TextArea
// ---------------------------------------------------------------------------

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  status?: ControlStatus;
  fullWidth?: boolean;
}

const StyledTextArea = styled.textarea<{ $status: ControlStatus; $fullWidth: boolean }>`
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  min-height: 96px;
  padding: ${({ theme }) => theme.space[3]}px;
  background: ${({ theme }) => theme.color.input};
  border: 1px solid ${({ theme, $status }) =>
    $status === 'error' ? theme.color.error
    : $status === 'success' ? theme.color.success
    : theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.md}px;
  line-height: ${({ theme }) => theme.font.lineHeight.body};
  resize: vertical;
  outline: none;
  transition: ${({ theme }) => theme.transition.fast};

  &::placeholder { color: ${({ theme }) => theme.color.placeholder}; }
  &:focus { border-color: ${({ theme, $status }) => $status === 'error' ? theme.color.error : theme.color.primary}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { status = 'default', fullWidth = false, ...rest },
  ref,
) {
  return <StyledTextArea ref={ref} $status={status} $fullWidth={fullWidth} {...rest} />;
});
