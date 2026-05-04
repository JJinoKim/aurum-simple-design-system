/**
 * Internal helper — controlled/uncontrolled open state.
 * Mirrors what the web + native overlay components need so they don't each
 * reinvent the same useState dance.
 */
import { useCallback, useState } from 'react';
import type { ControlledOpenProps } from './types';

export function useOpenState({ open, defaultOpen, onOpenChange }: ControlledOpenProps) {
  const [internal, setInternal] = useState<boolean>(defaultOpen ?? false);
  const isControlled = open !== undefined;
  const value = isControlled ? !!open : internal;

  const setOpen = useCallback((next: boolean | ((prev: boolean) => boolean)) => {
    const resolved = typeof next === 'function' ? (next as (p: boolean) => boolean)(value) : next;
    if (!isControlled) setInternal(resolved);
    onOpenChange?.(resolved);
  }, [isControlled, onOpenChange, value]);

  return [value, setOpen] as const;
}
