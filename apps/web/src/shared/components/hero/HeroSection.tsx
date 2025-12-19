import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { CompassIcon, SparklesIcon } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react';

import LoginOrWriteButton from './LoginOrWriteButton';

export const HeroSection = () => {
  return (
    <section className="relative bg-hero text-hero-foreground shadow-2xl rounded-b-[4rem] overflow-hidden py-20 px-4">
      <div className="absolute top-0 left-0 size-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-66 -right-66 size-132 rounded-full blur-3xl bg-primary/70" />
        <div className="absolute -bottom-16 -left-24 size-92 rounded-full blur-3xl bg-primary/70" />
      </div>
      <div className="max-w-4xl mx-auto relative flex flex-col items-center gap-12">
        <Badge size="lg">
          <SparklesIcon />
          Where words matter
        </Badge>
        <div className="flex flex-col items-center gap-10 text-center">
          <h1 className="text-6xl xl:text-8xl font-bold leading-tight">
            Ideas that
            <br />
            <span className="text-primary-highlight">shape the future</span>
          </h1>
          <p className="text-xl xl:text-2xl text-hero-foreground/70">
            A home for bold thinking and deep stories. Craft your masterpiece
            with our distraction-free editor or discover perspectives that
            inspire.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-2 md:gap-4 justify-center">
          <Button variant="secondary" size="xl" asChild>
            <Link href="/articles">
              <CompassIcon /> Discover
            </Link>
          </Button>
          <Suspense>
            <LoginOrWriteButton />
          </Suspense>
        </div>
      </div>
    </section>
  );
};
