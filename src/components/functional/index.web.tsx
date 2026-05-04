/**
 * Functional primitives — Aurum Design System (Web)
 *
 * Headless utilities used by other components and by app-level code. None of
 * these render visible chrome; they exist to make the rest of the system
 * composable and accessible.
 */

// ===========================================================================
// HTML Elements — themed Box / Stack / Text primitives
// ===========================================================================

import React, { createContext, forwardRef, useCallback, useContext, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import type { SpaceToken, RadiusToken } from '../../../tokens';

type Token = keyof any;

interface BoxStyleProps {
  p?: SpaceToken; px?: SpaceToken; py?: SpaceToken;
  pt?: SpaceToken; pr?: SpaceToken; pb?: SpaceToken; pl?: SpaceToken;
  m?: SpaceToken; mx?: SpaceToken | 'auto'; my?: SpaceToken;
  mt?: SpaceToken; mr?: SpaceToken; mb?: SpaceToken; ml?: SpaceToken;
  bg?: 'background' | 'surface' | 'card' | 'transparent';
  radius?: RadiusToken | 'none' | 'full';
  bordered?: boolean;
  fullWidth?: boolean;
}

const sp = (theme: any, t?: SpaceToken) => (t === undefined ? undefined : `${theme.space[t]}px`);
const radiusFor = (r: any, theme: any) => (r === undefined || r === 'none') ? undefined : r === 'full' ? '9999px' : `${theme.radius[r]}px`;

const boxCss = css<BoxStyleProps>`
  ${({ theme, p })  => p  !== undefined && `padding: ${sp(theme, p)};`}
  ${({ theme, px }) => px !== undefined && `padding-left: ${sp(theme, px)}; padding-right: ${sp(theme, px)};`}
  ${({ theme, py }) => py !== undefined && `padding-top: ${sp(theme, py)}; padding-bottom: ${sp(theme, py)};`}
  ${({ theme, pt }) => pt !== undefined && `padding-top: ${sp(theme, pt)};`}
  ${({ theme, pr }) => pr !== undefined && `padding-right: ${sp(theme, pr)};`}
  ${({ theme, pb }) => pb !== undefined && `padding-bottom: ${sp(theme, pb)};`}
  ${({ theme, pl }) => pl !== undefined && `padding-left: ${sp(theme, pl)};`}
  ${({ theme, m })  => m  !== undefined && `margin: ${sp(theme, m)};`}
  ${({ theme, mx }) => mx !== undefined && `margin-left: ${mx === 'auto' ? 'auto' : sp(theme, mx as SpaceToken)}; margin-right: ${mx === 'auto' ? 'auto' : sp(theme, mx as SpaceToken)};`}
  ${({ theme, my }) => my !== undefined && `margin-top: ${sp(theme, my)}; margin-bottom: ${sp(theme, my)};`}
  ${({ theme, mt }) => mt !== undefined && `margin-top: ${sp(theme, mt)};`}
  ${({ theme, mr }) => mr !== undefined && `margin-right: ${sp(theme, mr)};`}
  ${({ theme, mb }) => mb !== undefined && `margin-bottom: ${sp(theme, mb)};`}
  ${({ theme, ml }) => ml !== undefined && `margin-left: ${sp(theme, ml)};`}
  ${({ theme, bg }) => bg && `background: ${bg === 'transparent' ? 'transparent' : (theme.color as any)[bg]};`}
  ${({ theme, radius }) => radius !== undefined && `border-radius: ${radiusFor(radius, theme)};`}
  ${({ theme, bordered }) => bordered && `border: 1px solid ${theme.color.border};`}
  ${({ fullWidth }) => fullWidth && `width: 100%;`}
`;

export const Box = styled.div<BoxStyleProps>`${boxCss}`;

export interface StackProps extends BoxStyleProps {
  gap?: SpaceToken;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
}

const justifyMap = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between', around: 'space-around' };
const alignMap = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' };

export const HStack = styled.div<StackProps>`
  display: flex;
  flex-direction: row;
  ${({ theme, gap }) => gap !== undefined && `gap: ${sp(theme, gap)};`}
  ${({ align }) => align && `align-items: ${alignMap[align]};`}
  ${({ justify }) => justify && `justify-content: ${justifyMap[justify]};`}
  ${({ wrap }) => wrap && `flex-wrap: wrap;`}
  ${boxCss}
`;

export const VStack = styled.div<StackProps>`
  display: flex;
  flex-direction: column;
  ${({ theme, gap }) => gap !== undefined && `gap: ${sp(theme, gap)};`}
  ${({ align }) => align && `align-items: ${alignMap[align]};`}
  ${({ justify }) => justify && `justify-content: ${justifyMap[justify]};`}
  ${boxCss}
`;

// ===========================================================================
// Text — typed text primitive bound to typography tokens
// ===========================================================================

export type TextVariant = 'displayLg' | 'displayMd' | 'displaySm' | 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption' | 'mono';

const variantCss: Record<TextVariant, ReturnType<typeof css>> = {
  displayLg: css`font-size: ${({ theme }) => theme.font.size['5xl']}px; font-weight: ${({ theme }) => theme.font.weight.semibold}; line-height: ${({ theme }) => theme.font.lineHeight.display}; letter-spacing: -0.02em;`,
  displayMd: css`font-size: ${({ theme }) => theme.font.size['4xl']}px; font-weight: ${({ theme }) => theme.font.weight.semibold}; line-height: ${({ theme }) => theme.font.lineHeight.display}; letter-spacing: -0.015em;`,
  displaySm: css`font-size: ${({ theme }) => theme.font.size['3xl']}px; font-weight: ${({ theme }) => theme.font.weight.semibold}; line-height: ${({ theme }) => theme.font.lineHeight.display}; letter-spacing: -0.01em;`,
  h1:        css`font-size: ${({ theme }) => theme.font.size['2xl']}px; font-weight: ${({ theme }) => theme.font.weight.semibold}; line-height: ${({ theme }) => theme.font.lineHeight.heading};`,
  h2:        css`font-size: ${({ theme }) => theme.font.size.xl}px; font-weight: ${({ theme }) => theme.font.weight.semibold}; line-height: ${({ theme }) => theme.font.lineHeight.heading};`,
  h3:        css`font-size: ${({ theme }) => theme.font.size.lg}px; font-weight: ${({ theme }) => theme.font.weight.medium}; line-height: ${({ theme }) => theme.font.lineHeight.heading};`,
  body:      css`font-size: ${({ theme }) => theme.font.size.md}px; line-height: ${({ theme }) => theme.font.lineHeight.body};`,
  small:     css`font-size: ${({ theme }) => theme.font.size.sm}px; line-height: ${({ theme }) => theme.font.lineHeight.body};`,
  caption:   css`font-size: ${({ theme }) => theme.font.size.xs}px; line-height: ${({ theme }) => theme.font.lineHeight.body}; color: ${({ theme }) => theme.color.subtext};`,
  mono:      css`font-family: ${({ theme }) => theme.font.family.mono}; font-size: ${({ theme }) => theme.font.size.sm}px;`,
};

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  color?: 'text' | 'subtext' | 'primary' | 'success' | 'error' | 'warning';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  truncate?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

const TextEl = styled.span<TextProps>`
  margin: 0;
  font-family: ${({ theme }) => theme.font.family.sans};
  color: ${({ theme }) => theme.color.text};
  ${({ variant = 'body' }) => variantCss[variant]}
  ${({ theme, color }) => color && `color: ${(theme.color as any)[color]};`}
  ${({ theme, weight }) => weight && `font-weight: ${theme.font.weight[weight]};`}
  ${({ align }) => align && `text-align: ${align};`}
  ${({ truncate }) => truncate && `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`}
`;

export const Text = forwardRef<HTMLElement, TextProps>(function Text({ as = 'span', ...rest }, ref) {
  return <TextEl as={as as any} ref={ref as any} {...rest} />;
});

// ===========================================================================
// Anchor — semantic <a>, themed
// ===========================================================================

export interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  underline?: 'always' | 'hover' | 'none';
  external?: boolean;
}

const AnchorEl = styled.a<{ $u: AnchorProps['underline'] }>`
  color: ${({ theme }) => theme.color.primaryText};
  text-decoration: ${({ $u }) => ($u === 'always' ? 'underline' : 'none')};
  font: inherit;
  transition: ${({ theme }) => theme.transition.fast};
  &:hover { text-decoration: ${({ $u }) => ($u === 'none' ? 'none' : 'underline')}; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.color.primary}; outline-offset: 2px; border-radius: 2px; }
`;

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(function Anchor({ underline = 'hover', external, target, rel, ...rest }, ref) {
  const isExt = external ?? (typeof rest.href === 'string' && /^https?:\/\//.test(rest.href));
  return (
    <AnchorEl
      ref={ref}
      $u={underline}
      target={target ?? (isExt ? '_blank' : undefined)}
      rel={rel ?? (isExt ? 'noopener noreferrer' : undefined)}
      {...rest}
    />
  );
});

// ===========================================================================
// Group — visually-joined cluster (e.g. ToggleGroup-like collapsed borders)
// ===========================================================================

export interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Collapse adjacent borders so children look like one connected control. */
  attached?: boolean;
  gap?: SpaceToken;
}

export const Group = styled.div<{ $o: 'horizontal' | 'vertical'; $attached: boolean; $gap?: SpaceToken }>`
  display: inline-flex;
  flex-direction: ${({ $o }) => ($o === 'vertical' ? 'column' : 'row')};
  ${({ theme, $gap, $attached }) => !$attached && $gap !== undefined && `gap: ${sp(theme, $gap)};`}
  ${({ $o, $attached }) => $attached && css`
    & > * { border-radius: 0; }
    ${$o === 'horizontal' ? css`
      & > *:not(:first-child) { margin-left: -1px; }
      & > *:first-child { border-top-left-radius: ${({ theme }) => theme.radius.sm}px; border-bottom-left-radius: ${({ theme }) => theme.radius.sm}px; }
      & > *:last-child  { border-top-right-radius: ${({ theme }) => theme.radius.sm}px; border-bottom-right-radius: ${({ theme }) => theme.radius.sm}px; }
    ` : css`
      & > *:not(:first-child) { margin-top: -1px; }
      & > *:first-child { border-top-left-radius: ${({ theme }) => theme.radius.sm}px; border-top-right-radius: ${({ theme }) => theme.radius.sm}px; }
      & > *:last-child  { border-bottom-left-radius: ${({ theme }) => theme.radius.sm}px; border-bottom-right-radius: ${({ theme }) => theme.radius.sm}px; }
    `}
    & > *:hover, & > *:focus-visible { z-index: 1; }
  `}
` as any;

(Group as any).defaultProps = { $o: 'horizontal', $attached: false };

// Friendly props wrapper so consumers don't write $-prefixed transient props
export const GroupBox = ({ orientation = 'horizontal', attached = false, gap, children, ...rest }: GroupProps) => (
  <Group $o={orientation} $attached={attached} $gap={gap} {...rest}>{children}</Group>
);

// ===========================================================================
// Unspaced — escape hatch that strips spacing from a single child
// ===========================================================================

/**
 * Renders children inside a wrapper that resets margins. Useful inside Stacks
 * where you want one item to bleed past the gap (e.g. a full-bleed image
 * inside a padded Card body).
 */
export const Unspaced = styled.div`
  margin: 0 !important;
  & > * { margin: 0 !important; }
`;

// ===========================================================================
// VisuallyHidden — accessible-but-invisible content
// ===========================================================================

/**
 * Hides content visually while keeping it available to screen readers.
 * Standard "sr-only" pattern.
 */
export const VisuallyHidden = styled.span`
  position: absolute !important;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// ===========================================================================
// Portal — renders children into document.body (or a custom container)
// ===========================================================================

export interface PortalProps {
  /** Override portal target. Defaults to document.body. */
  container?: Element | null;
  children: React.ReactNode;
}

export function Portal({ container, children }: PortalProps) {
  if (typeof document === 'undefined') return null;
  return createPortal(children, container ?? document.body);
}

// ===========================================================================
// FocusScope — traps focus inside the rendered subtree
// ===========================================================================

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export interface FocusScopeProps {
  /** Trap focus within children. Tab cycles, Shift+Tab reverses. Default true. */
  trap?: boolean;
  /** Auto-focus the first focusable on mount. Default true. */
  autoFocus?: boolean;
  /** Restore focus to the element that was active before mount. Default true. */
  restoreFocus?: boolean;
  children: React.ReactElement;
}

/**
 * Headless focus management for modals/popovers. Use as a wrapper inside
 * Dialog.Content, Popover.Content, etc. Doesn't render any DOM of its own.
 */
export function FocusScope({ trap = true, autoFocus = true, restoreFocus = true, children }: FocusScopeProps) {
  const ref = useRef<HTMLElement>(null);
  const previousActive = useRef<Element | null>(null);

  useEffect(() => {
    previousActive.current = document.activeElement;
    if (autoFocus && ref.current) {
      const first = ref.current.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? ref.current).focus();
    }
    return () => {
      if (restoreFocus && previousActive.current instanceof HTMLElement) {
        previousActive.current.focus();
      }
    };
  }, [autoFocus, restoreFocus]);

  useEffect(() => {
    if (!trap) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !ref.current) return;
      const focusables = ref.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusables.length === 0) { e.preventDefault(); return; }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [trap]);

  return React.cloneElement(children, {
    ref: (node: HTMLElement) => {
      (ref as any).current = node;
      const r = (children as any).ref;
      if (typeof r === 'function') r(node);
      else if (r && 'current' in r) (r as any).current = node;
    },
    tabIndex: children.props.tabIndex ?? -1,
  } as any);
}

// ===========================================================================
// RovingFocusGroup — single tab stop per group, arrow keys to navigate
// ===========================================================================

interface RovingCtx {
  orientation: 'horizontal' | 'vertical' | 'both';
  loop: boolean;
  current: string | null;
  setCurrent: (id: string) => void;
  register: (id: string, node: HTMLElement) => void;
  unregister: (id: string) => void;
}
const RovingContext = createContext<RovingCtx | null>(null);

export interface RovingFocusGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical' | 'both';
  /** Wrap from last item back to first. Default true. */
  loop?: boolean;
  /** Initially-focused item id. Defaults to the first registered. */
  defaultValue?: string;
  children: React.ReactNode;
}

/**
 * Implements WAI-ARIA roving tabindex: only one descendant has tabIndex=0 at
 * a time; arrow keys move it. Children must be wrapped with `useRovingItem`.
 */
export function RovingFocusGroup({
  orientation = 'horizontal', loop = true, defaultValue,
  children, ...rest
}: RovingFocusGroupProps) {
  const items = useRef<Map<string, HTMLElement>>(new Map());
  const order = useRef<string[]>([]);
  const [current, setCurrentState] = React.useState<string | null>(defaultValue ?? null);

  const register = useCallback((id: string, node: HTMLElement) => {
    items.current.set(id, node);
    if (!order.current.includes(id)) order.current.push(id);
    setCurrentState(prev => prev ?? id);
  }, []);
  const unregister = useCallback((id: string) => {
    items.current.delete(id);
    order.current = order.current.filter(x => x !== id);
  }, []);
  const setCurrent = useCallback((id: string) => {
    setCurrentState(id);
    items.current.get(id)?.focus();
  }, []);

  const move = (delta: 1 | -1) => {
    const ids = order.current;
    if (ids.length === 0) return;
    const idx = current ? ids.indexOf(current) : 0;
    let next = idx + delta;
    if (next < 0) next = loop ? ids.length - 1 : 0;
    if (next >= ids.length) next = loop ? 0 : ids.length - 1;
    setCurrent(ids[next]!);
  };

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    const horizontal = orientation === 'horizontal' || orientation === 'both';
    const vertical = orientation === 'vertical' || orientation === 'both';
    if (horizontal && e.key === 'ArrowRight') { e.preventDefault(); move(1); }
    if (horizontal && e.key === 'ArrowLeft')  { e.preventDefault(); move(-1); }
    if (vertical && e.key === 'ArrowDown')    { e.preventDefault(); move(1); }
    if (vertical && e.key === 'ArrowUp')      { e.preventDefault(); move(-1); }
    if (e.key === 'Home') { e.preventDefault(); const id = order.current[0]; if (id) setCurrent(id); }
    if (e.key === 'End')  { e.preventDefault(); const id = order.current[order.current.length - 1]; if (id) setCurrent(id); }
  };

  return (
    <RovingContext.Provider value={{ orientation, loop, current, setCurrent, register, unregister }}>
      <div onKeyDown={onKeyDown} {...rest}>{children}</div>
    </RovingContext.Provider>
  );
}

/**
 * Hook for items inside a RovingFocusGroup. Returns props to spread on the
 * focusable element: a stable id, tabIndex (0 only for the active item), and
 * a focus handler that promotes the item.
 */
export function useRovingItem(id?: string) {
  const ctx = useContext(RovingContext);
  const auto = useId();
  const itemId = id ?? auto;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ctx || !ref.current) return;
    ctx.register(itemId, ref.current);
    return () => ctx.unregister(itemId);
  }, [ctx, itemId]);

  if (!ctx) {
    return { ref, tabIndex: 0, onFocus: undefined as any, 'data-roving-id': itemId };
  }

  const isActive = ctx.current === itemId;
  return {
    ref,
    tabIndex: isActive ? 0 : -1,
    onFocus: () => ctx.setCurrent(itemId),
    'data-roving-id': itemId,
  };
}

// ===========================================================================
// ScrollView — themed scroll container with optional scrollbar styling
// ===========================================================================

export interface ScrollViewProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Show a fade at scroll edges. */
  fadeEdges?: boolean;
  maxHeight?: number | string;
  maxWidth?: number | string;
}

export const ScrollView = styled.div<{ $o: ScrollViewProps['orientation']; $fade: boolean; $mh?: ScrollViewProps['maxHeight']; $mw?: ScrollViewProps['maxWidth'] }>`
  ${({ $o }) => $o === 'vertical' ? 'overflow-y: auto; overflow-x: hidden;'
    : $o === 'horizontal' ? 'overflow-x: auto; overflow-y: hidden;'
    : 'overflow: auto;'}
  ${({ $mh }) => $mh !== undefined && `max-height: ${typeof $mh === 'number' ? `${$mh}px` : $mh};`}
  ${({ $mw }) => $mw !== undefined && `max-width: ${typeof $mw === 'number' ? `${$mw}px` : $mw};`}
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.color.border} transparent;
  &::-webkit-scrollbar { width: 8px; height: 8px; }
  &::-webkit-scrollbar-thumb { background: ${({ theme }) => theme.color.border}; border-radius: 4px; }
  &::-webkit-scrollbar-thumb:hover { background: ${({ theme }) => theme.color.subtext}; }
  &::-webkit-scrollbar-track { background: transparent; }
  ${({ $fade, theme }) => $fade && css`
    mask-image: linear-gradient(to bottom, transparent 0, ${theme.color.text} 16px, ${theme.color.text} calc(100% - 16px), transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%);
  `}
` as any;

(ScrollView as any).defaultProps = { $o: 'vertical', $fade: false };

export const ScrollViewBox = ({ orientation = 'vertical', fadeEdges = false, maxHeight, maxWidth, children, ...rest }: ScrollViewProps) => (
  <ScrollView $o={orientation} $fade={fadeEdges} $mh={maxHeight} $mw={maxWidth} {...rest}>{children}</ScrollView>
);
