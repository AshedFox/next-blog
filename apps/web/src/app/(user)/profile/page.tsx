import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';

import { getMe, ProfileTabs, UserProfileView } from '@/modules/user/server';

export const metadata: Metadata = {
  title: 'My Profile',
};

export default async function MyProfilePage() {
  const user = await getMe();

  if (!user) {
    redirect('/login');
  }

  return (
    <UserProfileView user={user} isOwnProfile>
      <ProfileTabs userId={user.id} />
    </UserProfileView>
  );
}
