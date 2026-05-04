/**
 * Tabs — Aurum Design System (Web)
 *
 * Horizontal tab list with an underline indicator. Controlled or uncontrolled.
 *   <Tabs defaultValue="overview">
 *     <Tabs.List>
 *       <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
 *       <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
 *     </Tabs.List>
 *     <Tabs.Panel value="overview">…</Tabs.Panel>
 *     <Tabs.Panel value="logs">…</Tabs.Panel>
 *   </Tabs>
 */
import React, { createContext, useContext, useState } from 'react';
import styled from 'styled-components';

interface TabsCtx { value: string; setValue: (v: string) => void }
const Ctx = createContext<TabsCtx | null>(null);
const useTabs = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Tabs.* must be used inside <Tabs>');
  return c;
};

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
}

export function Tabs({ value, defaultValue, onValueChange, children }: TabsProps) {
  const [internal, setInternal] = useState<string>(defaultValue ?? '');
  const v = value ?? internal;
  const setValue = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  return <Ctx.Provider value={{ value: v, setValue }}>{children}</Ctx.Provider>;
}

const List = styled.div`
  display: inline-flex;
  gap: ${({ theme }) => theme.space[5]}px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

const TriggerBtn = styled.button<{ $active: boolean }>`
  appearance: none;
  background: transparent;
  border: 0;
  padding: ${({ theme }) => theme.space[2]}px 0;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.md}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme, $active }) => ($active ? theme.color.text : theme.color.subtext)};
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.color.primary : 'transparent')};
  margin-bottom: -1px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.fast};
  &:hover { color: ${({ theme }) => theme.color.text}; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.color.primary}; outline-offset: 4px; }
`;

const TabsList = ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
  <List role="tablist" {...rest}>{children}</List>
);

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}
const TabsTrigger = ({ value, children, ...rest }: TabsTriggerProps) => {
  const { value: current, setValue } = useTabs();
  const active = current === value;
  return (
    <TriggerBtn type="button" role="tab" aria-selected={active} $active={active} onClick={() => setValue(value)} {...rest}>
      {children}
    </TriggerBtn>
  );
};

export interface TabsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}
const PanelEl = styled.div`
  padding: ${({ theme }) => theme.space[4]}px 0;
`;
const TabsPanel = ({ value, children, ...rest }: TabsPanelProps) => {
  const { value: current } = useTabs();
  if (current !== value) return null;
  return <PanelEl role="tabpanel" {...rest}>{children}</PanelEl>;
};

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Panel = TabsPanel;
