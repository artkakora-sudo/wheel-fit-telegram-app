import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  return (
    <div className="app">
      <header className="app__header">
        <span className="app__badge">Wheel Fit</span>
        <h1 className="app__title">{title}</h1>
        {subtitle ? <p className="app__subtitle">{subtitle}</p> : null}
      </header>
      <main className="app__main">{children}</main>
    </div>
  );
}
