import { UserDto } from '@workspace/contracts';
import { createContext, ReactNode } from 'react';

type UserContextValue = {
  user: UserDto;
};

export const UserContext = createContext<UserContextValue | undefined>(
  undefined
);

type Props = {
  children: ReactNode;
  user: UserDto;
};

export const UserProvider = ({ user, children }: Props) => {
  return <UserContext value={{ user }}>{children}</UserContext>;
};
