/**
 * Image — Aurum Design System (Web)
 *
 * Wraps <img> with consistent rounding, aspect-ratio control, lazy loading by
 * default, and a placeholder fallback for empty/errored sources.
 */
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import type { RadiusToken } from '../../../tokens';

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  /** Token name (xs/sm/md/lg/xl/full) or pixel value. Defaults to 'sm'. */
  radius?: RadiusToken | 'none';
  /** Constrain to an explicit aspect ratio, e.g. "16/9". */
  aspect?: string;
  /** object-fit value. Defaults to 'cover'. */
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Native lazy-load attribute. Default 'lazy'. */
  loading?: 'lazy' | 'eager';
}

const radiusFor = (r: RadiusToken | 'none' | undefined, theme: any) => {
  if (!r || r === 'none') return '0';
  if (r === 'full') return '9999px';
  return `${theme.radius[r]}px`;
};

const Wrap = styled.div<{ $radius: ImageProps['radius']; $aspect?: string }>`
  position: relative;
  display: block;
  overflow: hidden;
  background: ${({ theme }) => theme.color.surface};
  border-radius: ${({ theme, $radius }) => radiusFor($radius, theme)};
  ${({ $aspect }) => $aspect && css`aspect-ratio: ${$aspect};`}
`;

const Img = styled.img<{ $fit: ImageProps['fit'] }>`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: ${({ $fit }) => $fit};
`;

const Fallback = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.color.subtext};
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.sm}px;
  background: repeating-linear-gradient(
    45deg,
    transparent 0 8px,
    ${({ theme }) => theme.color.border} 8px 9px
  );
`;

export function Image({ radius = 'sm', aspect, fit = 'cover', loading = 'lazy', src, alt, ...rest }: ImageProps) {
  const [errored, setErrored] = useState(false);
  return (
    <Wrap $radius={radius} $aspect={aspect}>
      {src && !errored ? (
        <Img $fit={fit} src={src} alt={alt ?? ''} loading={loading} onError={() => setErrored(true)} {...rest} />
      ) : (
        <Fallback aria-label={alt}>{alt ?? 'Image'}</Fallback>
      )}
    </Wrap>
  );
}
