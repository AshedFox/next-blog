import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import React from 'react';

const ArticleSidebarSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About author</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2 items-center">
        <div className="size-20 bg-accent animate-pulse rounded-full" />
        <div className="grow space-y-1">
          <div className="h-6 bg-accent animate-pulse rounded-xl" />
          <div className="h-5 bg-accent animate-pulse rounded-xl" />
          <div className="h-4 bg-accent animate-pulse rounded-xl" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full h-8 bg-accent animate-pulse rounded-xl" />
      </CardFooter>
    </Card>
  );
};

export default ArticleSidebarSkeleton;
