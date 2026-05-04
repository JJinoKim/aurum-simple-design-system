/**
 * Sheet — Aurum Design System (Web)
 *
 * Edge-attached panel (top / right / bottom / left). Uses transform-based
 * slide-in. Scrim is the same as Dialog's. Escape closes; scrim click closes.
 */
import React, { cloneElement, createContext, isValidElement, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import { useOpenState } from './useOpenState';
import type { Side } from './types';

interface SheetCtx { open: boolean; setOpen: (b: boolean) => void; side: Side }
const Ctx = createContext<SheetCtx | null>(null);
const useSheet = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Sheet.* must be used inside <Sheet>');
  return c;
};

export interface SheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (b: boolean) => void;
  side?: Side;
  children: React.ReactNode;
}

export function Sheet({ open, defaultOpen, onOpenChange, side = 'right', children }: SheetProps) {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange });
  return <Ctx.Provider value={{ open: isOpen, setOpen, side }}>{children}</Ctx.Provider>;
}

const TriggerWrap = styled.div`display: contents;`;
export const SheetTrigger = ({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) => {
  const { setOpen } = useSheet();
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      onClick: (e: React.MouseEvent) => { (children.props as any).onClick?.(e); setOpen(true); },
    } as any);
  }
  return <TriggerWrap onClick={() => setOpen(true)}>{children}</TriggerWrap>;
};
export const SheetClose = ({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) => {
  const { setOpen } = useSheet();
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      onClick: (e: React.MouseEvent) => { (children.props as any).onClick?.(e); setOpen(false); },
    } as any);
  }
  return <TriggerWrap onClick={() => setOpen(false)}>{children}</TriggerWrap>;
};

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideIn = (from: string) => keyframes`from { transform: ${from}; } to { transform: translate(0, 0); }`;

const Scrim = styled.div`
  position: fixed; inset: 0;
  background: ${({ theme }) => theme.color.scrim};
  z-index: ${({ theme }) => theme.zIndex.overlay};
  animation: ${fadeIn} ${({ theme }) => theme.duration.base}ms ${({ theme }) => theme.easing.standard};
`;

const Surface = styled.div<{ $side: Side }>`
  position: fixed;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex; flex-direction: column;
  padding: ${({ theme }) => theme.space[5]}px;
  ${({ $side, theme }) => $side === 'right' && css`
    top: 0; right: 0; height: 100vh;
    width: min(420px, 100vw);
    border-top-left-radius: ${theme.radius.lg}px;
    border-bottom-left-radius: ${theme.radius.lg}px;
    animation: ${slideIn('translateX(100%)')} ${theme.duration.slow}ms ${theme.easing.standard};
  `}
  ${({ $side, theme }) => $side === 'left' && css`
    top: 0; left: 0; height: 100vh;
    width: min(420px, 100vw);
    border-top-right-radius: ${theme.radius.lg}px;
    border-bottom-right-radius: ${theme.radius.lg}px;
    animation: ${slideIn('translateX(-100%)')} ${theme.duration.slow}ms ${theme.easing.standard};
  `}
  ${({ $side, theme }) => $side === 'bottom' && css`
    left: 0; right: 0; bottom: 0;
    max-height: 80vh;
    border-top-left-radius: ${theme.radius.lg}px;
    border-top-right-radius: ${theme.radius.lg}px;
    animation: ${slideIn('translateY(100%)')} ${theme.duration.slow}ms ${theme.easing.standard};
  `}
  ${({ $side, theme }) => $side === 'top' && css`
    left: 0; right: 0; top: 0;
    max-height: 80vh;
    border-bottom-left-radius: ${theme.radius.lg}px;
    border-bottom-right-radius: ${theme.radius.lg}px;
    animation: ${slideIn('translateY(-100%)')} ${theme.duration.slow}ms ${theme.easing.standard};
  `}
`;

export const SheetContent = ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
  const { open, setOpen, side } = useSheet();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, setOpen]);
  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <>
      <Scrim onClick={() => setOpen(false)} />
      <Surface $side={side} role="dialog" aria-modal="true" {...rest}>{children}</Surface>
    </>,
    document.body,
  );
};

export const SheetTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.space[2]}px 0;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.xl}px;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.color.text};
`;

Sheet.Trigger = SheetTrigger;
Sheet.Close = SheetClose;
Sheet.Content = SheetContent;
Sheet.Title = SheetTitle;
