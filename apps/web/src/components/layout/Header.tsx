import { MapPin } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = 'Vehicle Sharing', subtitle }: HeaderProps) {
  return (
    <header className="safe-top sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-2 px-4">
        <MapPin className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm font-semibold leading-none">{title}</p>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
