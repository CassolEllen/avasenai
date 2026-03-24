import { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-background relative overflow-hidden"
         style={{ minHeight: '100dvh' }}>
      {children}
    </div>
  );
};

export default AppShell;
