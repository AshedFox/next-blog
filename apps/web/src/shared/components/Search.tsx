'use client';

import { Button } from '@workspace/ui/components/button';
import { ButtonGroup } from '@workspace/ui/components/button-group';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@workspace/ui/components/input-group';
import { SearchIcon, XIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const Search = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (search == searchParams.get('search')) {
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.delete('page');

    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form className="flex items-center gap-2 w-full" onSubmit={handleSearch}>
      <ButtonGroup className="grow">
        <InputGroup>
          <InputGroupInput
            name="search"
            value={search}
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              disabled={search.length === 0}
              onClick={() => setSearch('')}
            >
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <Button variant="outline" aria-label="search">
          <SearchIcon />
        </Button>
      </ButtonGroup>
    </form>
  );
};

export default Search;
