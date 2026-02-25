import { UserDto } from '@workspace/contracts';
import React from 'react';

import { ProfileSidebar } from './ProfileSidebar';

type Props = {
  user: UserDto;
  isOwnProfile?: boolean;
  children: React.ReactNode;
};

export function UserProfileView({ user, isOwnProfile, children }: Props) {
  return (
    <div className="@container">
      <div className="flex flex-col @md:flex-row gap-8 @md:gap-12 py-8 max-w-6xl mx-auto px-4">
        <ProfileSidebar user={user} isOwnProfile={isOwnProfile} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
