import { defineConfig } from 'tsup';

/**
 * Aurum build pipeline.
 *
 * - `index` — full web bundle (tokens + ThemeProvider + all `.web.tsx` components).
 * - `tokens` — token-only entry. Zero React deps; safe for design-token tooling
 *   (Style Dictionary, Tailwind plugin authors, RN-only consumers, etc.).
 * - `native` — React Native bundle. Imports `*.native.tsx` siblings via the
 *   `loader` rule below; exposes the same component names as the web entry.
 *
 * tsup wraps esbuild and emits CJS + ESM + .d.ts in one pass. Externalized
 * peers stay in package.json so consumers' bundlers dedupe React/styled-components.
 */
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    tokens: 'tokens/index.ts',
    native: 'src/native.ts',
  },
  format: ['cjs', 'esm'],
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.mjs' }),
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: 'es2020',
  external: [
    'react',
    'react-dom',
    'react-native',
    'styled-components',
    'styled-components/native',
  ],
});
