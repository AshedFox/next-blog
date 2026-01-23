import { Button } from '@workspace/ui/components/button';
import React, { ReactNode } from 'react';

import Spinner from './Spinner';

type Props = {
  isSubmitting: boolean;
  disabled?: boolean;
  submittingText?: string;
  children: ReactNode;
  form?: string;
};

export const SubmitButton = ({
  children,
  isSubmitting,
  disabled = false,
  submittingText = 'Loading...',
  form,
}: Props) => {
  return (
    <Button form={form} type="submit" disabled={isSubmitting || disabled}>
      {isSubmitting ? (
        <>
          <Spinner /> {submittingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};
