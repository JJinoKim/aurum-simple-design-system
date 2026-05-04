/**
 * Shared height map per `ControlSize`. Components reach for this so the SM /
 * MD / LG axis is consistent across Button, Input, Select, etc.
 */
import { size } from '../../../tokens/size';
import type { ControlSize } from './types';

export const controlHeight: Record<ControlSize, number> = {
  sm: size.controlSm,
  md: size.controlMd,
  lg: size.controlLg,
};

export const controlPaddingX: Record<ControlSize, number> = {
  sm: 10,
  md: 14,
  lg: 18,
};

export const controlFontSize: Record<ControlSize, number> = {
  sm: 13,
  md: 15,
  lg: 15,
};

let _id = 0;
export const nextId = (prefix = 'aurum'): string => `${prefix}-${++_id}`;
