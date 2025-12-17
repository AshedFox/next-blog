'use client';

import { Button } from '@workspace/ui/components/button';
import { CheckIcon, CopyIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';

type Props = {
  text: string;
  className?: string;
};

const CopyButton = ({ text, className }: Props) => {
  const [copied, setCopied] = useState(false);
  const onClick = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }, [text]);

  return (
    <Button
      type="button"
      className={className}
      variant="outline"
      onClick={onClick}
    >
      {copied ? (
        <>
          <CheckIcon />
          <span className="hidden @md:inline">Copied</span>
        </>
      ) : (
        <>
          <CopyIcon />
          <span className="hidden @md:inline">Copy</span>
        </>
      )}
    </Button>
  );
};

export default CopyButton;
