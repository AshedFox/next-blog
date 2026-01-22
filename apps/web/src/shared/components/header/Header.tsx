import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { cn } from '@workspace/ui/lib/utils';
import React, { Suspense } from 'react';

import { Logo } from '../Logo';
import { BurgerMenu } from './BurgerMenu';
import Nav from './Nav';
import ProfileOrLogin from './ProfileOrLogin';
import { ThemeSwitch } from './ThemeSwitch';

type Props = {
  variant?: 'full' | 'compact';
};

export const Header = async ({ variant = 'full' }: Props) => {
  return (
    <header className="border-b w-full bg-background px-2 @container">
      <div
        className={cn(
          'grid items-center max-w-6xl mx-auto py-3 gap-2 @md:gap-4 @lg:gap-6',
          {
            'grid-cols-[1fr_auto_1fr] @md:grid-cols-[auto_auto_1fr]':
              variant === 'full',
            'grid-cols-2': variant === 'compact',
          }
        )}
      >
        {variant === 'full' && <BurgerMenu className="@md:hidden" />}
        <Logo />
        {variant === 'full' && <Nav className="hidden @md:flex" />}
        <div className="ml-auto flex items-center gap-2 @md:gap-3">
          <ThemeSwitch />
          <Suspense
            fallback={
              <Avatar>
                <AvatarFallback />
              </Avatar>
            }
          >
            <ProfileOrLogin />
          </Suspense>
        </div>
      </div>
    </header>
  );
};
