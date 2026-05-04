/**
 * Form + FormField — Aurum Design System (React Native)
 */
import React from 'react';
import type { ViewProps } from 'react-native';
import styled from 'styled-components/native';
import { Label } from './Label.native';
import type { ControlStatus } from './types';

const gapMap = { tight: 3, default: 5, relaxed: 6 } as const;

export interface FormProps extends ViewProps {
  gap?: keyof typeof gapMap;
  children?: React.ReactNode;
}

const Stack = styled.View<{ $gap: keyof typeof gapMap }>`
  flex-direction: column;
  gap: ${({ theme, $gap }) => theme.space[gapMap[$gap]]}px;
`;

export function Form({ gap = 'default', children, ...rest }: FormProps) {
  return <Stack $gap={gap} {...rest}>{children}</Stack>;
}

// ---------------------------------------------------------------------------

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  status?: ControlStatus;
  hint?: string;
  children: React.ReactNode;
}

const FieldShell = styled.View`
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]}px;
`;

const HintText = styled.Text<{ $status: ControlStatus }>`
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.sm}px;
  color: ${({ theme, $status }) =>
    $status === 'error' ? theme.color.error
    : $status === 'success' ? theme.color.success
    : theme.color.subtext};
`;

export function FormField({ label, required, status = 'default', hint, children }: FormFieldProps) {
  return (
    <FieldShell>
      {label && <Label required={required}>{label}</Label>}
      {children}
      {hint && <HintText $status={status}>{hint}</HintText>}
    </FieldShell>
  );
}
