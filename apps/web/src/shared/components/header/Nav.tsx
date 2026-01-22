import { cn } from '@workspace/ui/lib/utils';
import React, { Suspense } from 'react';

import NavLink from './NavLink';

type Props = {
  className?: string;
};

const Nav = ({ className }: Props) => {
  return (
    <nav className={cn('flex items-center gap-3 @md:gap-5', className)}>
      <Suspense>
        <NavLink href="/" label="Home" />
        <NavLink href="/articles" label="Articles" />
      </Suspense>
    </nav>
  );
};

export default Nav;
