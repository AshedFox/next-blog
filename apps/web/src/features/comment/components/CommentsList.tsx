'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { CommentSearchResponseDto } from '@workspace/contracts';
import { Button } from '@workspace/ui/components/button';
import React, { useCallback, useMemo, useRef } from 'react';
import { useOnInView } from 'react-intersection-observer';

import { useInfiniteComments } from '../hooks';
import { CommentCard } from './CommentCard';

type Props = {
  articleId: string;
  initialData: CommentSearchResponseDto;
  currentUserId?: string;
};

export const CommentsList = ({
  articleId,
  initialData,
  currentUserId,
}: Props) => {
  const { fetchNextPage, hasNextPage, data, isFetchingNextPage } =
    useInfiniteComments(articleId, initialData);

  const inViewRef = useOnInView((inView) => {
    if (inView) {
      fetchNextPage();
    }
  });

  const comments = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const parentRef = useRef<HTMLDivElement>(null);

  const getItemKey = useCallback(
    (index: number) => {
      const comment = comments[index];
      if (comment) {
        return comment.id;
      }
      return 'loader-item';
    },
    [comments]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: hasNextPage ? comments.length + 1 : comments.length,
    estimateSize: () => 106,
    overscan: 5,
    getScrollElement: () => parentRef.current,
    getItemKey,
  });

  return (
    <div
      ref={parentRef}
      className={'overflow-y-auto [scrollbar-gutter:stable] max-h-240 p-1'}
    >
      {comments.length > 0 ? (
        <div
          className="w-full relative"
          style={{
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index > comments.length - 1;
            const comment = comments[virtualRow.index]!;

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="absolute top-0 left-0 w-full not-last:pb-2"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  <Button
                    ref={inViewRef}
                    variant="ghost"
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                  >
                    {isFetchingNextPage
                      ? 'Loading more...'
                      : hasNextPage
                        ? 'Load Newer'
                        : 'Nothing more to load'}
                  </Button>
                ) : (
                  <CommentCard
                    comment={comment}
                    isOwn={comment.authorId === currentUserId}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground size-full flex items-center justify-center">
          No comments yet...
        </div>
      )}
    </div>
  );
};
