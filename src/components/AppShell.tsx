import { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  sidebarWidth?: number;
}

const AppShell = ({ children, sidebarWidth = 0 }: AppShellProps) => {
  return (
    <div
      className="min-h-screen bg-background transition-all duration-300"
      style={{ marginLeft: sidebarWidth }}
    >
      <div className="mx-auto max-w-[1280px]">
        {children}
      </div>
    </div>
  );
};

export default AppShell;
