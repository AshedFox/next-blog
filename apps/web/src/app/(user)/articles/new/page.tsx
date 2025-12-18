import { Metadata } from 'next';

import { CreateArticleForm } from '@/features/article/client';

export const metadata: Metadata = {
  title: 'New Article',
};

export default async function Page() {
  return (
    <div className="grow flex items-center justify-center from-primary/20 to-card bg-linear-135 px-2 py-8">
      <div className="w-full max-w-4xl">
        <CreateArticleForm />
      </div>
    </div>
  );
}
