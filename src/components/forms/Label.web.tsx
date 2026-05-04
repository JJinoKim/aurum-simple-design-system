/**
 * Label — Aurum Design System (Web)
 *
 * Pairs with any field. Renders a small uppercase-ish label and a `*`
 * indicator when `required`. Uses the `caption`/`label` text recipe.
 */
import React from 'react';
import styled from 'styled-components';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  /** When false, the label is only readable by AT (visually hidden). */
  visible?: boolean;
}

const StyledLabel = styled.label<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? 'inline-flex' : 'none')};
  align-items: center;
  gap: ${({ theme }) => theme.space[1]}px;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.sm}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  line-height: ${({ theme }) => theme.font.lineHeight.body};
  color: ${({ theme }) => theme.color.text};
  user-select: none;
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.color.error};
  font-weight: ${({ theme }) => theme.font.weight.regular};
`;

export function Label({ required, visible = true, children, ...rest }: LabelProps) {
  return (
    <StyledLabel $visible={visible} {...rest}>
      {children}
      {required && <RequiredMark aria-hidden="true">*</RequiredMark>}
    </StyledLabel>
  );
}
