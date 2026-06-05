'use client';

import { MapPin, Search, Bike, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { label: 'Nearby', icon: MapPin, href: '/' },
  { label: 'Search', icon: Search, href: '/search' },
  { label: 'Ride', icon: Bike, href: '/ride' },
  { label: 'History', icon: Clock, href: '/history' },
  { label: 'Profile', icon: User, href: '/profile' },
];

interface BottomNavProps {
  active?: string;
}

export function BottomNav({ active = '/' }: BottomNavProps) {
  return (
    <nav className="safe-bottom sticky bottom-0 z-40 border-t bg-background">
      <div className="flex h-16 items-center justify-around px-2">
        {items.map(({ label, icon: Icon, href }) => (
          <a
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors',
              active === href
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
