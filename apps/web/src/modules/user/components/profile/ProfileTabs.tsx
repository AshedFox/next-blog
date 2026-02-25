import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import React from 'react';

import { ProfileArticlesTab } from './ProfileArticlesTab';
import { ProfileCommentsTab } from './ProfileCommentsTab';
import { ProfileListsTab } from './ProfileListsTab';

type Props = {
  userId: string;
};

export function ProfileTabs({ userId }: Props) {
  return (
    <Tabs
      defaultValue="articles"
      className="w-full flex flex-col gap-6 @container"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="articles">Articles</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
        <TabsTrigger value="lists">Lists</TabsTrigger>
      </TabsList>

      <TabsContent value="articles">
        <ProfileArticlesTab userId={userId} />
      </TabsContent>
      <TabsContent value="comments">
        <ProfileCommentsTab userId={userId} />
      </TabsContent>
      <TabsContent value="lists">
        <ProfileListsTab userId={userId} />
      </TabsContent>
    </Tabs>
  );
}
