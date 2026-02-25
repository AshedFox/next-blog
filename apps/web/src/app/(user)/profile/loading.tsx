import React from 'react';

import Spinner from '@/shared/components/Spinner';

export default function Loading() {
  return (
    <div className="py-20 flex justify-center w-full grow">
      <Spinner className="size-10" />
    </div>
  );
}
