/**
 * Dialog — Aurum Design System (Web)
 *
 * Modal sheet centered on a scrim. Closes on scrim click, Escape, or by
 * setting `open={false}`. Renders into a portal at document.body so stacking
 * never depends on the trigger's parent.
 *
 *   <Dialog>
 *     <Dialog.Trigger asChild><Button>Open</Button></Dialog.Trigger>
 *     <Dialog.Content>
 *       <Dialog.Title>Title</Dialog.Title>
 *       <Dialog.Description>...</Dialog.Description>
 *       ...
 *       <Dialog.Footer>
 *         <Dialog.Close asChild><Button variant="secondary">Cancel</Button></Dialog.Close>
 *         <Button>Save</Button>
 *       </Dialog.Footer>
 *     </Dialog.Content>
 *   </Dialog>
 */
import React, { cloneElement, createContext, isValidElement, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { useOpenState } from './useOpenState';

interface DialogCtx { open: boolean; setOpen: (b: boolean) => void; titleId: string; descId: string }
const Ctx = createContext<DialogCtx | null>(null);
const useDialog = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Dialog.* must be used inside <Dialog>');
  return c;
};

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

let _id = 0;
const useUid = (prefix: string) => React.useMemo(() => `${prefix}-${++_id}`, []);

export function Dialog({ open, defaultOpen, onOpenChange, children }: DialogProps) {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange });
  const titleId = useUid('aurum-dlg-title');
  const descId = useUid('aurum-dlg-desc');
  return <Ctx.Provider value={{ open: isOpen, setOpen, titleId, descId }}>{children}</Ctx.Provider>;
}

// ---------------------------------------------------------------------------

const TriggerWrap = styled.div`display: contents;`;

export const DialogTrigger = ({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) => {
  const { setOpen } = useDialog();
  const onClick = () => setOpen(true);
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      onClick: (e: React.MouseEvent) => { (children.props as any).onClick?.(e); onClick(); },
    } as any);
  }
  return <TriggerWrap onClick={onClick}>{children}</TriggerWrap>;
};

export const DialogClose = ({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) => {
  const { setOpen } = useDialog();
  const onClick = () => setOpen(false);
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      onClick: (e: React.MouseEvent) => { (children.props as any).onClick?.(e); onClick(); },
    } as any);
  }
  return <TriggerWrap onClick={onClick}>{children}</TriggerWrap>;
};

// ---------------------------------------------------------------------------

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const popIn  = keyframes`from { opacity: 0; transform: translate(-50%, -50%) scale(0.98); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); }`;

const Scrim = styled.div`
  position: fixed; inset: 0;
  background: ${({ theme }) => theme.color.scrim};
  z-index: ${({ theme }) => theme.zIndex.overlay};
  animation: ${fadeIn} ${({ theme }) => theme.duration.base}ms ${({ theme }) => theme.easing.standard};
`;

const Surface = styled.div`
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: min(480px, calc(100vw - 32px));
  max-height: calc(100vh - 64px);
  overflow: auto;
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.space[5]}px;
  z-index: ${({ theme }) => theme.zIndex.modal};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  display: flex; flex-direction: column;
  gap: ${({ theme }) => theme.space[3]}px;
  animation: ${popIn} ${({ theme }) => theme.duration.slow}ms ${({ theme }) => theme.easing.standard};
`;

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When false, scrim click won't close. Escape still works. */
  dismissOnScrimClick?: boolean;
  children: React.ReactNode;
}

export const DialogContent = ({ dismissOnScrimClick = true, children, ...rest }: DialogContentProps) => {
  const { open, setOpen, titleId, descId } = useDialog();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, setOpen]);

  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <>
      <Scrim onClick={() => dismissOnScrimClick && setOpen(false)} />
      <Surface role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descId} {...rest}>
        {children}
      </Surface>
    </>,
    document.body,
  );
};

export const DialogTitle = ({ children, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) => {
  const { titleId } = useDialog();
  return <Title id={titleId} {...rest}>{children}</Title>;
};
const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.xl}px;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  line-height: ${({ theme }) => theme.font.lineHeight.display};
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.color.text};
`;

export const DialogDescription = ({ children, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) => {
  const { descId } = useDialog();
  return <Desc id={descId} {...rest}>{children}</Desc>;
};
const Desc = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.md}px;
  line-height: ${({ theme }) => theme.font.lineHeight.body};
  color: ${({ theme }) => theme.color.subtext};
`;

export const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[2]}px;
  margin-top: ${({ theme }) => theme.space[2]}px;
`;

Dialog.Trigger = DialogTrigger;
Dialog.Close = DialogClose;
Dialog.Content = DialogContent;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Footer = DialogFooter;
