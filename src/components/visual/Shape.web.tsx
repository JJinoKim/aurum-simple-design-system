/**
 * Square & Circle — Aurum Design System (Web)
 *
 * Aspect-locked containers. Size accepts a number (px) or a token name.
 * Use as primitives for icon tiles, color swatches, avatar placeholders, etc.
 *
 *   <Square size={40} bg="primarySubtle" />
 *   <Circle size="md"><Icon as={User} /></Circle>
 */
import React from 'react';
import styled, { css } from 'styled-components';
import type { ColorToken } from '../../tokens';

export type ShapeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

const TOKEN_PX: Record<Exclude<ShapeSize, number>, number> = {
  xs: 16, sm: 24, md: 32, lg: 48, xl: 64,
};

const sizePx = (s: ShapeSize) => (typeof s === 'number' ? s : TOKEN_PX[s]);

interface ShapeBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ShapeSize;
  /** Background fill. Token name (color.X) or raw CSS color. */
  bg?: ColorToken | string;
  /** Border (1px) using the system border color. */
  bordered?: boolean;
}

const baseCss = css<{ $size: ShapeSize; $bg?: ColorToken | string; $bordered: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => sizePx($size)}px;
  height: ${({ $size }) => sizePx($size)}px;
  flex-shrink: 0;
  background: ${({ theme, $bg }) =>
    !$bg ? theme.color.surface
    : ($bg in theme.color) ? (theme.color as any)[$bg]
    : $bg};
  ${({ $bordered, theme }) => $bordered && css`border: 1px solid ${theme.color.border};`}
  color: ${({ theme }) => theme.color.text};
`;

const SquareEl = styled.div<{ $size: ShapeSize; $bg?: ColorToken | string; $bordered: boolean; $radius: 'none' | 'xs' | 'sm' | 'md' }>`
  ${baseCss}
  border-radius: ${({ theme, $radius }) => $radius === 'none' ? '0' : `${theme.radius[$radius]}px`};
`;

export interface SquareProps extends ShapeBaseProps {
  /** Corner rounding. Defaults to xs. */
  radius?: 'none' | 'xs' | 'sm' | 'md';
}

export function Square({ size = 'md', bg, bordered = false, radius = 'xs', children, ...rest }: SquareProps) {
  return (
    <SquareEl $size={size} $bg={bg} $bordered={bordered} $radius={radius} {...rest}>
      {children}
    </SquareEl>
  );
}

const CircleEl = styled.div<{ $size: ShapeSize; $bg?: ColorToken | string; $bordered: boolean }>`
  ${baseCss}
  border-radius: 50%;
`;

export interface CircleProps extends ShapeBaseProps {}

export function Circle({ size = 'md', bg, bordered = false, children, ...rest }: CircleProps) {
  return (
    <CircleEl $size={size} $bg={bg} $bordered={bordered} {...rest}>
      {children}
    </CircleEl>
  );
}
