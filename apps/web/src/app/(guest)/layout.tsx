import React from 'react';

import { Header } from '@/shared/components/header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header variant="compact" />
      {children}
    </>
  );
};

export default Layout;
