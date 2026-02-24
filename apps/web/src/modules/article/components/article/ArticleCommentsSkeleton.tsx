import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import React from 'react';

const ArticleCommentsSkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle>Comments</CardTitle>
    </CardHeader>
    <CardContent className="p-4">
      <div className="flex flex-col gap-2">
        <div className="h-32 bg-accent animate-pulse rounded-xl" />
        <div className="h-32 bg-accent animate-pulse rounded-xl" />
        <div className="h-32 bg-accent animate-pulse rounded-xl" />
      </div>
    </CardContent>
  </Card>
);

export default ArticleCommentsSkeleton;
