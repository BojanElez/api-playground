import type { ReactNode } from 'react';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="main-page">
      <div className="container">{children}</div>
    </main>
  );
};

export default AppLayout;
