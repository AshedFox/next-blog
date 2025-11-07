import { Metadata } from 'next';
import React from 'react';

import { LoginForm } from '@/features/auth/client';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function Page() {
  'use cache';

  return (
    <div className="grow flex items-center justify-center from-primary/15 to-card bg-linear-135">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
