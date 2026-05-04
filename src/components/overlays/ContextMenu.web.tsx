/**
 * ContextMenu — Aurum Design System (Web)
 *
 * Same surface as Menu, opened by `oncontextmenu` on the trigger child.
 * Position is the cursor location at right-click time.
 *
 *   <ContextMenu>
 *     <ContextMenu.Trigger><Card .../></ContextMenu.Trigger>
 *     <ContextMenu.Content>
 *       <ContextMenu.Item onSelect={...}>Rename</ContextMenu.Item>
 *       <ContextMenu.Separator />
 *       <ContextMenu.Item tone="danger">Delete</ContextMenu.Item>
 *     </ContextMenu.Content>
 *   </ContextMenu>
 */
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import type { Tone } from './types';

interface CtxState {
  open: boolean;
  pos: { x: number; y: number };
  setOpen: (b: boolean) => void;
  setPos: (p: { x: number; y: number }) => void;
}
const Ctx = createContext<CtxState | null>(null);
const useCtx = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('ContextMenu.* must be used inside <ContextMenu>');
  return c;
};

export interface ContextMenuProps { children: React.ReactNode }

export function ContextMenu({ children }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return <Ctx.Provider value={{ open, pos, setOpen, setPos }}>{children}</Ctx.Provider>;
}

// ---------------------------------------------------------------------------

const TriggerWrap = styled.div`display: contents;`;

export interface ContextMenuTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Trigger = ({ children, onContextMenu, ...rest }: ContextMenuTriggerProps) => {
  const { setOpen, setPos } = useCtx();
  return (
    <TriggerWrap
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e);
        setPos({ x: e.clientX, y: e.clientY });
        setOpen(true);
      }}
      {...rest}
    >
      {children}
    </TriggerWrap>
  );
};

// ---------------------------------------------------------------------------

const Surface = styled.div`
  position: fixed;
  min-width: 200px;
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: ${({ theme }) => theme.space[1]}px;
  box-shadow: ${({ theme }) => theme.shadow.md};
  z-index: ${({ theme }) => theme.zIndex.popover};
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const Content = ({ children }: { children: React.ReactNode }) => {
  const { open, pos, setOpen } = useCtx();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, setOpen]);

  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <Surface ref={ref} role="menu" style={{ top: pos.y, left: pos.x }}>{children}</Surface>,
    document.body,
  );
};

// ---------------------------------------------------------------------------

const Row = styled.button<{ $tone: Tone }>`
  display: flex; align-items: center; gap: ${({ theme }) => theme.space[2]}px;
  padding: 0 ${({ theme }) => theme.space[3]}px; height: 32px;
  background: transparent; border: 0;
  border-radius: ${({ theme }) => theme.radius.xs}px;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.md}px;
  color: ${({ theme, $tone }) => $tone === 'danger' ? theme.color.error : theme.color.text};
  text-align: left; cursor: pointer; user-select: none;
  &:hover:not(:disabled), &:focus-visible { background: ${({ theme }) => theme.color.surface}; outline: none; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const Shortcut = styled.span`
  margin-left: auto;
  font-size: ${({ theme }) => theme.font.size.sm}px;
  color: ${({ theme }) => theme.color.subtext};
  letter-spacing: 0.04em;
`;

export interface ContextMenuItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  tone?: Tone;
  iconBefore?: React.ReactNode;
  shortcut?: string;
  onSelect?: (e: { preventDefault: () => void }) => void;
}

const Item = ({ tone = 'default', iconBefore, shortcut, onSelect, onClick, children, ...rest }: ContextMenuItemProps) => {
  const { setOpen } = useCtx();
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
      {iconBefore}<span>{children}</span>{shortcut && <Shortcut>{shortcut}</Shortcut>}
    </Row>
  );
};

const Separator = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.color.border};
  margin: ${({ theme }) => theme.space[1]}px 0;
`;

const Label = styled.div`
  padding: ${({ theme }) => theme.space[1]}px ${({ theme }) => theme.space[3]}px;
  font-size: ${({ theme }) => theme.font.size.xs}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.subtext};
`;

ContextMenu.Trigger = Trigger;
ContextMenu.Content = Content;
ContextMenu.Item = Item;
ContextMenu.Separator = Separator;
ContextMenu.Label = Label;
