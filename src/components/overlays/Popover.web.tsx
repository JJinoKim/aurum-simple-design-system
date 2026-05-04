/**
 * Popover — Aurum Design System (Web)
 *
 * Anchored floating panel. Shares positioning logic with Menu but allows
 * arbitrary children (a form, a color picker, etc.) — not a list of items.
 */
import React, {
  cloneElement, createContext, isValidElement, useContext, useEffect,
  useLayoutEffect, useRef, useState,
} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import type { Side, Align } from './types';
import { useOpenState } from './useOpenState';

interface PopoverCtx {
  open: boolean;
  setOpen: (b: boolean) => void;
  triggerRef: React.RefObject<HTMLElement>;
  side: Side; align: Align; sideOffset: number; alignOffset: number;
}
const Ctx = createContext<PopoverCtx | null>(null);
const usePopover = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Popover.* must be used inside <Popover>');
  return c;
};

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (b: boolean) => void;
  side?: Side; align?: Align; sideOffset?: number; alignOffset?: number;
  children: React.ReactNode;
}

export function Popover({
  open, defaultOpen, onOpenChange,
  side = 'bottom', align = 'center', sideOffset = 8, alignOffset = 0,
  children,
}: PopoverProps) {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange });
  const triggerRef = useRef<HTMLElement>(null);
  return (
    <Ctx.Provider value={{ open: isOpen, setOpen, triggerRef, side, align, sideOffset, alignOffset }}>
      {children}
    </Ctx.Provider>
  );
}

const TriggerBtn = styled.button`appearance: none; background: transparent; border: 0; padding: 0; cursor: pointer; color: inherit;`;

export const PopoverTrigger = ({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) => {
  const { open, setOpen, triggerRef } = usePopover();
  const onClick = () => setOpen(!open);
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ref: triggerRef as any,
      onClick: (e: React.MouseEvent) => { (children.props as any).onClick?.(e); onClick(); },
      'aria-expanded': open,
    } as any);
  }
  return <TriggerBtn ref={triggerRef as any} type="button" aria-expanded={open} onClick={onClick}>{children}</TriggerBtn>;
};

const Surface = styled.div`
  position: fixed;
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.space[4]}px;
  box-shadow: ${({ theme }) => theme.shadow.md};
  z-index: ${({ theme }) => theme.zIndex.popover};
  min-width: 220px;
  outline: none;
`;

export const PopoverContent = ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
  const { open, setOpen, triggerRef, side, align, sideOffset, alignOffset } = usePopover();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; transform: string } | null>(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    let top = 0, left = 0, transform = '';
    if (side === 'bottom') { top = r.bottom + sideOffset; transform = align === 'center' ? 'translateX(-50%)' : align === 'end' ? 'translateX(-100%)' : ''; left = align === 'center' ? r.left + r.width / 2 : align === 'end' ? r.right : r.left; }
    if (side === 'top')    { top = r.top - sideOffset; transform = `translateY(-100%)` + (align === 'center' ? ' translateX(-50%)' : align === 'end' ? ' translateX(-100%)' : ''); left = align === 'center' ? r.left + r.width / 2 : align === 'end' ? r.right : r.left; }
    if (side === 'right')  { left = r.right + sideOffset; top = align === 'center' ? r.top + r.height / 2 : align === 'end' ? r.bottom : r.top; transform = align === 'center' ? 'translateY(-50%)' : align === 'end' ? 'translateY(-100%)' : ''; }
    if (side === 'left')   { left = r.left - sideOffset; transform = 'translateX(-100%)' + (align === 'center' ? ' translateY(-50%)' : align === 'end' ? ' translateY(-100%)' : ''); top = align === 'center' ? r.top + r.height / 2 : align === 'end' ? r.bottom : r.top; }
    setPos({ top, left, transform });
  }, [open, triggerRef, side, align, sideOffset, alignOffset]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node) || triggerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open, setOpen, triggerRef]);

  if (!open || !pos || typeof document === 'undefined') return null;
  return createPortal(
    <Surface ref={ref} style={{ top: pos.top, left: pos.left, transform: pos.transform }} {...rest}>{children}</Surface>,
    document.body,
  );
};

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
