import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { CompassIcon, SparklesIcon } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react';

import LoginOrWriteButton from './LoginOrWriteButton';

export const HeroSection = () => {
  return (
    <section className="relative bg-hero text-hero-foreground shadow-2xl rounded-b-4xl md:rounded-b-[4rem] overflow-hidden py-10 lg:py-14 xl:py-18 2xl:py-20 min-h-[80svh] px-4 flex items-center justify-center @container">
      <div className="absolute top-0 left-0 size-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-66 -right-66 size-132 rounded-full blur-3xl bg-primary/70" />
        <div className="absolute -bottom-16 -left-24 size-92 rounded-full blur-3xl bg-primary/70" />
      </div>
      <div className="max-w-6xl relative flex flex-col items-center gap-6 @sm:gap-8 @lg:gap-10">
        <Badge size="lg">
          <SparklesIcon />
          Where words matter
        </Badge>
        <div className="z-10 flex flex-col items-center gap-4 @sm:gap-6 @lg:gap-10 text-center">
          <h1 className="text-5xl @xs:text-6xl @md:text-7xl @lg:text-8xl @xl:text-9xl font-black leading-[1.2]">
            Ideas that
            <br />
            <span className="text-primary-highlight">shape the future</span>
          </h1>
          <p className="text-sm @sm:text-base @lg:text-lg text-hero-foreground/70">
            A home for bold thinking and deep stories. Craft your masterpiece
            with our distraction-free editor or discover perspectives that
            inspire.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 @md:gap-4 justify-center">
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
