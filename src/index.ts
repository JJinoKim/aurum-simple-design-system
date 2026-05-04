/**
 * Aurum Design System — public package entry.
 *
 * Cross-platform token-first design system. Web build re-exports `*.web.tsx`
 * components; React Native consumers should import from `aurum-design-system/native`
 * or rely on Metro platform extensions to pick `*.native.tsx`.
 *
 * @example
 * ```tsx
 * import { ThemeProvider, Button, Input } from 'aurum-design-system';
 *
 * <ThemeProvider initialMode="dark">
 *   <Button variant="primary">Hello</Button>
 * </ThemeProvider>
 * ```
 */

// Tokens — raw scales + assembled themes
export * from '../tokens';

// Theme integration
export * from './theme/ThemeProvider';
export * from './theme/useTheme';
export { GlobalStyle } from './theme/GlobalStyle';
// Module augmentation for styled-components' DefaultTheme
import './theme/styled.d';

// Components
export * from './components/forms';
export * from './components/content';
export * from './components/overlays';
export * from './components/functional';
export * from './components/visual';
