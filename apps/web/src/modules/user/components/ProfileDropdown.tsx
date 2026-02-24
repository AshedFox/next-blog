'use client';

import { UserDto } from '@workspace/contracts';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { LogOutIcon, PencilIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import { LogoutAlertDialog } from '@/modules/auth/client';

import { UserAvatar } from './UserAvatar';

type Props = {
  user: UserDto;
};

export const ProfileDropdown = ({ user }: Props) => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <>
      <LogoutAlertDialog onOpenChange={setIsLogoutOpen} open={isLogoutOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <UserAvatar user={user} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <UserIcon />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/articles/new">
              <PencilIcon />
              Write article
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setIsLogoutOpen(true)}
          >
            <LogOutIcon />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
