'use client';

import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = {
  href: string;
  label: string;
};

const NavLink = ({ href, label }: Props) => {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === href : pathname.startsWith(href);

  return (
    <Button
      aria-current={isActive}
      className={cn('p-0 h-auto font-normal hover:no-underline', {
        'text-primary-highlight underline': isActive,
        'text-muted-foreground': !isActive,
      })}
      variant="link"
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default NavLink;
