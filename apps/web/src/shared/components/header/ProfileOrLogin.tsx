import React from 'react';

import { ProfileDropdown } from '@/features/user/client';
import { getMe } from '@/features/user/server';

import NavLink from './NavLink';

const ProfileOrLogin = async () => {
  const user = await getMe();

  if (!user) {
    return <NavLink href="/login" label="Login" />;
  }

  return <ProfileDropdown user={user} />;
};

export default ProfileOrLogin;
