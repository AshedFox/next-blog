import Link from 'next/link';
import React from 'react';

export const Logo = () => {
  return (
    <Link
      href="/"
      className="group inline-flex items-baseline gap-0.5 select-none"
    >
      <span className="font-heading text-2xl font-extrabold tracking-tighter text-foreground">
        Memora
      </span>
      <span className="size-2.5 rounded-full bg-primary-highlight transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:-translate-y-1.5" />
    </Link>
  );
};
