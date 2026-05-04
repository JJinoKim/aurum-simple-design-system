import { createGlobalStyle } from 'styled-components';

/**
 * Web-only global reset + body defaults. Native uses RN's per-component
 * styling and does not need this file.
 *
 * Kept intentionally minimal — Aurum does not opinionate on user-content
 * elements (`<h1>` etc.). Apps should still use `textStyle.*` recipes.
 */

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  body {
    background: ${({ theme }) => theme.color.background};
    color: ${({ theme }) => theme.color.text};
    font-family: ${({ theme }) => theme.font.family.sans};
    font-size: ${({ theme }) => theme.font.size.md}px;
    line-height: ${({ theme }) => theme.font.lineHeight.body};
    letter-spacing: ${({ theme }) => theme.font.letterSpacing.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-variant-numeric: tabular-nums;
    text-rendering: optimizeLegibility;
  }

  button, input, textarea, select {
    font: inherit;
    color: inherit;
  }

  ::selection {
    background: ${({ theme }) => theme.color.primarySubtle};
    color: ${({ theme }) => theme.color.primaryText};
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.primary};
    outline-offset: 2px;
  }
`;
