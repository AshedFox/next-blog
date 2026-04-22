import { Button } from '@workspace/ui/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';

import { getArticleModerationLogs } from '../api/server-query';

type Props = {
  articleId: string;
};

export const ModerationLogsDropdown = async ({ articleId }: Props) => {
  const { data, error } = await getArticleModerationLogs(articleId, {
    include: ['admin'],
    limit: 20,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          Moderation logs
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3 space-y-2 max-h-64 overflow-y-auto">
        {error ? (
          <div className="text-sm text-muted-foreground">
            Failed to load moderation logs
          </div>
        ) : data.data.length === 0 ? (
          <div className="text-sm text-muted-foreground">No logs yet</div>
        ) : (
          data.data.map((log) => (
            <div key={log.id} className="rounded-md border p-3 text-sm">
              <div className="font-medium">
                Status changed to &quot;{log.statusTo.toLowerCase()}&quot;
              </div>
              <div className="text-muted-foreground text-xs">
                At {format(log.createdAt, 'PPpp')}
              </div>
              {log.admin && (
                <div>
                  <span className="text-muted-foreground text-xs">By </span>
                  <Button
                    className="p-0 size-auto"
                    variant="link"
                    size="sm"
                    asChild
                  >
                    <Link href={`/users/${log.admin.username}`}>
                      {log.admin.username}
                    </Link>
                  </Button>
                </div>
              )}
              {log.reason && (
                <div className="mt-2">
                  <div className=" text-muted-foreground text-xs">Reason</div>
                  <div className="whitespace-pre-wrap">{log.reason}</div>
                </div>
              )}
            </div>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
};
