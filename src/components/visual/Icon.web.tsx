/**
 * Icon — Aurum Design System (Web)
 *
 * Thin wrapper around `lucide-react` that binds size + color to design tokens.
 * Use this everywhere instead of importing icons directly so we control the
 * default stroke weight, sizing scale, and theming.
 *
 *   import { Icon } from '@aurum/visual';
 *   import { Search } from 'lucide-react';
 *   <Icon as={Search} size="md" color="primary" />
 *
 * The `as` prop accepts any Lucide icon component (or any component that
 * receives `size`, `strokeWidth`, `color` props with the same shape).
 *
 * Loading: consumers install `lucide-react` separately. We don't bundle it —
 * tree-shaking each icon at the call site keeps payloads small.
 */
import React from 'react';
import styled from 'styled-components';
import type { Theme } from '../../../tokens';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconColorToken = 'text' | 'subtext' | 'primary' | 'success' | 'error' | 'warning' | 'inverse';

const SIZE_PX: Record<IconSize, number> = { xs: 12, sm: 14, md: 16, lg: 20, xl: 24 };

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** A Lucide icon component (e.g. `Search` from `lucide-react`). */
  as: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string; absoluteStrokeWidth?: boolean }>;
  size?: IconSize | number;
  color?: IconColorToken | string;
  /** Stroke width override. Default 1.75 — matches the system's hairline aesthetic. */
  strokeWidth?: number;
  /** When true, stroke width stays consistent regardless of `size`. */
  absoluteStrokeWidth?: boolean;
  'aria-label'?: string;
}

const Wrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 0;
`;

const colorFor = (theme: Theme, c: IconProps['color']) => {
  if (!c) return 'currentColor';
  if (c in theme.color) return (theme.color as any)[c];
  return c;
};

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(function Icon(
  { as: Component, size = 'md', color, strokeWidth = 1.75, absoluteStrokeWidth, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const px = typeof size === 'number' ? size : SIZE_PX[size];
  return (
    <Wrap
      ref={ref}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      {...rest}
    >
      <ThemeRead>
        {(theme) => (
          <Component
            size={px}
            strokeWidth={strokeWidth}
            absoluteStrokeWidth={absoluteStrokeWidth}
            color={colorFor(theme, color)}
          />
        )}
      </ThemeRead>
    </Wrap>
  );
});

// ---------------------------------------------------------------------------
// ThemeRead — read theme without nesting another styled() wrapper
// ---------------------------------------------------------------------------
const ThemeReader = styled.span`
  /* Just a context probe; render-prop pattern. */
  display: contents;
`;

function ThemeRead({ children }: { children: (theme: Theme) => React.ReactNode }) {
  // Tiny adapter: render a styled wrapper purely to grab the theme via styled-components context.
  return (
    <ThemeReader>
      <ThemeContextRender>{children}</ThemeContextRender>
    </ThemeReader>
  );
}

import { useTheme } from 'styled-components';
function ThemeContextRender({ children }: { children: (theme: Theme) => React.ReactNode }) {
  const theme = useTheme() as Theme;
  return <>{children(theme)}</>;
}

// ---------------------------------------------------------------------------
// Curated re-export — a small list of the icons we use most often
// ---------------------------------------------------------------------------
//
// Apps can either:
//   (a) import any icon directly: `import { ChevronDown } from 'lucide-react';`
//       and pass it as `<Icon as={ChevronDown} />` — preferred for tree-shaking.
//   (b) use the shortcuts in `@aurum/visual/icons` for the few we use everywhere.
//
// We don't auto-re-export the entire Lucide set (1000+ icons) because that
// would balloon bundle size. The list below stays intentionally short.
//
// To use, install lucide-react in the host app:
//   pnpm add lucide-react
//
// Then in code:
//   import { ArrowRight } from 'lucide-react';
//   <Icon as={ArrowRight} />
