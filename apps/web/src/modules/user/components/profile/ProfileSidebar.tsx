import { UserDto } from '@workspace/contracts';
import { Button } from '@workspace/ui/components/button';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import Link from 'next/link';

import { UserAvatar } from '../UserAvatar';

type Props = {
  user: UserDto;
  isOwnProfile?: boolean;
};

export function ProfileSidebar({ user, isOwnProfile }: Props) {
  return (
    <div className="flex flex-col @md:w-64 shrink-0 gap-6 items-center @md:items-start text-center @md:text-left">
      <div className="relative">
        <UserAvatar
          user={user}
          className="size-32 text-4xl border-4 border-background"
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <h1 className="text-2xl font-bold wrap-break-words">{user.name}</h1>
        <span className="text-muted-foreground break-all">
          @{user.username}
        </span>
      </div>

      <div className="flex flex-col gap-2 text-sm text-muted-foreground w-full">
        <div className="flex items-center gap-2 justify-center @md:justify-start">
          <CalendarIcon className="size-4 shrink-0" />
          <span>Joined {format(new Date(user.createdAt), 'MMMM yyyy')}</span>
        </div>
      </div>

      {isOwnProfile && (
        <Button variant="outline" className="w-full" asChild>
          <Link href="/settings/profile">Edit Profile</Link>
        </Button>
      )}
    </div>
  );
}
