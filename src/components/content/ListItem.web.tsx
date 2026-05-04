/**
 * ListItem — Aurum Design System (Web)
 *
 * Single row in a list. Slots: leading (avatar/icon), title + subtitle, trailing
 * (chevron, action, meta). Pass `as="button"` or `onClick` to make it interactive.
 *
 *   <ListItem
 *     leading={<Avatar size="sm" name="Maya" />}
 *     title="Maya Chen"
 *     subtitle="Owner · last active 14m ago"
 *     trailing={<Chevron />}
 *     onClick={...}
 *   />
 */
import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

export interface ListItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Visually highlights the row (e.g. selected in a menu). */
  selected?: boolean;
  /** Disables interactions. */
  disabled?: boolean;
  /** Override the rendered element. Defaults to 'div', or 'button' if onClick is provided. */
  as?: keyof JSX.IntrinsicElements;
  density?: 'compact' | 'comfortable';
}

const Row = styled.div<{ $selected: boolean; $disabled: boolean; $interactive: boolean; $density: 'compact' | 'comfortable' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]}px;
  padding: ${({ $density, theme }) => ($density === 'compact' ? `${theme.space[2]}px ${theme.space[3]}px` : `${theme.space[3]}px ${theme.space[4]}px`)};
  width: 100%;
  text-align: left;
  background: ${({ $selected, theme }) => ($selected ? theme.color.primarySubtle : 'transparent')};
  color: ${({ theme }) => theme.color.text};
  border: 0;
  font-family: ${({ theme }) => theme.font.family.sans};
  ${({ $interactive, theme }) => $interactive && css`
    cursor: pointer;
    transition: ${theme.transition.fast};
    &:hover { background: ${theme.color.surface}; }
    &:focus-visible { outline: 2px solid ${theme.color.primary}; outline-offset: -2px; }
  `}
  ${({ $disabled }) => $disabled && css`opacity: 0.5; pointer-events: none;`}
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
const TitleEl = styled.span`
  font-size: ${({ theme }) => theme.font.size.md}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.color.text};
  line-height: ${({ theme }) => theme.font.lineHeight.heading};
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;
const SubtitleEl = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm}px;
  color: ${({ theme }) => theme.color.subtext};
  line-height: ${({ theme }) => theme.font.lineHeight.body};
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

const Leading = styled.div`flex-shrink: 0; display: flex; align-items: center;`;
const Trailing = styled.div`flex-shrink: 0; display: flex; align-items: center; gap: ${({ theme }) => theme.space[2]}px; color: ${({ theme }) => theme.color.subtext};`;

export const ListItem = forwardRef<HTMLElement, ListItemProps>(function ListItem(
  { leading, title, subtitle, trailing, selected = false, disabled = false, density = 'comfortable', as, onClick, ...rest },
  ref,
) {
  const interactive = !!onClick || as === 'button' || as === 'a';
  const Tag = (as ?? (interactive ? 'button' : 'div')) as any;
  return (
    <Row
      as={Tag}
      ref={ref as any}
      role={Tag === 'div' && interactive ? 'button' : undefined}
      $selected={selected}
      $disabled={disabled}
      $interactive={interactive}
      $density={density}
      onClick={onClick as any}
      {...rest}
    >
      {leading && <Leading>{leading}</Leading>}
      <Body>
        <TitleEl>{title}</TitleEl>
        {subtitle && <SubtitleEl>{subtitle}</SubtitleEl>}
      </Body>
      {trailing && <Trailing>{trailing}</Trailing>}
    </Row>
  );
});

export const ListItemSeparator = styled.hr`
  margin: 0;
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.color.border};
`;
