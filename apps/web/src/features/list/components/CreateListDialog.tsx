import { CreateListDto } from '@workspace/contracts';
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
import React from 'react';

import { SubmitButton } from '@/shared/components/SubmitButton';

import { CreateListForm } from './CreateListForm';

type Props = {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  onCreate: (input: CreateListDto) => void;
  isPending: boolean;
};

export const CreateListDialog = ({
  isOpen,
  onOpenChange,
  onCreate,
  isPending,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Create List
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create List</DialogTitle>
          <DialogDescription>
            Create a new list to add articles to.
          </DialogDescription>
        </DialogHeader>
        <CreateListForm
          id="create-list-form"
          onSubmit={onCreate}
          disabled={isPending}
        />
        <DialogFooter>
          <SubmitButton
            form="create-list-form"
            isSubmitting={isPending}
            submittingText="Creating..."
          >
            Create
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
