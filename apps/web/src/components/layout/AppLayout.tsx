import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  hideNav?: boolean;
}

export function AppLayout({ children, title, subtitle, hideNav }: AppLayoutProps) {
  return (
    <>
      <Header title={title} subtitle={subtitle} />
      <main className="flex-1 overflow-y-auto">{children}</main>
      {!hideNav && <BottomNav />}
    </>
  );
}
