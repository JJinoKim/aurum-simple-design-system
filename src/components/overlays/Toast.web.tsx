/**
 * Toast — Aurum Design System (Web)
 *
 * Imperative API: call `toast.show({ title, description, status, duration })`
 * from anywhere; mount `<ToastViewport />` once near the app root.
 *
 * Stack accumulates at the bottom-right. Each toast auto-dismisses after
 * `duration` (default 4000ms); `duration: Infinity` disables auto-dismiss.
 */
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import type { ControlStatus } from '../forms/types';

export interface ToastOptions {
  title: string;
  description?: string;
  status?: ControlStatus;
  duration?: number;
}
interface ToastEntry extends ToastOptions { id: number }

type Listener = (entries: ToastEntry[]) => void;
const listeners = new Set<Listener>();
let entries: ToastEntry[] = [];
let _seq = 0;

const emit = () => listeners.forEach(l => l(entries));

export const toast = {
  show(opts: ToastOptions): number {
    const entry: ToastEntry = { id: ++_seq, duration: 4000, status: 'default', ...opts };
    entries = [...entries, entry];
    emit();
    if (entry.duration !== Infinity) {
      window.setTimeout(() => toast.dismiss(entry.id), entry.duration);
    }
    return entry.id;
  },
  dismiss(id: number) {
    entries = entries.filter(e => e.id !== id);
    emit();
  },
  clear() { entries = []; emit(); },
};

const slideUp = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;

const Stack = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: ${({ theme }) => theme.zIndex.toast};
  max-width: calc(100vw - 48px);
  width: 360px;
`;

const Card = styled.div<{ $status: ControlStatus }>`
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme, $status }) =>
    $status === 'error' ? theme.color.error
    : $status === 'success' ? theme.color.success
    : theme.color.border};
  border-left: 3px solid ${({ theme, $status }) =>
    $status === 'error' ? theme.color.error
    : $status === 'success' ? theme.color.success
    : theme.color.primary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.space[3]}px ${({ theme }) => theme.space[4]}px;
  box-shadow: ${({ theme }) => theme.shadow.md};
  font-family: ${({ theme }) => theme.font.family.sans};
  color: ${({ theme }) => theme.color.text};
  animation: ${slideUp} ${({ theme }) => theme.duration.base}ms ${({ theme }) => theme.easing.standard};
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.font.size.md}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;
const Desc = styled.div`
  margin-top: 2px;
  font-size: ${({ theme }) => theme.font.size.sm}px;
  color: ${({ theme }) => theme.color.subtext};
`;

export function ToastViewport() {
  const [list, setList] = useState<ToastEntry[]>(entries);
  useEffect(() => {
    listeners.add(setList);
    return () => { listeners.delete(setList); };
  }, []);
  if (typeof document === 'undefined') return null;
  return createPortal(
    <Stack role="region" aria-label="Notifications">
      {list.map(e => (
        <Card key={e.id} $status={e.status ?? 'default'} role="status" onClick={() => toast.dismiss(e.id)}>
          <Title>{e.title}</Title>
          {e.description && <Desc>{e.description}</Desc>}
        </Card>
      ))}
    </Stack>,
    document.body,
  );
}
