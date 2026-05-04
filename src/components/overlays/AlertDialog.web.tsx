/**
 * AlertDialog — Aurum Design System (Web)
 *
 * Same chrome as Dialog but role="alertdialog", scrim click does NOT close
 * by default, and the API enforces an action + cancel pair. Use for
 * destructive confirmations.
 */
import React from 'react';
import styled from 'styled-components';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from './Dialog.web';

export interface AlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function AlertDialog(props: AlertDialogProps) {
  return <Dialog {...props} />;
}

const AlertContent = (p: React.ComponentProps<typeof DialogContent>) => (
  <DialogContent dismissOnScrimClick={false} role="alertdialog" {...p} />
);

const ActionsRow = styled(DialogFooter)``;

AlertDialog.Trigger = DialogTrigger;
AlertDialog.Cancel = DialogClose;
AlertDialog.Action = DialogClose;
AlertDialog.Content = AlertContent;
AlertDialog.Title = DialogTitle;
AlertDialog.Description = DialogDescription;
AlertDialog.Footer = ActionsRow;
