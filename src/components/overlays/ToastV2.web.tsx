/**
 * Toast v2 — Aurum Design System (Web)
 *
 * Same imperative API as Toast v1, but with structural upgrades:
 *
 *   - Action button slot ("Undo", "Retry").
 *   - Pause-on-hover: timers freeze while the toast is hovered, resume on leave.
 *   - Promise helper: `toastV2.promise(fn(), { loading, success, error })` shows
 *     a loading toast and swaps in success/error based on resolution.
 *   - Position prop on `<ToastViewportV2 position="top-right" />`.
 *   - Accessible: status === 'error' uses role="alert", others "status".
 *
 * Visually identical to v1 chrome; the difference is in API surface.
 */
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes, css } from 'styled-components';
import type { ControlStatus } from '../forms/types';

export interface ToastV2Options {
  title: string;
  description?: string;
  status?: ControlStatus | 'loading';
  duration?: number;
  action?: { label: string; onClick: () => void };
}
interface ToastV2Entry extends ToastV2Options {
  id: number;
  startedAt: number;
  remaining: number;
  paused: boolean;
}

type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

type Listener = (entries: ToastV2Entry[]) => void;
const listeners = new Set<Listener>();
let entries: ToastV2Entry[] = [];
let _seq = 0;
const timers = new Map<number, number>();

const emit = () => listeners.forEach(l => l([...entries]));

const scheduleDismiss = (id: number, ms: number) => {
  if (ms === Infinity) return;
  const handle = window.setTimeout(() => toastV2.dismiss(id), ms);
  timers.set(id, handle);
};
const clearDismiss = (id: number) => {
  const h = timers.get(id);
  if (h) { window.clearTimeout(h); timers.delete(id); }
};

export const toastV2 = {
  show(opts: ToastV2Options): number {
    const id = ++_seq;
    const duration = opts.duration ?? (opts.status === 'loading' ? Infinity : 4000);
    const entry: ToastV2Entry = {
      id, status: 'default', ...opts,
      duration,
      startedAt: Date.now(),
      remaining: duration,
      paused: false,
    };
    entries = [...entries, entry];
    emit();
    scheduleDismiss(id, duration);
    return id;
  },
  update(id: number, patch: Partial<ToastV2Options>) {
    entries = entries.map(e => e.id === id ? { ...e, ...patch, startedAt: Date.now(), remaining: patch.duration ?? 4000 } : e);
    clearDismiss(id);
    const next = entries.find(e => e.id === id);
    if (next && next.remaining !== Infinity) scheduleDismiss(id, next.remaining);
    emit();
  },
  dismiss(id: number) {
    clearDismiss(id);
    entries = entries.filter(e => e.id !== id);
    emit();
  },
  clear() { entries.forEach(e => clearDismiss(e.id)); entries = []; emit(); },
  pause(id: number) {
    const e = entries.find(x => x.id === id);
    if (!e || e.paused) return;
    clearDismiss(id);
    const elapsed = Date.now() - e.startedAt;
    const remaining = Math.max(0, e.remaining - elapsed);
    entries = entries.map(x => x.id === id ? { ...x, paused: true, remaining } : x);
    emit();
  },
  resume(id: number) {
    const e = entries.find(x => x.id === id);
    if (!e || !e.paused) return;
    entries = entries.map(x => x.id === id ? { ...x, paused: false, startedAt: Date.now() } : x);
    if (e.remaining !== Infinity) scheduleDismiss(id, e.remaining);
    emit();
  },
  /** Show a loading toast; flip to success/error on resolution. */
  promise<T>(p: Promise<T>, msgs: { loading: ToastV2Options; success: ToastV2Options | ((v: T) => ToastV2Options); error: ToastV2Options | ((e: any) => ToastV2Options); }): Promise<T> {
    const id = toastV2.show({ ...msgs.loading, status: 'loading', duration: Infinity });
    p.then(
      (v) => toastV2.update(id, { ...(typeof msgs.success === 'function' ? msgs.success(v) : msgs.success), status: 'success' }),
      (err) => toastV2.update(id, { ...(typeof msgs.error === 'function' ? msgs.error(err) : msgs.error), status: 'error' }),
    );
    return p;
  },
};

// ---------------------------------------------------------------------------

const slideIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;

const Stack = styled.div<{ $pos: Position }>`
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: ${({ theme }) => theme.zIndex.toast};
  width: 360px;
  max-width: calc(100vw - 48px);
  ${({ $pos }) => {
    const v = $pos.startsWith('top') ? 'top: 24px;' : 'bottom: 24px;';
    const h = $pos.endsWith('right') ? 'right: 24px;'
            : $pos.endsWith('left')  ? 'left: 24px;'
            :                          'left: 50%; transform: translateX(-50%);';
    return css`${v}${h}`;
  }}
`;

type StatusKey = ControlStatus | 'loading';

const Card = styled.div<{ $status: StatusKey }>`
  position: relative;
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-left: 3px solid ${({ theme, $status }) =>
    $status === 'error' ? theme.color.error
    : $status === 'success' ? theme.color.success
    : $status === 'loading' ? theme.color.subtext
    : theme.color.primary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.space[3]}px ${({ theme }) => theme.space[4]}px;
  box-shadow: ${({ theme }) => theme.shadow.md};
  font-family: ${({ theme }) => theme.font.family.sans};
  color: ${({ theme }) => theme.color.text};
  animation: ${slideIn} ${({ theme }) => theme.duration.base}ms ${({ theme }) => theme.easing.standard};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Row = styled.div`display: flex; align-items: flex-start; gap: 8px;`;
const Title = styled.div`
  font-size: ${({ theme }) => theme.font.size.md}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  flex: 1;
`;
const Desc = styled.div`
  font-size: ${({ theme }) => theme.font.size.sm}px;
  color: ${({ theme }) => theme.color.subtext};
`;
const ActionBtn = styled.button`
  margin-top: 4px;
  align-self: flex-start;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.color.border};
  color: ${({ theme }) => theme.color.text};
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.xs}px;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.sm}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  cursor: pointer;
  &:hover { background: ${({ theme }) => theme.color.surface}; }
`;
const Spinner = styled.span`
  width: 12px; height: 12px; flex-shrink: 0;
  border: 1.5px solid ${({ theme }) => theme.color.subtext};
  border-right-color: transparent;
  border-radius: 50%;
  display: inline-block;
  margin-top: 4px;
  animation: aurum-spin-toast 0.7s linear infinite;
  @keyframes aurum-spin-toast { to { transform: rotate(360deg); } }
`;
const CloseBtn = styled.button`
  background: transparent;
  border: 0;
  color: ${({ theme }) => theme.color.subtext};
  cursor: pointer;
  padding: 0 4px;
  font-size: 18px;
  line-height: 1;
  &:hover { color: ${({ theme }) => theme.color.text}; }
`;

export function ToastViewportV2({ position = 'bottom-right' }: { position?: Position }) {
  const [list, setList] = useState<ToastV2Entry[]>(entries);
  useEffect(() => {
    listeners.add(setList);
    return () => { listeners.delete(setList); };
  }, []);
  if (typeof document === 'undefined') return null;

  return createPortal(
    <Stack $pos={position} role="region" aria-label="Notifications">
      {list.map(e => {
        const status = e.status ?? 'default';
        return (
          <Card
            key={e.id}
            $status={status as StatusKey}
            role={status === 'error' ? 'alert' : 'status'}
            onMouseEnter={() => toastV2.pause(e.id)}
            onMouseLeave={() => toastV2.resume(e.id)}
          >
            <Row>
              {status === 'loading' && <Spinner />}
              <Title>{e.title}</Title>
              <CloseBtn aria-label="Dismiss" onClick={() => toastV2.dismiss(e.id)}>×</CloseBtn>
            </Row>
            {e.description && <Desc>{e.description}</Desc>}
            {e.action && (
              <ActionBtn
                onClick={() => { e.action!.onClick(); toastV2.dismiss(e.id); }}
              >{e.action.label}</ActionBtn>
            )}
          </Card>
        );
      })}
    </Stack>,
    document.body,
  );
}
