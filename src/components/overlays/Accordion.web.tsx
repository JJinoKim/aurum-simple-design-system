/**
 * Accordion — Aurum Design System (Web)
 *
 * Single or multiple-open. Each item has a header (button) and body (panel).
 * Animation is a simple opacity/height crossfade via max-height.
 *
 *   <Accordion type="single" defaultValue="a">
 *     <Accordion.Item value="a">
 *       <Accordion.Header>Charging</Accordion.Header>
 *       <Accordion.Body>...</Accordion.Body>
 *     </Accordion.Item>
 *   </Accordion>
 */
import React, { createContext, useContext, useState } from 'react';
import styled from 'styled-components';

type SingleProps = { type?: 'single'; value?: string; defaultValue?: string; onValueChange?: (v: string) => void };
type MultiProps  = { type: 'multiple'; value?: string[]; defaultValue?: string[]; onValueChange?: (v: string[]) => void };

export type AccordionProps = (SingleProps | MultiProps) & { collapsible?: boolean; children: React.ReactNode };

interface ItemCtx { value: string; isOpen: boolean; toggle: () => void; headerId: string; panelId: string }
interface RootCtx { isOpen: (v: string) => boolean; toggle: (v: string) => void; collapsible: boolean }

const ItemContextRef = createContext<ItemCtx | null>(null);
const RootContextRef = createContext<RootCtx | null>(null);
const useItem = () => {
  const c = useContext(ItemContextRef);
  if (!c) throw new Error('Accordion.Header / Body must be used inside Accordion.Item');
  return c;
};

let _id = 0;
const useUid = (prefix: string) => React.useMemo(() => `${prefix}-${++_id}`, []);

export function Accordion(props: AccordionProps) {
  const { type = 'single', collapsible = true, children } = props as any;
  const isMulti = type === 'multiple';
  const [singleVal, setSingle] = useState<string>(!isMulti ? ((props as SingleProps).defaultValue ?? '') : '');
  const [multiVal, setMulti]   = useState<string[]>(isMulti ? ((props as MultiProps).defaultValue ?? []) : []);
  const single = !isMulti ? ((props as SingleProps).value ?? singleVal) : '';
  const multi  =  isMulti ? ((props as MultiProps).value  ?? multiVal)  : [];

  const isOpen = (v: string) => isMulti ? multi.includes(v) : single === v;
  const toggle = (v: string) => {
    if (isMulti) {
      const next = multi.includes(v) ? multi.filter(x => x !== v) : [...multi, v];
      if ((props as MultiProps).value === undefined) setMulti(next);
      (props as MultiProps).onValueChange?.(next);
    } else {
      const next = single === v ? (collapsible ? '' : single) : v;
      if ((props as SingleProps).value === undefined) setSingle(next);
      (props as SingleProps).onValueChange?.(next);
    }
  };

  return <RootContextRef.Provider value={{ isOpen, toggle, collapsible }}>{children}</RootContextRef.Provider>;
}

const ItemEl = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> { value: string }
const Item = ({ value, children, ...rest }: AccordionItemProps) => {
  const root = useContext(RootContextRef);
  if (!root) throw new Error('Accordion.Item must be used inside <Accordion>');
  const headerId = useUid('aurum-acc-h');
  const panelId  = useUid('aurum-acc-p');
  const isOpen = root.isOpen(value);
  return (
    <ItemContextRef.Provider value={{ value, isOpen, toggle: () => root.toggle(value), headerId, panelId }}>
      <ItemEl {...rest}>{children}</ItemEl>
    </ItemContextRef.Provider>
  );
};

const HeaderBtn = styled.button<{ $open: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: 0;
  padding: ${({ theme }) => theme.space[4]}px 0;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.md}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.color.text};
  text-align: left;
  cursor: pointer;
  & > svg { transition: ${({ theme }) => theme.transition.base}; transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')}); }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.color.primary}; outline-offset: 2px; }
`;

const Chevron = () => (
  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true">
    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Header = ({ children, ...rest }: React.HTMLAttributes<HTMLButtonElement>) => {
  const { isOpen, toggle, headerId, panelId } = useItem();
  return (
    <HeaderBtn
      id={headerId}
      type="button"
      aria-expanded={isOpen}
      aria-controls={panelId}
      $open={isOpen}
      onClick={() => toggle()}
      {...(rest as any)}
    >
      <span>{children}</span>
      <Chevron />
    </HeaderBtn>
  );
};

const PanelEl = styled.div<{ $open: boolean }>`
  overflow: hidden;
  max-height: ${({ $open }) => ($open ? '1000px' : '0')};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: max-height ${({ theme }) => theme.duration.slow}ms ${({ theme }) => theme.easing.standard},
              opacity ${({ theme }) => theme.duration.base}ms ${({ theme }) => theme.easing.standard};
  & > div {
    padding: 0 0 ${({ theme }) => theme.space[4]}px 0;
    color: ${({ theme }) => theme.color.subtext};
    font-size: ${({ theme }) => theme.font.size.md}px;
    line-height: ${({ theme }) => theme.font.lineHeight.body};
  }
`;

const Body = ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
  const { isOpen, headerId, panelId } = useItem();
  return (
    <PanelEl id={panelId} role="region" aria-labelledby={headerId} $open={isOpen} {...rest}>
      <div>{children}</div>
    </PanelEl>
  );
};

Accordion.Item = Item;
Accordion.Header = Header;
Accordion.Body = Body;
