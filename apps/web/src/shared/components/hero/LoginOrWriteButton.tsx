import { Button } from '@workspace/ui/components/button';
import { ArrowRight, UserIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { getMe } from '@/modules/user/server';

const LoginOrWriteButton = async () => {
  const user = await getMe();

  if (!user) {
    return (
      <Button size="xl" asChild>
        <Link href="/login">
          Join Us <UserIcon />
        </Link>
      </Button>
    );
  }

  return (
    <Button size="xl" asChild>
      <Link href="/articles/new">
        Start writing <ArrowRight />
      </Link>
    </Button>
  );
};

export default LoginOrWriteButton;
