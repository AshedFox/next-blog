import React from 'react';

import { ProfileDropdown } from '@/modules/user/client';
import { getMe } from '@/modules/user/server';

import NavLink from './NavLink';

const ProfileOrLogin = async () => {
  const user = await getMe();

  if (!user) {
    return <NavLink href="/login" label="Login" />;
  }

  return <ProfileDropdown user={user} />;
};

export default ProfileOrLogin;
