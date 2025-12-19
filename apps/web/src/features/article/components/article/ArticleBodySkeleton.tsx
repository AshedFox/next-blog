import { Card, CardContent } from '@workspace/ui/components/card';
import React from 'react';

const ArticleBodySkeleton = () => {
  return (
    <Card className="p-4 @md:p-6 @xl:p-8">
      <CardContent className="space-y-4 p-0">
        <div className="h-12 bg-accent animate-pulse rounded-xl" />
        <div className="h-48 bg-accent animate-pulse rounded-xl" />
        <div className="h-8 bg-accent animate-pulse rounded-xl" />
        <div className="h-8 bg-accent animate-pulse rounded-xl" />
      </CardContent>
    </Card>
  );
};

export default ArticleBodySkeleton;
