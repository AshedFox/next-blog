'use client';

import { CommentDto } from '@workspace/contracts';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';

import { SubmitButton } from '@/shared/components/SubmitButton';

import { useEditComment } from '../../hooks';
import { EditCommentFields } from './EditCommentFields';

type Props = {
  id: string;
  initialData: CommentDto;
};

export const EditCommentDialog = ({ id, initialData }: Props) => {
  const [open, setOpen] = useState(false);
  const { form, isPending, isDirty, onSubmit } = useEditComment(
    id,
    initialData,
    () => setOpen(false)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="outline">
          <PencilIcon className="size-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Edit comment</DialogTitle>
            <DialogDescription>
              Make changes to your comment here.
            </DialogDescription>
          </DialogHeader>
          <EditCommentFields control={form.control} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <SubmitButton isSubmitting={isPending} disabled={!isDirty}>
                Save
              </SubmitButton>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
