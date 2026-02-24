'use client';

import { CreateListDto, ListDto } from '@workspace/contracts';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@workspace/ui/lib/utils';
import { ListPlusIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useOnInView } from 'react-intersection-observer';

import { CreateListDialog } from '@/modules/list/client';
import Spinner from '@/shared/components/Spinner';

import { useArticleCustomListsManager } from '../hooks';

type Props = {
  articleId: string;
  includedInCustomLists: ListDto[];
};

export const ArticleCustomListsDropdown = ({
  articleId,
  includedInCustomLists,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const {
    actions: { addToList, createList, removeFromList },
    isPending,
    availableLists,
    optimisticIncluded,
    listQuery: {
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isPending: isListsPending,
    },
  } = useArticleCustomListsManager(articleId, includedInCustomLists, isOpen);

  const inViewRef = useOnInView((inView) => {
    if (inView) {
      fetchNextPage();
    }
  });

  const handleCreate = async (input: CreateListDto) => {
    await createList(input);
    setIsCreateOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            'rounded-full',
            'hover:text-cyan-500 hover:bg-cyan-200 hover:border-cyan-200',
            'focus-visible:ring-cyan-500',
            'dark:hover:text-cyan-500 dark:hover:bg-cyan-900/20 dark:hover:border-cyan-900/50',
            'dark:focus-visible:ring-cyan-500'
          )}
          variant="outline"
          size="icon-lg"
          title="Custom"
        >
          <ListPlusIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {optimisticIncluded.length > 0 && (
          <>
            <DropdownMenuLabel>Selected</DropdownMenuLabel>
            <DropdownMenuGroup>
              <ScrollArea className="*:data-radix-scroll-area-viewport:max-h-42">
                <div>
                  {optimisticIncluded.map((list) => (
                    <DropdownMenuCheckboxItem
                      checked={true}
                      key={list.id}
                      onSelect={(e) => {
                        e.preventDefault();
                        removeFromList(list);
                      }}
                    >
                      {list.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </ScrollArea>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuLabel>Add to...</DropdownMenuLabel>
        <DropdownMenuGroup>
          {isListsPending ? (
            <div className="flex items-center justify-center w-full p-2">
              <Spinner className="size-8" />
            </div>
          ) : availableLists.length === 0 ? (
            <DropdownMenuItem disabled>No lists yet</DropdownMenuItem>
          ) : (
            <ScrollArea className="*:data-radix-scroll-area-viewport:max-h-42">
              <div>
                {availableLists.map((list) => (
                  <DropdownMenuCheckboxItem
                    key={list.id}
                    checked={false}
                    onSelect={(e) => {
                      e.preventDefault();
                      addToList(list);
                    }}
                  >
                    {list.name}
                  </DropdownMenuCheckboxItem>
                ))}
                {hasNextPage && (
                  <Button
                    ref={inViewRef}
                    variant="ghost"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                  </Button>
                )}
              </div>
            </ScrollArea>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <CreateListDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onCreate={handleCreate}
          isPending={isPending}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
