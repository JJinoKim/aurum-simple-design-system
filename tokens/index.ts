/**
 * Aurum Design System — token public surface
 *
 * Web (styled-components) consumers should import the assembled themes and
 * pass them to `<ThemeProvider>`:
 *
 *     import { lightTheme, darkTheme } from '@aurum/tokens';
 *
 * RN consumers can either consume the same theme objects (numbers are RN-safe;
 * the only string values are colors and font families) or reach for the raw
 * scales:
 *
 *     import { space, radius, darkColors } from '@aurum/tokens';
 */

export * from './color';
export * from './space';
export * from './radius';
export * from './size';
export * from './typography';
export * from './shadow';
export * from './zIndex';
export * from './animation';
export * from './themes';
