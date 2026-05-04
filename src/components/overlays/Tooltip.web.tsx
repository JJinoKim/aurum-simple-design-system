/**
 * Tooltip — Aurum Design System (Web)
 *
 * Hover/focus-revealed label. ~150ms enter delay, instant exit. Position
 * follows `side` token; positioning is the same lightweight rect-based
 * approach used by Menu/Popover.
 */
import React, {
  cloneElement, isValidElement, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import type { Side } from './types';

export interface TooltipProps {
  content: React.ReactNode;
  side?: Side;
  /** Delay in ms before showing on hover. Default 150. */
  delay?: number;
  children: React.ReactElement;
}

const Bubble = styled.div`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.popover};
  background: ${({ theme }) => theme.color.text};
  color: ${({ theme }) => theme.color.background};
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.sm}px;
  padding: ${({ theme }) => theme.space[1]}px ${({ theme }) => theme.space[2]}px;
  border-radius: ${({ theme }) => theme.radius.xs}px;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

export function Tooltip({ content, side = 'top', delay = 150, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; transform: string } | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const timer = useRef<number | null>(null);

  const show = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setOpen(false);
  };

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const offset = 6;
    const m: Record<Side, { top: number; left: number; transform: string }> = {
      top:    { top: r.top - offset,    left: r.left + r.width / 2, transform: 'translate(-50%, -100%)' },
      bottom: { top: r.bottom + offset, left: r.left + r.width / 2, transform: 'translate(-50%, 0)' },
      left:   { top: r.top + r.height / 2, left: r.left - offset,   transform: 'translate(-100%, -50%)' },
      right:  { top: r.top + r.height / 2, left: r.right + offset,  transform: 'translate(0, -50%)' },
    };
    setPos(m[side]);
  }, [open, side]);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  if (!isValidElement(children)) return children as any;

  const enhanced = cloneElement(children, {
    ref: (node: HTMLElement) => {
      triggerRef.current = node;
      const ref = (children as any).ref;
      if (typeof ref === 'function') ref(node);
      else if (ref && 'current' in ref) (ref as any).current = node;
    },
    onMouseEnter: (e: React.MouseEvent) => { (children.props as any).onMouseEnter?.(e); show(); },
    onMouseLeave: (e: React.MouseEvent) => { (children.props as any).onMouseLeave?.(e); hide(); },
    onFocus: (e: React.FocusEvent) => { (children.props as any).onFocus?.(e); show(); },
    onBlur:  (e: React.FocusEvent) => { (children.props as any).onBlur?.(e); hide(); },
  } as any);

  return (
    <>
      {enhanced}
      {open && pos && typeof document !== 'undefined' && createPortal(
        <Bubble role="tooltip" style={{ top: pos.top, left: pos.left, transform: pos.transform }}>
          {content}
        </Bubble>,
        document.body,
      )}
    </>
  );
}
