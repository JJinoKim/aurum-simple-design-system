/**
 * LinearGradient — Aurum Design System (Web)
 *
 * Renders a CSS linear-gradient as a styled box. Mirrors the API of
 * react-native-linear-gradient (colors, locations, start, end) so both
 * platforms can share props.
 *
 *   <LinearGradient
 *     colors={['#0E7C7B', '#062525']}
 *     start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
 *   />
 *
 * On web the start→end vector is converted to an angle in degrees:
 *   {x:0,y:0}→{x:1,y:0}  = 90deg (left → right)
 *   {x:0,y:0}→{x:0,y:1}  = 180deg (top → bottom)  // CSS default
 *   {x:0,y:0}→{x:1,y:1}  = 135deg (top-left → bottom-right)
 */
import React from 'react';
import styled from 'styled-components';

export interface GradientPoint { x: number; y: number; }

export interface LinearGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  colors: string[];
  /** Per-stop position 0–1; length must match `colors`. */
  locations?: number[];
  start?: GradientPoint;
  end?: GradientPoint;
}

const toAngle = (s: GradientPoint, e: GradientPoint): number => {
  // Web CSS angles measure clockwise from top (180deg = top-to-bottom).
  // Convert a normalized vector to that convention.
  const dx = e.x - s.x;
  const dy = e.y - s.y;
  const rad = Math.atan2(dx, -dy); // 0 = up, +CW
  let deg = (rad * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return Math.round(deg * 100) / 100;
};

const buildStops = (colors: string[], locations?: number[]) =>
  colors.map((c, i) => {
    const stop = locations?.[i];
    return stop !== undefined ? `${c} ${stop * 100}%` : c;
  }).join(', ');

const Root = styled.div<{ $bg: string }>`
  background: ${({ $bg }) => $bg};
  display: block;
`;

export function LinearGradient({
  colors,
  locations,
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 },
  children,
  ...rest
}: LinearGradientProps) {
  const angle = toAngle(start, end);
  const stops = buildStops(colors, locations);
  const bg = `linear-gradient(${angle}deg, ${stops})`;
  return <Root $bg={bg} {...rest}>{children}</Root>;
}
