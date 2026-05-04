/**
 * Card — Aurum Design System (Web)
 *
 * Container surface with consistent radius + border. Compose with Card.Header,
 * Card.Body, Card.Footer for vertical sections, or render arbitrary children.
 *
 *   <Card>
 *     <Card.Header title="Q3 retro" subtitle="Last edited 14m ago" />
 *     <Card.Body>...</Card.Body>
 *     <Card.Footer>...</Card.Footer>
 *   </Card>
 */
import React from 'react';
import styled, { css } from 'styled-components';

export type CardElevation = 'flat' | 'raised';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation;
  /** Default body padding for the card. Sections override individually. */
  padding?: CardPadding;
  /** Becomes a clickable surface with hover affordance. */
  interactive?: boolean;
}

const padMap = {
  none: '0px',
  sm: 'var(--pad-sm)',
  md: 'var(--pad-md)',
  lg: 'var(--pad-lg)',
};

const Root = styled.div<{ $elev: CardElevation; $pad: CardPadding; $interactive: boolean }>`
  --pad-sm: ${({ theme }) => theme.space[3]}px;
  --pad-md: ${({ theme }) => theme.space[4]}px;
  --pad-lg: ${({ theme }) => theme.space[5]}px;
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.font.family.sans};
  ${({ $elev, theme }) => $elev === 'raised' && css`box-shadow: ${theme.shadow.sm};`}
  ${({ $interactive, theme }) => $interactive && css`
    cursor: pointer;
    transition: ${theme.transition.fast};
    &:hover { border-color: ${theme.color.subtext}; box-shadow: ${theme.shadow.sm}; }
    &:focus-visible { outline: 2px solid ${theme.color.primary}; outline-offset: 2px; }
  `}
  /* Default padding applies only to direct content, not sections */
  & > :not(header):not(footer):not([data-card-section]) {
    padding: ${({ $pad }) => padMap[$pad]};
  }
`;

const Header = styled.header<{ $bordered: boolean }>`
  padding: ${({ theme }) => theme.space[4]}px;
  ${({ $bordered, theme }) => $bordered && css`border-bottom: 1px solid ${theme.color.border};`}
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]}px;
`;

const HeaderText = styled.div`flex: 1; min-width: 0;`;
const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.lg}px;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.color.text};
  line-height: ${({ theme }) => theme.font.lineHeight.heading};
  letter-spacing: -0.01em;
`;
const Subtitle = styled.p`
  margin: 2px 0 0;
  font-size: ${({ theme }) => theme.font.size.sm}px;
  color: ${({ theme }) => theme.color.subtext};
`;

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  bordered?: boolean;
}

const CardHeader = ({ title, subtitle, actions, bordered = false, children, ...rest }: CardHeaderProps) => (
  <Header $bordered={bordered} {...rest}>
    {(title || subtitle) && (
      <HeaderText>
        {title && <Title>{title}</Title>}
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </HeaderText>
    )}
    {children}
    {actions && <div>{actions}</div>}
  </Header>
);

const Body = styled.div.attrs<{ 'data-card-section': string }>({ 'data-card-section': '' })`
  padding: ${({ theme }) => theme.space[4]}px;
  font-size: ${({ theme }) => theme.font.size.md}px;
  line-height: ${({ theme }) => theme.font.lineHeight.body};
  color: ${({ theme }) => theme.color.text};
`;

const Footer = styled.footer`
  padding: ${({ theme }) => theme.space[4]}px;
  border-top: 1px solid ${({ theme }) => theme.color.border};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[2]}px;
`;

export function Card({ elevation = 'flat', padding = 'none', interactive = false, children, ...rest }: CardProps) {
  return (
    <Root $elev={elevation} $pad={padding} $interactive={interactive} tabIndex={interactive ? 0 : undefined} {...rest}>
      {children}
    </Root>
  );
}

Card.Header = CardHeader;
Card.Body = Body;
Card.Footer = Footer;
