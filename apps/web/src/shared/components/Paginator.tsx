import { ReactNode } from 'react';

import { createSearchParams } from '@/lib/search-params';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination';

function makePaginationPages(
  currentPage: number,
  totalPages: number,
  makeHref: (page: number) => string
): ReactNode[] {
  const pageItems: ReactNode[] = [];

  const createPageItem = (page: number) => (
    <PaginationItem key={page}>
      <PaginationLink href={makeHref(page)} isActive={page === currentPage}>
        {page}
      </PaginationLink>
    </PaginationItem>
  );

  const createEllipsis = (key: string) => (
    <PaginationItem key={key}>
      <PaginationEllipsis />
    </PaginationItem>
  );

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageItems.push(createPageItem(i));
    }
  } else {
    pageItems.push(createPageItem(1));
    pageItems.push(createPageItem(2));

    if (currentPage > 3 && currentPage < totalPages - 2) {
      pageItems.push(createEllipsis('start'));
      pageItems.push(createPageItem(currentPage));
      pageItems.push(createEllipsis('end'));
    } else if (currentPage > 2 && currentPage <= totalPages - 2) {
      pageItems.push(createEllipsis('start'));
    }

    pageItems.push(createPageItem(totalPages - 1));
    pageItems.push(createPageItem(totalPages));
  }

  return pageItems;
}

type Props = {
  pathname: string;
  searchParams: Record<string, string | string[] | undefined>;
  currentPage: number;
  totalPages: number;
  showNextPrev?: boolean;
  className?: string;
};

export function Paginator({
  currentPage,
  totalPages,
  showNextPrev,
  className,
  pathname,
  searchParams,
}: Props) {
  const makeHref = (page: number) => {
    const params = createSearchParams(searchParams);
    params.set('page', String(page));

    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        {showNextPrev && currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              prefetch={true}
              href={makeHref(currentPage - 1)}
            />
          </PaginationItem>
        )}
        {makePaginationPages(currentPage, totalPages, makeHref)}
        {showNextPrev && currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext prefetch={true} href={makeHref(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
