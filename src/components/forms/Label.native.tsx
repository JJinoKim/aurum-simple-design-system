/**
 * Label — Aurum Design System (React Native)
 */
import React from 'react';
import type { TextProps } from 'react-native';
import styled from 'styled-components/native';

export interface LabelProps extends TextProps {
  required?: boolean;
  children?: React.ReactNode;
}

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]}px;
`;
const TextEl = styled.Text`
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.sm}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.color.text};
`;
const Star = styled.Text`
  color: ${({ theme }) => theme.color.error};
  font-size: ${({ theme }) => theme.font.size.sm}px;
`;

export function Label({ required, children, ...rest }: LabelProps) {
  return (
    <Row>
      <TextEl {...rest}>{children}</TextEl>
      {required && <Star>*</Star>}
    </Row>
  );
}
