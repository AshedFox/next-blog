import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import { getUser, ProfileTabs, UserProfileView } from '@/modules/user/server';

type Props = {
  params: Promise<{ idOrUsername: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { idOrUsername } = await params;

  let user;
  try {
    user = await getUser(idOrUsername);
  } catch {
    return { title: 'User Not Found' };
  }

  return {
    title: `${user.name} (@${user.username})`,
    description: `Profile of ${user.name} on Memora`,
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { idOrUsername } = await params;

  let user;
  try {
    user = await getUser(idOrUsername);
  } catch {
    notFound();
  }

  return (
    <UserProfileView user={user}>
      <ProfileTabs userId={user.id} />
    </UserProfileView>
  );
}
