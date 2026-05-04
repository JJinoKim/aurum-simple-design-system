/**
 * Form — Aurum Design System (Web)
 *
 * Layout primitives, not state. `<Form>` is a vertical stack with a default
 * gap; `<FormField>` wraps Label + control + hint with consistent spacing.
 */
import React from 'react';
import styled from 'styled-components';
import { Label } from './Label.web';
import type { ControlStatus } from './types';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  gap?: keyof typeof gapMap;
}

const gapMap = {
  tight: 3,    // 12
  default: 5,  // 24
  relaxed: 6,  // 32
} as const;

const StyledForm = styled.form<{ $gap: keyof typeof gapMap }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, $gap }) => theme.space[gapMap[$gap]]}px;
`;

export function Form({ gap = 'default', ...rest }: FormProps) {
  return <StyledForm $gap={gap} {...rest} />;
}

// ---------------------------------------------------------------------------

export interface FormFieldProps {
  label?: string;
  /** id of the control element this field labels. */
  htmlFor?: string;
  required?: boolean;
  status?: ControlStatus;
  hint?: string;
  children: React.ReactNode;
}

const FieldShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]}px;
`;

const Hint = styled.p<{ $status: ControlStatus }>`
  margin: 0;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.sm}px;
  line-height: ${({ theme }) => theme.font.lineHeight.body};
  color: ${({ theme, $status }) =>
    $status === 'error' ? theme.color.error
    : $status === 'success' ? theme.color.success
    : theme.color.subtext};
`;

export function FormField({ label, htmlFor, required, status = 'default', hint, children }: FormFieldProps) {
  return (
    <FieldShell>
      {label && <Label htmlFor={htmlFor} required={required}>{label}</Label>}
      {children}
      {hint && <Hint $status={status}>{hint}</Hint>}
    </FieldShell>
  );
}
