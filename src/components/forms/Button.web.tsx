/**
 * Button — Aurum Design System (Web)
 *
 * Variants: primary (filled teal), secondary (neutral card), ghost (text only),
 * danger (filled red). Three sizes. No animations beyond color transitions.
 */
import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import type { ControlSize, ControlVariant } from './types';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ControlSize;
  variant?: ControlVariant;
  /** Stretch to fill parent width. */
  fullWidth?: boolean;
  /** Optional icon node — rendered before the children. */
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  /** Loading replaces interaction with a spinner; preserves width. */
  loading?: boolean;
}

const sizeStyles = {
  sm: css`
    height: ${({ theme }) => theme.size.controlSm}px;
    padding: 0 ${({ theme }) => theme.space[3]}px;
    font-size: ${({ theme }) => theme.font.size.sm}px;
    border-radius: ${({ theme }) => theme.radius.sm}px;
    gap: ${({ theme }) => theme.space[1]}px;
  `,
  md: css`
    height: ${({ theme }) => theme.size.controlMd}px;
    padding: 0 ${({ theme }) => theme.space[4]}px;
    font-size: ${({ theme }) => theme.font.size.md}px;
    border-radius: ${({ theme }) => theme.radius.sm}px;
    gap: ${({ theme }) => theme.space[2]}px;
  `,
  lg: css`
    height: ${({ theme }) => theme.size.controlLg}px;
    padding: 0 ${({ theme }) => theme.space[5]}px;
    font-size: ${({ theme }) => theme.font.size.md}px;
    border-radius: ${({ theme }) => theme.radius.sm}px;
    gap: ${({ theme }) => theme.space[2]}px;
  `,
};

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.color.primary};
    color: #fff;
    border-color: ${({ theme }) => theme.color.primary};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.color.primaryHover}; border-color: ${({ theme }) => theme.color.primaryHover}; }
    &:active:not(:disabled) { opacity: 0.9; }
  `,
  secondary: css`
    background: ${({ theme }) => theme.color.card};
    color: ${({ theme }) => theme.color.text};
    border-color: ${({ theme }) => theme.color.border};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.color.surface}; }
    &:active:not(:disabled) { opacity: 0.85; }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.color.text};
    border-color: transparent;
    &:hover:not(:disabled) { background: ${({ theme }) => theme.color.surface}; }
    &:active:not(:disabled) { opacity: 0.85; }
  `,
  danger: css`
    background: ${({ theme }) => theme.color.error};
    color: #fff;
    border-color: ${({ theme }) => theme.color.error};
    &:hover:not(:disabled) { filter: brightness(0.92); }
    &:active:not(:disabled) { opacity: 0.9; }
  `,
};

const StyledButton = styled.button<{
  $size: ControlSize;
  $variant: ControlVariant;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  letter-spacing: 0;
  border: 1px solid;
  cursor: pointer;
  user-select: none;
  transition: ${({ theme }) => theme.transition.fast};
  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.primary};
    outline-offset: 2px;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Spinner = styled.span`
  width: 14px;
  height: 14px;
  border: 1.5px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: aurum-spin 0.7s linear infinite;
  @keyframes aurum-spin { to { transform: rotate(360deg); } }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { size = 'md', variant = 'primary', fullWidth = false, iconBefore, iconAfter, loading, disabled, children, ...rest },
  ref,
) {
  return (
    <StyledButton
      ref={ref}
      $size={size}
      $variant={variant}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Spinner /> : iconBefore}
      {children}
      {!loading && iconAfter}
    </StyledButton>
  );
});
