import { useQuery } from '@tanstack/react-query';
import { UserDto } from '@workspace/contracts';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useCallback, useEffect } from 'react';

import { clientApi } from '@/lib/api/client';

type UserContextValue = {
  user: UserDto;
  refetchUser: () => Promise<void>;
};

export const UserContext = createContext<UserContextValue | undefined>(
  undefined
);

type Props = {
  children: ReactNode;
  user: UserDto;
};

export const UserProvider = ({ user, children }: Props) => {
  const { data, refetch, error } = useQuery({
    queryKey: ['user', user.id],
    queryFn: () => clientApi.getOrThrow<UserDto>(`/api/users/me`),
    initialData: user,
    refetchInterval: 60 * 1000,
  });
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.push('/login');
    }
  }, [error, router]);

  const refetchUser = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <UserContext
      value={{
        user: data,
        refetchUser,
      }}
    >
      {children}
    </UserContext>
  );
};
