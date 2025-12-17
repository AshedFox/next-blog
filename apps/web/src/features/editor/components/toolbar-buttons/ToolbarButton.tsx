'use client';

import { Button } from '@workspace/ui/components/button';
import React, { memo, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  isActive: boolean;
  disabled?: boolean;
  onClick: () => void;
};

const ToolbarButton = memo(
  ({ isActive, disabled, onClick, children }: Props) => {
    console.log('rerender toolbar button :)');

    return (
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        size="icon-sm"
        type="button"
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </Button>
    );
  }
);

ToolbarButton.displayName = 'ToolbarButton';

export default ToolbarButton;
