/**
 * Menu — Aurum Design System (Web)
 *
 * Anchored popover with selectable items. Closes on item activation, outside
 * click, or Escape. Positioning is simple and absolute: the trigger reports
 * its bounding rect, the menu places itself relative to that rect with
 * `side` + `align`. No flip / collision logic — kept intentionally minimal.
 *
 * Composition:
 *   <Menu>
 *     <Menu.Trigger asChild><Button>Open</Button></Menu.Trigger>
 *     <Menu.Content>
 *       <Menu.Item onSelect={...}>Save</Menu.Item>
 *       <Menu.Separator />
 *       <Menu.Item tone="danger">Delete</Menu.Item>
 *     </Menu.Content>
 *   </Menu>
 */
import React, {
  cloneElement, createContext, isValidElement, useCallback, useContext,
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import type { Side, Align, Tone } from './types';
import { useOpenState } from './useOpenState';

interface MenuCtx {
  open: boolean;
  setOpen: (next: boolean) => void;
  triggerRef: React.RefObject<HTMLElement>;
  side: Side;
  align: Align;
  sideOffset: number;
  alignOffset: number;
}
const Ctx = createContext<MenuCtx | null>(null);
const useMenu = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('Menu.* must be used inside <Menu>');
  return ctx;
};

export interface MenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  children: React.ReactNode;
}

export function Menu({
  open, defaultOpen, onOpenChange,
  side = 'bottom', align = 'start', sideOffset = 4, alignOffset = 0,
  children,
}: MenuProps) {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange });
  const triggerRef = useRef<HTMLElement>(null);
  return (
    <Ctx.Provider value={{ open: isOpen, setOpen, triggerRef, side, align, sideOffset, alignOffset }}>
      {children}
    </Ctx.Provider>
  );
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

export interface MenuTriggerProps {
  asChild?: boolean;
  children: React.ReactElement;
}

const TriggerButton = styled.button`
  appearance: none; background: transparent; border: 0; padding: 0; cursor: pointer; color: inherit;
`;

export const MenuTrigger = ({ asChild, children }: MenuTriggerProps) => {
  const { open, setOpen, triggerRef } = useMenu();
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(!open);
  };
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ref: triggerRef as any,
      onClick: (e: React.MouseEvent) => {
        (children.props as any).onClick?.(e);
        if (!e.defaultPrevented) onClick(e);
      },
      'aria-haspopup': 'menu',
      'aria-expanded': open,
    } as any);
  }
  return (
    <TriggerButton ref={triggerRef as any} type="button" aria-haspopup="menu" aria-expanded={open} onClick={onClick}>
      {children}
    </TriggerButton>
  );
};

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const Surface = styled.div`
  position: fixed;
  min-width: 180px;
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: ${({ theme }) => theme.space[1]}px;
  box-shadow: ${({ theme }) => theme.shadow.md};
  z-index: ${({ theme }) => theme.zIndex.popover};
  display: flex;
  flex-direction: column;
  gap: 1px;
  outline: none;
`;

export interface MenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function computePosition(
  rect: DOMRect, side: Side, align: Align, sideOffset: number, alignOffset: number,
) {
  let top = 0; let left = 0;
  switch (side) {
    case 'bottom': top = rect.bottom + sideOffset; break;
    case 'top':    top = rect.top - sideOffset; break;
    case 'right':  left = rect.right + sideOffset; top = rect.top; break;
    case 'left':   left = rect.left - sideOffset; top = rect.top; break;
  }
  if (side === 'top' || side === 'bottom') {
    if (align === 'start')  left = rect.left + alignOffset;
    if (align === 'center') left = rect.left + rect.width / 2 + alignOffset;
    if (align === 'end')    left = rect.right + alignOffset;
  } else {
    if (align === 'start')  top = rect.top + alignOffset;
    if (align === 'center') top = rect.top + rect.height / 2 + alignOffset;
    if (align === 'end')    top = rect.bottom + alignOffset;
  }
  return { top, left, side, align };
}

export const MenuContent = ({ children, ...rest }: MenuContentProps) => {
  const { open, setOpen, triggerRef, side, align, sideOffset, alignOffset } = useMenu();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos(computePosition(rect, side, align, sideOffset, alignOffset));
  }, [open, triggerRef, side, align, sideOffset, alignOffset]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (surfaceRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, setOpen, triggerRef]);

  if (!open || !pos || typeof document === 'undefined') return null;

  const transform =
    side === 'top'    ? (align === 'end' ? 'translate(-100%, -100%)' : align === 'center' ? 'translate(-50%, -100%)' : 'translate(0, -100%)')
  : side === 'bottom' ? (align === 'end' ? 'translate(-100%, 0)'    : align === 'center' ? 'translate(-50%, 0)'    : 'translate(0, 0)')
  : side === 'left'   ? (align === 'end' ? 'translate(-100%, -100%)' : align === 'center' ? 'translate(-100%, -50%)' : 'translate(-100%, 0)')
  :                     (align === 'end' ? 'translate(0, -100%)'    : align === 'center' ? 'translate(0, -50%)'    : 'translate(0, 0)');

  return createPortal(
    <Surface
      ref={surfaceRef}
      role="menu"
      style={{ top: pos.top, left: pos.left, transform }}
      {...rest}
    >
      {children}
    </Surface>,
    document.body,
  );
};

// ---------------------------------------------------------------------------
// Item / Separator / Label
// ---------------------------------------------------------------------------

export interface MenuItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  tone?: Tone;
  iconBefore?: React.ReactNode;
  shortcut?: string;
  /** Fires before close. Call `e.preventDefault()` to keep the menu open. */
  onSelect?: (e: { preventDefault: () => void }) => void;
}

const Row = styled.button<{ $tone: Tone }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]}px;
  padding: 0 ${({ theme }) => theme.space[3]}px;
  height: 32px;
  background: transparent;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.xs}px;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.md}px;
  color: ${({ theme, $tone }) => ($tone === 'danger' ? theme.color.error : theme.color.text)};
  text-align: left;
  cursor: pointer;
  user-select: none;
  &:hover:not(:disabled), &:focus-visible {
    background: ${({ theme }) => theme.color.surface};
    outline: none;
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Shortcut = styled.span`
  margin-left: auto;
  font-size: ${({ theme }) => theme.font.size.sm}px;
  color: ${({ theme }) => theme.color.subtext};
  letter-spacing: 0.04em;
`;

export const MenuItem = ({ tone = 'default', iconBefore, shortcut, onSelect, onClick, children, ...rest }: MenuItemProps) => {
  const { setOpen } = useMenu();
  return (
    <Row
      role="menuitem"
      $tone={tone}
      onClick={(e) => {
        onClick?.(e);
        let prevented = false;
        onSelect?.({ preventDefault: () => { prevented = true; } });
        if (!prevented) setOpen(false);
      }}
      {...rest}
    >
      {iconBefore}
      <span>{children}</span>
      {shortcut && <Shortcut>{shortcut}</Shortcut>}
    </Row>
  );
};

export const MenuSeparator = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.color.border};
  margin: ${({ theme }) => theme.space[1]}px 0;
`;

export const MenuLabel = styled.div`
  padding: ${({ theme }) => theme.space[1]}px ${({ theme }) => theme.space[3]}px;
  font-size: ${({ theme }) => theme.font.size.xs}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.subtext};
`;

Menu.Trigger = MenuTrigger;
Menu.Content = MenuContent;
Menu.Item = MenuItem;
Menu.Separator = MenuSeparator;
Menu.Label = MenuLabel;
