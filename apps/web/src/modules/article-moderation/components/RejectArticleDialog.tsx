'use client';

import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Field } from '@workspace/ui/components/field';
import { Textarea } from '@workspace/ui/components/textarea';
import React, { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { SubmitButton } from '@/shared/components/SubmitButton';

import { rejectArticleAction } from '../actions/reject-article';

type Props = {
  articleId: string;
  className?: string;
};

export const RejectArticleDialog = ({ articleId, className }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [reason, setReason] = useState('');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={isPending}
          className={className}
          variant="destructive"
        >
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Article Rejection</DialogTitle>
          <DialogDescription>Describe rejection reason</DialogDescription>
        </DialogHeader>
        <form
          id="reject-article-form"
          onSubmit={() => {
            startTransition(async () => {
              const { error } = await rejectArticleAction(articleId, reason);

              if (error) {
                toast.error('Failed to reject article');
              }
            });
          }}
        >
          <Field>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Field>
        </form>
        <DialogFooter>
          <SubmitButton
            isSubmitting={isPending}
            form="reject-article-form"
            submittingText="Rejecting"
          >
            Reject
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
