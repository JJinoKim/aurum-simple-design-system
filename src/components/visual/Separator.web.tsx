/**
 * Separator — Aurum Design System (Web)
 *
 * Visual divider. Horizontal by default; vertical for inline groups.
 * Uses `role="separator"` and `aria-orientation` for screen readers.
 */
import React from 'react';
import styled, { css } from 'styled-components';
import type { SpaceToken } from '../../tokens';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Equal margin on both sides of the line. Token name. */
  spacing?: SpaceToken;
  /** Decorative dividers are aria-hidden. Default true. */
  decorative?: boolean;
}

const Root = styled.div<{ $o: 'horizontal' | 'vertical'; $spacing?: SpaceToken }>`
  background: ${({ theme }) => theme.color.border};
  flex-shrink: 0;
  ${({ $o, theme, $spacing }) => $o === 'horizontal' ? css`
    width: 100%;
    height: 1px;
    ${$spacing !== undefined && css`margin: ${theme.space[$spacing]}px 0;`}
  ` : css`
    width: 1px;
    align-self: stretch;
    min-height: 100%;
    ${$spacing !== undefined && css`margin: 0 ${theme.space[$spacing]}px;`}
  `}
`;

export function Separator({ orientation = 'horizontal', spacing, decorative = true, ...rest }: SeparatorProps) {
  return (
    <Root
      $o={orientation}
      $spacing={spacing}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      {...rest}
    />
  );
}
