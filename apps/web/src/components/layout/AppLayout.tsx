import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  activeNav?: string;
  hideNav?: boolean;
}

export function AppLayout({ children, title, subtitle, activeNav, hideNav }: AppLayoutProps) {
  return (
    <>
      <Header title={title} subtitle={subtitle} />
      <main className="flex-1 overflow-y-auto">{children}</main>
      {!hideNav && <BottomNav active={activeNav} />}
    </>
  );
}
