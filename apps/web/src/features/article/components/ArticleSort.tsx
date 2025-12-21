'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'createdAt:desc', label: 'Newest' },
  { value: 'createdAt:asc', label: 'Oldest' },
  { value: 'title:asc', label: 'A-Z' },
  { value: 'title:desc', label: 'Z-A' },
];

const ArticleSort = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultSort = searchParams.get('sort') ?? 'createdAt:desc';

  const handleSortChange = (sort: string) => {
    if (sort === searchParams.get('sort')) {
      return;
    }

    const params = new URLSearchParams(searchParams);

    params.delete('page');
    params.set('sort', sort);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      defaultValue={defaultSort}
      onValueChange={(value) => handleSortChange(value)}
    >
      <SelectTrigger className="w-42">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ArticleSort;
