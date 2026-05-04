/**
 * Aurum Design System — React Native entry point.
 *
 * Identical surface to the web entry, but the build resolves `*.native.tsx`
 * sibling files. Consumers using Metro can also import from the package root
 * — Metro's platform-extension resolver picks `.native.tsx` automatically.
 */

export * from '../tokens';
export * from './theme/ThemeProvider';
export * from './theme/useTheme';

export * from './components/forms';
// Native-only re-exports (web-only modules omitted on native: GlobalStyle, Toast, etc.)
