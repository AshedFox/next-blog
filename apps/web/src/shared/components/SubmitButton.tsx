import { Button } from '@workspace/ui/components/button';
import React, { ReactNode } from 'react';

import Spinner from './Spinner';

type Props = {
  isSubmitting: boolean;
  disabled?: boolean;
  submittingText?: string;
  children: ReactNode;
};

export const SubmitButton = ({
  children,
  isSubmitting,
  disabled = false,
  submittingText = 'Loading...',
}: Props) => {
  return (
    <Button type="submit" disabled={isSubmitting || disabled}>
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
