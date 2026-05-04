/**
 * Avatar — Aurum Design System (Web)
 *
 * Circular image with fallback. Size 24/32/40/56. Falls back to initials when
 * `src` is missing or fails to load. Wrap in <AvatarGroup> to stack.
 */
import React, { useState } from 'react';
import styled from 'styled-components';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

const SIZE: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 56 };
const FONT: Record<AvatarSize, number> = { xs: 10, sm: 12, md: 14, lg: 18 };

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  size?: AvatarSize;
  src?: string;
  alt?: string;
  /** Initials shown when no image available. Auto-derived from `name` if omitted. */
  initials?: string;
  /** Person/team name; used to derive initials and a stable color. */
  name?: string;
  /** Status dot in the bottom-right. */
  status?: 'online' | 'busy' | 'offline';
}

const Root = styled.span<{ $size: AvatarSize }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => SIZE[$size]}px;
  height: ${({ $size }) => SIZE[$size]}px;
  border-radius: 50%;
  overflow: hidden;
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ $size }) => FONT[$size]}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  user-select: none;
  flex-shrink: 0;
`;

const Img = styled.img`
  width: 100%; height: 100%; object-fit: cover; display: block;
`;

const Dot = styled.span<{ $kind: 'online' | 'busy' | 'offline'; $size: AvatarSize }>`
  position: absolute;
  right: 0;
  bottom: 0;
  width: ${({ $size }) => Math.max(8, Math.round(SIZE[$size] * 0.25))}px;
  height: ${({ $size }) => Math.max(8, Math.round(SIZE[$size] * 0.25))}px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.color.background};
  background: ${({ theme, $kind }) =>
    $kind === 'online' ? theme.color.success
    : $kind === 'busy' ? theme.color.error
    : theme.color.subtext};
`;

const initialsFromName = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('');

export function Avatar({ size = 'md', src, alt, initials, name, status, ...rest }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImg = src && !errored;
  const text = initials ?? (name ? initialsFromName(name) : '');
  return (
    <Root $size={size} role="img" aria-label={alt ?? name ?? 'Avatar'} {...rest}>
      {showImg
        ? <Img src={src} alt={alt ?? name ?? ''} onError={() => setErrored(true)} />
        : <span aria-hidden="true">{text || '?'}</span>}
      {status && <Dot $kind={status} $size={size} />}
    </Root>
  );
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visible cap; remainder shown as "+N". */
  max?: number;
}

const Group = styled.div`
  display: inline-flex;
  & > * + * { margin-left: -8px; }
  & > * { box-shadow: 0 0 0 2px ${({ theme }) => theme.color.background}; }
`;

const More = styled(Root)`
  font-size: ${({ theme }) => theme.font.size.sm}px;
  color: ${({ theme }) => theme.color.subtext};
`;

export function AvatarGroup({ max, children, ...rest }: AvatarGroupProps) {
  const arr = React.Children.toArray(children);
  const shown = max ? arr.slice(0, max) : arr;
  const overflow = max ? arr.length - shown.length : 0;
  return (
    <Group {...rest}>
      {shown}
      {overflow > 0 && <More $size="md" aria-label={`${overflow} more`}>+{overflow}</More>}
    </Group>
  );
}
