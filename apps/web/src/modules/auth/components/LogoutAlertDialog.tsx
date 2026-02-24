'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import React, { useTransition } from 'react';

import { logoutAction } from '@/modules/auth/client';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const LogoutAlertDialog = ({ open, onOpenChange }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await logoutAction();
      onOpenChange(false);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You will need to login again to access
            your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} disabled={isPending}>
            {isPending ? 'Logging out...' : 'Logout'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
