import { UserDto } from '@workspace/contracts';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { cn } from '@workspace/ui/lib/utils';
import React, { memo } from 'react';

type Props = {
  user: UserDto;
  className?: string;
};

export const UserAvatar = memo(({ user, className }: Props) => {
  return (
    <Avatar className={cn('select-none', className)} translate="no">
      <AvatarFallback>
        {user.username
          .split('-')
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase())
          .join('')}
      </AvatarFallback>
    </Avatar>
  );
});

UserAvatar.displayName = 'UserAvatar';
