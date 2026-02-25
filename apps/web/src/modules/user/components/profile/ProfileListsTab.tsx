import React from 'react';

import { ListCard } from '@/modules/list/client';
import { fetchUserLists } from '@/modules/list/server';

type Props = {
  userId: string;
};

export async function ProfileListsTab({ userId }: Props) {
  const { data: lists, error } = await fetchUserLists(userId, {
    limit: 20,
  });

  if (error || !lists?.data.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No lists yet.
      </div>
    );
  }

  const sortedLists = [...lists.data].sort((a, b) => {
    if (a.systemType && !b.systemType) {
      return -1;
    }
    if (!a.systemType && b.systemType) {
      return 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="grid grid-cols-1 @lg:grid-cols-2 gap-4">
      {sortedLists.map((list) => (
        <ListCard key={list.id} list={list} />
      ))}
    </div>
  );
}
