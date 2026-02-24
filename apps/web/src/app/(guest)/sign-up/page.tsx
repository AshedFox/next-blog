import { Metadata } from 'next';
import React from 'react';

import { SignUpForm } from '@/modules/auth/client';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default async function Page() {
  return (
    <div className="grow flex items-center justify-center from-primary/20 to-card bg-linear-115">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
